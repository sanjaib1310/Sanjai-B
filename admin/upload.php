<?php
/**
 * Secure File Upload Handler
 * Supports: Image uploads (JPG, PNG, WEBP) and Resume Documents (PDF)
 * Security: Random naming, MIME validation with finfo, size limiting
 */

require_once __DIR__ . '/../config.php';
requireAdminLogin();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$type = $_POST['type'] ?? 'certificate'; // 'certificate', 'profile', 'resume'
$file = $_FILES['file'] ?? null;

if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    $errCodes = [
        UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds upload_max_filesize.',
        UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds MAX_FILE_SIZE.',
        UPLOAD_ERR_PARTIAL    => 'The file was only partially uploaded.',
        UPLOAD_ERR_NO_FILE    => 'No file was selected for upload.',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder on server.',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.'
    ];
    $msg = $errCodes[$file['error']] ?? 'File upload error occurred.';
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

// 5MB max upload limit
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'error' => 'File size exceeds 5MB limit.']);
    exit;
}

// Verify server-side MIME type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

$allowedImages = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp'
];

$targetDir = __DIR__ . '/../uploads/';
$targetUrl = '/uploads/';

if ($type === 'resume') {
    if ($mimeType !== 'application/pdf') {
        echo json_encode(['success' => false, 'error' => 'Only PDF files are allowed for resume upload.']);
        exit;
    }
    $filename = 'Sanjai_B_Resume.pdf'; // Keep consistent or random
    $destination = $targetDir . $filename;
} else {
    if (!array_key_exists($mimeType, $allowedImages)) {
        echo json_encode(['success' => false, 'error' => 'Invalid image format. Allowed: JPG, PNG, WEBP. Detected: ' . $mimeType]);
        exit;
    }
    $ext = $allowedImages[$mimeType];
    $rand = bin2hex(random_bytes(8));

    if ($type === 'profile') {
        $filename = 'profile_' . $rand . '.' . $ext;
        $destination = $targetDir . $filename;
    } else {
        $targetDir = __DIR__ . '/../uploads/certificates/';
        $targetUrl = '/uploads/certificates/';
        $filename = 'cert_' . $rand . '.' . $ext;
        $destination = $targetDir . $filename;
    }
}

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    echo json_encode(['success' => false, 'error' => 'Failed to save file to destination.']);
    exit;
}

// Generate thumbnail for certificates if GD is installed
$thumbUrl = null;
if ($type === 'certificate' && extension_loaded('gd')) {
    $thumbDir = $targetDir . 'thumbs/';
    if (!is_dir($thumbDir)) mkdir($thumbDir, 0755, true);
    $thumbDest = $thumbDir . $filename;

    list($width, $height) = @getimagesize($destination);
    if ($width && $height) {
        $newWidth = 400;
        $newHeight = (int)($height * ($newWidth / $width));
        $thumb = imagecreatetruecolor($newWidth, $newHeight);

        if ($ext === 'jpg') $srcImg = @imagecreatefromjpeg($destination);
        elseif ($ext === 'png') $srcImg = @imagecreatefrompng($destination);
        elseif ($ext === 'webp') $srcImg = @imagecreatefromwebp($destination);
        else $srcImg = null;

        if ($srcImg) {
            imagecopyresampled($thumb, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            if ($ext === 'jpg') imagejpeg($thumb, $thumbDest, 85);
            elseif ($ext === 'png') imagepng($thumb, $thumbDest, 8);
            elseif ($ext === 'webp') imagewebp($thumb, $thumbDest, 85);
            imagedestroy($thumb);
            imagedestroy($srcImg);
            $thumbUrl = $targetUrl . 'thumbs/' . $filename;
        }
    }
}

$fileUrl = $targetUrl . $filename;

// If type is profile or resume, update profile table immediately
$pdo = getDB();
if ($type === 'profile') {
    $stmt = $pdo->prepare("UPDATE `profile` SET `profile_image` = ? WHERE id = 1");
    $stmt->execute([$fileUrl]);
} elseif ($type === 'resume') {
    $stmt = $pdo->prepare("UPDATE `profile` SET `resume_path` = ? WHERE id = 1");
    $stmt->execute([$fileUrl]);
}

echo json_encode([
    'success' => true,
    'url' => $fileUrl,
    'thumb_url' => $thumbUrl ?: $fileUrl,
    'filename' => $filename,
    'type' => $type
]);
exit;
