<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Convert an uploaded image to WebP and store it on the given disk.
     * Returns the relative path (e.g. "member-photos/uuid.webp").
     */
    public static function storeAsWebp(UploadedFile $file, string $directory, string $disk = 'public', int $quality = 85): string
    {
        $source = imagecreatefromstring(file_get_contents($file->getRealPath()));

        // Preserve transparency for PNG/WebP sources
        if (imageistruecolor($source)) {
            imagesavealpha($source, true);
        }

        $filename     = Str::uuid() . '.webp';
        $relativePath = $directory . '/' . $filename;
        $absolutePath = Storage::disk($disk)->path($relativePath);

        Storage::disk($disk)->makeDirectory($directory);

        imagewebp($source, $absolutePath, $quality);
        imagedestroy($source);

        return $relativePath;
    }
}
