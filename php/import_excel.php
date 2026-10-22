<?php
/**
 * Import Script for Certificates and Achievements
 * Reads Excel / Seed Data and imports into MySQL database via PDO
 * Treats '-' and empty values as NULL
 */

require_once __DIR__ . '/config.php';

// Allow execution from CLI or Admin session
$is_cli = (php_sapi_name() === 'cli');
if (!$is_cli && empty($_SESSION['admin_logged_in'])) {
    // If not logged in, only allow if secret token matches or ask for setup
    $token = $_GET['token'] ?? '';
    if ($token !== 'import_secret_seed') {
        die("Access restricted. Please log into the Admin panel or run via CLI: php import_excel.php");
    }
}

$pdo = getDB();

// Clean helper: converts '-', empty, or trimmed dashes into NULL
function cleanVal($val) {
    if ($val === null) return null;
    $v = trim((string)$val);
    if ($v === '' || $v === '-' || $v === '–' || $v === '—' || strtolower($v) === 'null') {
        return null;
    }
    return $v;
}

// Convert various date strings into YYYY-MM-DD for SQL DATE column
function parseSqlDate($str) {
    $v = cleanVal($str);
    if (!$v) return null;

    // Format DD/MM/YYYY
    if (preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $v, $m)) {
        return sprintf('%04d-%02d-%02d', $m[3], $m[2], $m[1]);
    }
    // Format YYYY-MM-DD
    if (preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})$/', $v, $m)) {
        return sprintf('%04d-%02d-%02d', $m[1], $m[2], $m[3]);
    }
    // Format "July 2016"
    if (preg_match('/^([a-zA-Z]+)\s+(\d{4})$/', $v, $m)) {
        $ts = strtotime("1 " . $v);
        if ($ts) return date('Y-m-d', $ts);
    }
    // Format "2022 – 2023" or "2023 – 2023"
    if (preg_match('/^(\d{4})/', $v, $m)) {
        return $m[1] . '-01-01';
    }
    return null;
}

// Data from Sheet 1: Certificate
$certificates_data = [
    [1, "Painting Competition", "TN Govt", "School Level", null, null, "July 2016", "1", null, null],
    [2, "Speech Competition", "TN Govt", "District", null, null, "30/07/2023", "3", 2000, null],
    [3, "Speech Competition", "TN Govt", "District", null, null, "02/08/2023", "3", 2000, null],
    [4, "Speech Competition", "Vailankanni School Education", "District", null, null, "02/10/2023", "1", 5000, null],
    [5, "Speech Competition", "TN Govt", "District", null, null, "2022 – 2023", "1", null, null],
    [6, "Thirukkural Competition", "TN Govt", "District", null, null, "2023 – 2023", "1", null, null],
    [7, "NAAC Preparation", "Don Bosco College", null, null, "College", "30/08/2024", null, null, null],
    [8, "Workshop", "TN Tamil Department", null, "District", null, "13/12/2024", null, null, null],
    [9, "Skit", "Don Bosco College (Extravaganza 25)", "College", null, null, "10/01/2025", "2", null, null],
    [10, "Speech Competition", "Don Bosco College (Extravaganza 25)", "College", null, null, "10/01/2025", "3", null, null],
    [11, "Tamil Debate", "Don Bosco College Tamil Dept", "College", null, null, "12/01/2025", null, null, null],
    [12, "Speech Competition", "Thiruvalluvar University", "University", null, null, "04/03/2025", null, null, null],
    [13, "Workshop", "TN Tamil Department", null, "District", null, "29/07/2025", null, null, null],
    [14, "YASSC", "TASS", "State", null, null, "17/08/2025", null, null, null],
    [15, "PPT", "Gonzaga College", "State", null, null, "07/10/2025", "2", null, null],
    [16, "Viksit Bharat", "NSS", "District", null, null, "22/12/2025", "2", null, "Selected from State Level"],
    [17, "PPT", "Auxilium College", "State", null, null, "29/01/2026", "1", 5000, null],
    [18, "Workshop", "Sacred Heart College", null, "National Level", null, "20/08/2026", null, null, null],
    [19, "YASSC", "TASS", "State", null, null, "29/08/2026", "1", null, "Selected from State Level"],
    [20, "Conference", "Gonzaga College", "State", null, null, "11/09/2026", null, null, null],
    [21, "Conference", "Don Bosco College (BBA Department)", null, "College Level", null, "12/09/2026", null, null, null]
];

// Data from Sheet 2: Camp Certificate
$camp_certificates_data = [
    [1, "NSS 7-Day Special Annual Camp", "National Service Scheme (NSS), Don Bosco College", "District", "2025-02-10", "2025-02-16", "10/02/2025 – 16/02/2025", "Yelagiri Hills, Tirupattur", null, "NSS/DBC/2025/042", "Youth for Clean and Green Village"],
    [2, "State Level Youth Leadership & Adventure Camp", "Tamil Nadu State Youth Service / TASS", "State", "2025-05-15", "2025-05-20", "15/05/2025 – 20/05/2025", "Ooty, Nilgiris, Tamil Nadu", null, "YLC/TN/2025/118", "Personality Development, Community Living & Leadership"],
    [3, "Space Science & Night Sky Observation Camp", "Tamil Nadu Astronomy & Science Society (TASS)", "State", "2026-01-05", "2026-01-08", "05/01/2026 – 08/01/2026", "Vainu Bappu Observatory, Kavalur", null, "TASS/SOC/2026/033", "Celestial Mechanics & Optical Telescope Observation"]
];

try {
    $pdo->beginTransaction();

    // 1. Clear existing certificates or update
    $stmtCert = $pdo->prepare("
        INSERT INTO `certificates` 
        (`sno`, `name`, `organization`, `competition_level`, `workshop_level`, `other_category`, `event_date`, `date_text`, `place_rank`, `cash_award`, `remarks`, `image_path`, `thumbnail_path`, `sort_order`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        `name`=VALUES(`name`), `organization`=VALUES(`organization`), `competition_level`=VALUES(`competition_level`),
        `workshop_level`=VALUES(`workshop_level`), `other_category`=VALUES(`other_category`), `event_date`=VALUES(`event_date`),
        `date_text`=VALUES(`date_text`), `place_rank`=VALUES(`place_rank`), `cash_award`=VALUES(`cash_award`),
        `remarks`=VALUES(`remarks`), `image_path`=VALUES(`image_path`), `thumbnail_path`=VALUES(`thumbnail_path`)
    ");

    $cert_count = 0;
    foreach ($certificates_data as $row) {
        $sno = $row[0];
        $name = cleanVal($row[1]);
        $org = cleanVal($row[2]);
        $comp_level = cleanVal($row[3]);
        $work_level = cleanVal($row[4]);
        $other_cat = cleanVal($row[5]);
        $date_text = cleanVal($row[6]);
        $place = cleanVal($row[7]);
        $cash = cleanVal($row[8]);
        $remarks = cleanVal($row[9]);

        $sql_date = parseSqlDate($date_text);
        $image_path = "/uploads/certificates/cert-{$sno}.jpg";
        $thumb_path = "/uploads/certificates/thumbs/cert-{$sno}.jpg";

        $stmtCert->execute([
            $sno, $name, $org, $comp_level, $work_level, $other_cat,
            $sql_date, $date_text, $place, $cash, $remarks,
            $image_path, $thumb_path, $sno
        ]);
        $cert_count++;
    }

    // 2. Insert Camp Certificates
    $stmtCamp = $pdo->prepare("
        INSERT INTO `camp_certificates`
        (`sno`, `name`, `organization`, `camp_level`, `date_from`, `date_to`, `date_range_text`, `location`, `cash_award`, `certificate_no`, `other_note`, `image_path`, `thumbnail_path`, `sort_order`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        `name`=VALUES(`name`), `organization`=VALUES(`organization`), `camp_level`=VALUES(`camp_level`),
        `date_from`=VALUES(`date_from`), `date_to`=VALUES(`date_to`), `date_range_text`=VALUES(`date_range_text`),
        `location`=VALUES(`location`), `cash_award`=VALUES(`cash_award`), `certificate_no`=VALUES(`certificate_no`),
        `other_note`=VALUES(`other_note`), `image_path`=VALUES(`image_path`), `thumbnail_path`=VALUES(`thumbnail_path`)
    ");

    $camp_count = 0;
    foreach ($camp_certificates_data as $row) {
        $sno = $row[0];
        $name = cleanVal($row[1]);
        $org = cleanVal($row[2]);
        $camp_level = cleanVal($row[3]);
        $date_from = cleanVal($row[4]);
        $date_to = cleanVal($row[5]);
        $date_range = cleanVal($row[6]);
        $location = cleanVal($row[7]);
        $cash = cleanVal($row[8]);
        $cert_no = cleanVal($row[9]);
        $other_note = cleanVal($row[10]);

        $image_path = "/uploads/certificates/camp-{$sno}.jpg";
        $thumb_path = "/uploads/certificates/thumbs/camp-{$sno}.jpg";

        $stmtCamp->execute([
            $sno, $name, $org, $camp_level, $date_from, $date_to,
            $date_range, $location, $cash, $cert_no, $other_note,
            $image_path, $thumb_path, $sno
        ]);
        $camp_count++;
    }

    $pdo->commit();

    $summary = "SUCCESS: Imported {$cert_count} regular certificates and {$camp_count} camp certificates into database '{$pdo->query('select database()')->fetchColumn()}'.";
    if ($is_cli) {
        echo $summary . "\n";
    } else {
        echo "<!DOCTYPE html><html><head><title>Import Complete</title><link rel='stylesheet' href='styles.css'></head><body><div style='max-width:600px;margin:50px auto;padding:30px;background:#f0fdf4;border:1px solid #86efac;border-radius:10px;font-family:sans-serif;'>";
        echo "<h2 style='color:#15803d;'>Import Completed Successfully!</h2>";
        echo "<p>{$summary}</p>";
        echo "<p><a href='/' style='display:inline-block;padding:10px 20px;background:#0066cc;color:#fff;text-decoration:none;border-radius:5px;'>View Public Portfolio</a> ";
        echo "<a href='/admin/' style='display:inline-block;padding:10px 20px;background:#334155;color:#fff;text-decoration:none;border-radius:5px;'>Go to Admin Panel</a></p>";
        echo "</div></body></html>";
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($is_cli) {
        echo "ERROR: " . $e->getMessage() . "\n";
    } else {
        die("Import failed: " . htmlspecialchars($e->getMessage()));
    }
}
