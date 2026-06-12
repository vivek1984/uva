<?php

namespace App\Http\Controllers;

use App\Models\PageSection;
use App\Models\SectionImage;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomepageController extends Controller
{
    /* ── Section manager list ── */
    public function index()
    {
        $sections = PageSection::with('images')->orderBy('order')->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'type'         => $s->type,
                'title'        => $s->title,
                'subtitle'     => $s->subtitle,
                'is_published' => $s->is_published,
                'cover_image'  => $s->cover_image ? asset('storage/' . $s->cover_image) : null,
                'image_count'  => $s->images->count(),
            ]);

        return Inertia::render('Homepage/Manager', ['sections' => $sections]);
    }

    /* ── Create form ── */
    public function create(Request $request)
    {
        $type = in_array($request->query('type'), ['text', 'gallery']) ? $request->query('type') : 'text';
        return Inertia::render('Homepage/SectionEditor', ['section' => null, 'type' => $type]);
    }

    /* ── Store new section ── */
    public function store(Request $request)
    {
        $request->validate([
            'type'        => 'required|in:text,gallery',
            'title'       => 'nullable|string|max:255',
            'subtitle'    => 'nullable|string|max:255',
            'body'        => 'nullable|string|max:5000',
            'cover_image' => 'nullable|image|max:4096',
        ]);

        $maxOrder = PageSection::max('order') ?? -1;

        $section = PageSection::create([
            'type'     => $request->type,
            'title'    => $request->title,
            'subtitle' => $request->subtitle,
            'body'     => $request->body,
            'order'    => $maxOrder + 1,
        ]);

        if ($request->hasFile('cover_image')) {
            $path = ImageService::storeAsWebp($request->file('cover_image'), "homepage/{$section->id}");
            $section->update(['cover_image' => $path]);
        }

        return redirect(route('homepage.sections.edit', $section))
            ->with('success', 'Section created. Now add content below.');
    }

    /* ── Edit form ── */
    public function edit(PageSection $section)
    {
        $section->load('images');

        return Inertia::render('Homepage/SectionEditor', [
            'section' => [
                'id'           => $section->id,
                'type'         => $section->type,
                'title'        => $section->title,
                'subtitle'     => $section->subtitle,
                'body'         => $section->body,
                'is_published' => $section->is_published,
                'cover_image'  => $section->cover_image ? asset('storage/' . $section->cover_image) : null,
                'images'       => $section->images->map(fn($img) => [
                    'id'      => $img->id,
                    'url'     => asset('storage/' . $img->image),
                    'caption' => $img->caption,
                ])->values()->all(),
            ],
            'type' => $section->type,
        ]);
    }

    /* ── Update section ── */
    public function update(Request $request, PageSection $section)
    {
        $request->validate([
            'title'       => 'nullable|string|max:255',
            'subtitle'    => 'nullable|string|max:255',
            'body'        => 'nullable|string|max:5000',
            'cover_image' => 'nullable|image|max:4096',
        ]);

        $data = [
            'title'    => $request->title,
            'subtitle' => $request->subtitle,
            'body'     => $request->body,
        ];

        if ($request->hasFile('cover_image')) {
            // Delete old cover
            if ($section->cover_image) {
                Storage::disk('public')->delete($section->cover_image);
            }
            $data['cover_image'] = ImageService::storeAsWebp($request->file('cover_image'), "homepage/{$section->id}");
        }

        $section->update($data);

        return back()->with('success', 'Section saved.');
    }

    /* ── Toggle published ── */
    public function toggle(PageSection $section)
    {
        $section->update(['is_published' => !$section->is_published]);
        return back();
    }

    /* ── Move up / down ── */
    public function move(Request $request, PageSection $section)
    {
        $direction = $request->input('direction'); // 'up' or 'down'

        $sections = PageSection::orderBy('order')->get();
        $index    = $sections->search(fn($s) => $s->id === $section->id);

        $swapIndex = $direction === 'up' ? $index - 1 : $index + 1;
        if ($swapIndex < 0 || $swapIndex >= $sections->count()) {
            return back();
        }

        $other = $sections[$swapIndex];
        [$section->order, $other->order] = [$other->order, $section->order];
        $section->save();
        $other->save();

        return back();
    }

    /* ── Delete section ── */
    public function destroy(PageSection $section)
    {
        // Delete all stored files
        Storage::disk('public')->deleteDirectory("homepage/{$section->id}");
        $section->delete();
        return redirect(route('homepage.index'));
    }

    /* ── Upload gallery images ── */
    public function storeImages(Request $request, PageSection $section)
    {
        $request->validate([
            'images'   => 'required|array|min:1',
            'images.*' => 'image|max:5120',
        ]);

        $maxOrder = $section->images()->max('order') ?? -1;

        foreach ($request->file('images') as $i => $file) {
            $path = ImageService::storeAsWebp($file, "homepage/{$section->id}");
            SectionImage::create([
                'section_id' => $section->id,
                'image'      => $path,
                'caption'    => null,
                'order'      => $maxOrder + $i + 1,
            ]);
        }

        return back()->with('success', count($request->file('images')) . ' image(s) uploaded.');
    }

    /* ── Update gallery image caption ── */
    public function updateImage(Request $request, PageSection $section, SectionImage $image)
    {
        $request->validate(['caption' => 'nullable|string|max:255']);
        $image->update(['caption' => $request->caption]);
        return back();
    }

    /* ── Delete gallery image ── */
    public function destroyImage(PageSection $section, SectionImage $image)
    {
        Storage::disk('public')->delete($image->image);
        $image->delete();
        return back();
    }
}
