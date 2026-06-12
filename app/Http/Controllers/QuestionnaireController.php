<?php

namespace App\Http\Controllers;

use App\Models\Questionnaire;
use App\Models\Question;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QuestionnaireController extends Controller
{
    public function index()
    {
        $questionnaires = Questionnaire::with('creator')
            ->withCount('responses')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($q) => [
                'id'              => $q->id,
                'title'           => $q->title,
                'description'     => $q->description,
                'slug'            => $q->slug,
                'is_active'       => $q->is_active,
                'closes_at'       => $q->closes_at?->format('Y-m-d'),
                'responses_count' => $q->responses_count,
                'created_by'      => $q->creator->name,
                'created_at'      => $q->created_at->format('d M Y'),
                'fill_url'        => route('questionnaire.fill', $q->slug),
            ]);

        return Inertia::render('Questionnaire/Index', [
            'questionnaires' => $questionnaires,
        ]);
    }

    public function create()
    {
        return Inertia::render('Questionnaire/Builder');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'                        => 'required|string|max:255',
            'description'                  => 'nullable|string|max:2000',
            'image'                        => 'nullable|image|max:4096',
            'closes_at'                    => 'nullable|date|after:now',
            'questions'                    => 'required|array|min:1',
            'questions.*.type'             => 'required|in:short_text,paragraph,multiple_choice,checkboxes,dropdown,date,number',
            'questions.*.label'            => 'required|string|max:500',
            'questions.*.is_required'      => 'boolean',
            'questions.*.options'          => 'nullable|array',
            'questions.*.options.*'        => 'string|max:255',
        ]);

        $slug = $this->uniqueSlug($request->title);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = ImageService::storeAsWebp($request->file('image'), 'questionnaires');
        }

        $questionnaire = Questionnaire::create([
            'created_by'  => $request->user()->id,
            'title'       => $request->title,
            'description' => $request->description,
            'image'       => $imagePath,
            'slug'        => $slug,
            'closes_at'   => $request->closes_at,
        ]);

        foreach ($request->questions as $i => $q) {
            $needsOptions = in_array($q['type'], ['multiple_choice', 'checkboxes', 'dropdown']);
            Question::create([
                'questionnaire_id' => $questionnaire->id,
                'type'             => $q['type'],
                'label'            => $q['label'],
                'is_required'      => $q['is_required'] ?? false,
                'order'            => $i,
                'options'          => $needsOptions ? ($q['options'] ?? []) : null,
            ]);
        }

        return redirect(route('questionnaires.show', $questionnaire->slug))
            ->with('success', 'Questionnaire created successfully.');
    }

    public function show(Questionnaire $questionnaire)
    {
        $questionnaire->load(['questions', 'creator']);

        $responses = $questionnaire->responses()
            ->with('answers')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'               => $r->id,
                'respondent_name'  => $r->respondent_name,
                'respondent_phone' => $r->respondent_phone,
                'amount'           => $r->amount,
                'submitted_at'     => $r->created_at->format('d M Y, h:i A'),
                'answers'          => $r->answers->mapWithKeys(fn($a) => [
                    $a->question_id => $a->answer,
                ])->all(),
            ]);

        return Inertia::render('Questionnaire/Results', [
            'questionnaire' => [
                'id'              => $questionnaire->id,
                'title'           => $questionnaire->title,
                'description'     => $questionnaire->description,
                'image_url'       => $questionnaire->image ? asset('storage/' . $questionnaire->image) : null,
                'slug'            => $questionnaire->slug,
                'is_active'       => $questionnaire->is_active,
                'closes_at'       => $questionnaire->closes_at?->format('Y-m-d'),
                'created_by'      => $questionnaire->creator->name,
                'questions'       => $questionnaire->questions->map(fn($q) => [
                    'id'          => $q->id,
                    'type'        => $q->type,
                    'label'       => $q->label,
                    'is_required' => $q->is_required,
                    'options'     => $q->options,
                ]),
            ],
            'responses'      => $responses,
            'fill_url'       => route('questionnaire.fill', $questionnaire->slug),
        ]);
    }

    public function exportCsv(Questionnaire $questionnaire): StreamedResponse
    {
        $questionnaire->load(['questions', 'responses.answers']);

        $questions = $questionnaire->questions->sortBy('order');

        $filename = Str::slug($questionnaire->title) . '-responses-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($questionnaire, $questions) {
            $out = fopen('php://output', 'w');

            // BOM for Excel UTF-8 compatibility
            fwrite($out, "\xEF\xBB\xBF");

            // Header row
            $headers = ['Respondent Name', 'Phone', 'Submitted At'];
            foreach ($questions as $q) {
                $headers[] = $q->label;
            }
            $headers[] = 'Amount (₹)';
            fputcsv($out, $headers);

            // Data rows
            foreach ($questionnaire->responses->sortByDesc('created_at') as $r) {
                $answersByQuestion = $r->answers->keyBy('question_id');

                $row = [
                    $r->respondent_name,
                    $r->respondent_phone,
                    $r->created_at->format('d/m/Y h:i A'),
                ];

                foreach ($questions as $q) {
                    $answer = $answersByQuestion->get($q->id)?->answer ?? '';
                    // Decode JSON arrays (checkboxes) to comma-separated string
                    if ($answer && in_array($q->type, ['checkboxes'])) {
                        $decoded = json_decode($answer, true);
                        $answer = is_array($decoded) ? implode(', ', $decoded) : $answer;
                    }
                    $row[] = $answer;
                }

                $row[] = $r->amount ?? '';
                fputcsv($out, $row);
            }

            fclose($out);
        }, $filename, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function toggle(Questionnaire $questionnaire)
    {
        $questionnaire->update(['is_active' => !$questionnaire->is_active]);
        return back();
    }

    public function updateAmount(Request $request, Questionnaire $questionnaire, \App\Models\QuestionnaireResponse $response)
    {
        abort_if($response->questionnaire_id !== $questionnaire->id, 404);

        $request->validate(['amount' => 'nullable|integer|min:0|max:9999999']);

        $response->update(['amount' => $request->amount]);

        return response()->json(['amount' => $response->amount]);
    }

    public function destroy(Questionnaire $questionnaire)
    {
        if ($questionnaire->image) {
            Storage::disk('public')->delete($questionnaire->image);
        }
        $questionnaire->delete();
        return redirect(route('questionnaires.index'));
    }

    private function uniqueSlug(string $title): string
    {
        do {
            $slug = Str::slug($title) . '-' . Str::lower(Str::random(6));
        } while (Questionnaire::where('slug', $slug)->exists());

        return $slug;
    }
}
