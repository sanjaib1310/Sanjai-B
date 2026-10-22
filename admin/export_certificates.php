<?php
/**
 * Export Certificates to CSV / Excel
 * Outputs standard UTF-8 CSV with Excel-compatible BOM
 */

require_once __DIR__ . '/../config.php';
requireAdminLogin();

$pdo = getDB();

$filename = "Sanjai_B_Certificates_" . date('Y-m-d') . ".csv";

// Output headers for browser download
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

$output = fopen('php://output', 'w');

// UTF-8 BOM for Microsoft Excel
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// CSV Header row (Matching Sheet 1 structure)
fputcsv($output, [
    'S. No',
    'Certificate Name',
    'Organization',
    'Competition Level',
    'Workshop Level',
    'Other Category',
    'Event Date (SQL)',
    'Date Text',
    'Place / Rank',
    'Cash Award (INR)',
    'Remarks',
    'Image Path'
]);

// Query certificates ordered by S. No
$stmt = $pdo->query("SELECT * FROM `certificates` ORDER BY `sno` ASC, `id` ASC");
while ($row = $stmt->fetch()) {
    fputcsv($output, [
        $row['sno'],
        $row['name'],
        $row['organization'],
        $row['competition_level'] ?? '-',
        $row['workshop_level'] ?? '-',
        $row['other_category'] ?? '-',
        $row['event_date'] ?? '-',
        $row['date_text'],
        $row['place_rank'] ? ($row['place_rank'] == '1' ? '1st Place' : ($row['place_rank'] == '2' ? '2nd Place' : '3rd Place')) : '-',
        $row['cash_award'] ? '₹' . number_format($row['cash_award']) : '-',
        $row['remarks'] ?? '-',
        $row['image_path']
    ]);
}

// Also Append Camp Certificates
fputcsv($output, []);
fputcsv($output, ['--- CAMP CERTIFICATES (Sheet 2) ---']);
fputcsv($output, [
    'S. No',
    'Camp Certificate Name',
    'Organization',
    'Camp Level',
    'Date Range',
    'Location',
    'Certificate No',
    'Cash Award',
    'Special Note / Remarks',
    'Image Path'
]);

$stmtCamp = $pdo->query("SELECT * FROM `camp_certificates` ORDER BY `sno` ASC, `id` ASC");
while ($crow = $stmtCamp->fetch()) {
    fputcsv($output, [
        $crow['sno'],
        $crow['name'],
        $crow['organization'],
        $crow['camp_level'] ?? '-',
        $crow['date_range_text'],
        $crow['location'],
        $crow['certificate_no'] ?? '-',
        $crow['cash_award'] ? '₹' . number_format($crow['cash_award']) : '-',
        $crow['other_note'] ?? '-',
        $crow['image_path']
    ]);
}

fclose($output);
exit;
