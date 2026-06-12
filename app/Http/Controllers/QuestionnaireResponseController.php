<?php

namespace App\Http\Controllers;

use App\Models\Questionnaire;
use App\Models\QuestionAnswer;
use App\Models\QuestionnaireResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionnaireResponseController extends Controller
{
    public function show(string $slug)
    {
        $questionnaire = Questionnaire::where('slug', $slug)
            ->with('questions')
            ->firstOrFail();

        $user = auth()->user();

        return Inertia::render('Questionnaire/Fill', [
            'questionnaire' => [
                'id'          => $questionnaire->id,
                'title'       => $questionnaire->title,
                'description' => $questionnaire->description,
                'image_url'   => $questionnaire->image ? asset('storage/' . $questionnaire->image) : null,
                'slug'        => $questionnaire->slug,
                'is_active'   => $questionnaire->isAcceptingResponses(),
                'questions'   => $questionnaire->questions->map(fn($q) => [
                    'id'          => $q->id,
                    'type'        => $q->type,
                    'label'       => $q->label,
                    'is_required' => $q->is_required,
                    'options'     => $q->options,
                ]),
            ],
            'prefill' => $user ? [
                'name'  => $user->name,
                'phone' => $user->phone_number,
            ] : null,
        ]);
    }

    /**
     * JSON endpoint: validate phone + return previous response data.
     * Called by the fill form via fetch() as the user types their phone.
     */
    public function prefill(Request $request, string $slug)
    {
        $phone = trim($request->query('phone', ''));

        $user = User::where('phone_number', $phone)->first();

        if (!$user) {
            return response()->json(['error' => 'not_registered'], 422);
        }

        if (!$user->isActive()) {
            return response()->json(['error' => 'not_active'], 403);
        }

        $questionnaire = Questionnaire::where('slug', $slug)->firstOrFail();

        $existing = QuestionnaireResponse::where('questionnaire_id', $questionnaire->id)
            ->where('respondent_phone', $phone)
            ->with('answers')
            ->first();

        if (!$existing) {
            return response()->json([
                'user'              => ['name' => $user->name],
                'previous_response' => null,
            ]);
        }

        // Decode JSON arrays (checkboxes) back to arrays
        $answers = $existing->answers->mapWithKeys(function ($a) {
            $val = $a->answer;
            if (is_string($val) && str_starts_with($val, '[')) {
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $val = $decoded;
                }
            }
            return [$a->question_id => $val];
        })->all();

        return response()->json([
            'user'              => ['name' => $user->name],
            'previous_response' => ['answers' => $answers],
        ]);
    }

    public function store(Request $request, string $slug)
    {
        $questionnaire = Questionnaire::where('slug', $slug)
            ->with('questions')
            ->firstOrFail();

        if (!$questionnaire->isAcceptingResponses()) {
            return back()->withErrors(['form' => 'This questionnaire is no longer accepting responses.']);
        }

        $request->validate([
            'respondent_name'  => 'required|string|max:255',
            'respondent_phone' => 'required|string|max:20',
            'answers'          => 'array',
        ]);

        // Validate phone against registered users
        $user = User::where('phone_number', $request->respondent_phone)->first();
        if (!$user) {
            return back()->withErrors([
                'respondent_phone' => 'Please enter the phone number used for registration.',
            ]);
        }

        if (!$user->isActive()) {
            return back()->withErrors([
                'respondent_phone' => 'Your membership is currently inactive. Please contact the association.',
            ]);
        }

        // Find any existing response for this phone on this questionnaire
        $existing = QuestionnaireResponse::where('questionnaire_id', $questionnaire->id)
            ->where('respondent_phone', $request->respondent_phone)
            ->first();

        $isUpdate = (bool) $existing;

        if ($isUpdate) {
            $existing->update(['respondent_name' => $request->respondent_name]);
            $existing->answers()->delete();
            $response = $existing;
        } else {
            $response = QuestionnaireResponse::create([
                'questionnaire_id' => $questionnaire->id,
                'user_id'          => $user->id,
                'respondent_name'  => $request->respondent_name,
                'respondent_phone' => $request->respondent_phone,
            ]);
        }

        foreach ($questionnaire->questions as $question) {
            $answer = $request->input('answers.' . $question->id);
            if ($answer === null || $answer === '') {
                continue;
            }
            QuestionAnswer::create([
                'response_id' => $response->id,
                'question_id' => $question->id,
                'answer'      => is_array($answer) ? json_encode($answer) : $answer,
            ]);
        }

        $message = $isUpdate
            ? 'Your response has been updated successfully.'
            : 'Thank you! Your response has been recorded.';

        return redirect(route('questionnaire.fill', $slug))->with('success', $message);
    }
}
