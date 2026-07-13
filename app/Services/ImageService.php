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
        $source = static::readOriented($file);

        return static::save($source, $directory, $disk, $quality);
    }

    /**
     * Convert an uploaded image to WebP, resized and center-cropped to an
     * exact target size (like CSS `object-fit: cover`). Use this for photos
     * that are displayed as fixed-shape thumbnails/avatars — it guarantees
     * a consistent, predictable file regardless of whatever aspect ratio
     * or resolution the member's phone camera produced.
     */
    public static function storeAsWebpCropped(UploadedFile $file, string $directory, int $width, int $height, string $disk = 'public', int $quality = 85): string
    {
        $source = static::readOriented($file);
        $cropped = static::coverCrop($source, $width, $height);
        imagedestroy($source);

        return static::save($cropped, $directory, $disk, $quality);
    }

    /**
     * Load an uploaded image and correct its pixel data for EXIF
     * orientation — phone cameras commonly store portrait photos as
     * landscape pixels plus a rotation tag, which GD does not read.
     * Without this, uploads from a phone can come out sideways.
     */
    private static function readOriented(UploadedFile $file): \GdImage
    {
        $path = $file->getRealPath();
        $source = imagecreatefromstring(file_get_contents($path));

        if (imageistruecolor($source)) {
            imagesavealpha($source, true);
        }

        if (!function_exists('exif_read_data') || $file->getMimeType() !== 'image/jpeg') {
            return $source;
        }

        $exif = @exif_read_data($path);
        $orientation = $exif['Orientation'] ?? 1;

        return match ($orientation) {
            3       => imagerotate($source, 180, 0),
            6       => imagerotate($source, -90, 0),
            8       => imagerotate($source, 90, 0),
            default => $source,
        };
    }

    /**
     * Resize to cover a target box, then crop the centered overflow —
     * equivalent to CSS `object-fit: cover; object-position: center`.
     */
    private static function coverCrop(\GdImage $source, int $width, int $height): \GdImage
    {
        $srcWidth  = imagesx($source);
        $srcHeight = imagesy($source);

        $scale        = max($width / $srcWidth, $height / $srcHeight);
        $scaledWidth  = (int) ceil($srcWidth * $scale);
        $scaledHeight = (int) ceil($srcHeight * $scale);

        $scaled = imagecreatetruecolor($scaledWidth, $scaledHeight);
        imagesavealpha($scaled, true);
        imagecopyresampled($scaled, $source, 0, 0, 0, 0, $scaledWidth, $scaledHeight, $srcWidth, $srcHeight);

        $cropX = (int) (($scaledWidth - $width) / 2);
        $cropY = (int) (($scaledHeight - $height) / 2);

        $cropped = imagecreatetruecolor($width, $height);
        imagesavealpha($cropped, true);
        imagecopy($cropped, $scaled, 0, 0, $cropX, $cropY, $width, $height);
        imagedestroy($scaled);

        return $cropped;
    }

    private static function save(\GdImage $image, string $directory, string $disk, int $quality): string
    {
        $filename     = Str::uuid() . '.webp';
        $relativePath = $directory . '/' . $filename;
        $absolutePath = Storage::disk($disk)->path($relativePath);

        Storage::disk($disk)->makeDirectory($directory);

        imagewebp($image, $absolutePath, $quality);
        imagedestroy($image);

        return $relativePath;
    }
}
