<?php
/**
 * Admin Panel Dashboard
 * Full CRUD for Profile, Certificates, Camps, Projects, Research, Education, Experience, Skills, Achievements, Messages
 */

require_once __DIR__ . '/../config.php';
requireAdminLogin();

$pdo = getDB();
$flash_msg = null;
$flash_err = null;

// Handle Form Submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $token = $_POST['csrf_token'] ?? '';

    if (!verifyCsrfToken($token)) {
        $flash_err = 'Invalid security token. Please try again.';
    } else {
        try {
            switch ($action) {
                // 1. UPDATE PROFILE
                case 'update_profile':
                    $stmt = $pdo->prepare("
                        UPDATE `profile` SET
                        `name` = ?, `title` = ?, `subtitle` = ?, `hero_description` = ?,
                        `degree` = ?, `institution` = ?, `status` = ?, `about_description` = ?,
                        `career_objective` = ?, `email` = ?, `phone` = ?, `linkedin_url` = ?,
                        `github_url` = ?, `meta_title` = ?, `meta_description` = ?
                        WHERE id = 1
                    ");
                    $stmt->execute([
                        $_POST['name'], $_POST['title'], $_POST['subtitle'], $_POST['hero_description'],
                        $_POST['degree'], $_POST['institution'], $_POST['status'], $_POST['about_description'],
                        $_POST['career_objective'], $_POST['email'], $_POST['phone'], $_POST['linkedin_url'],
                        $_POST['github_url'], $_POST['meta_title'], $_POST['meta_description']
                    ]);
                    $flash_msg = 'Profile updated successfully!';
                    break;

                // 2. CERTIFICATES CRUD
                case 'add_certificate':
                    $stmt = $pdo->prepare("
                        INSERT INTO `certificates` 
                        (`sno`, `name`, `organization`, `competition_level`, `workshop_level`, `other_category`, `date_text`, `place_rank`, `cash_award`, `remarks`, `image_path`, `thumbnail_path`)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $img = !empty($_POST['image_path']) ? $_POST['image_path'] : '/uploads/certificates/cert-placeholder.jpg';
                    $stmt->execute([
                        (int)$_POST['sno'], $_POST['name'], $_POST['organization'],
                        !empty($_POST['competition_level']) ? $_POST['competition_level'] : null,
                        !empty($_POST['workshop_level']) ? $_POST['workshop_level'] : null,
                        !empty($_POST['other_category']) ? $_POST['other_category'] : null,
                        $_POST['date_text'],
                        !empty($_POST['place_rank']) ? $_POST['place_rank'] : null,
                        !empty($_POST['cash_award']) ? $_POST['cash_award'] : null,
                        !empty($_POST['remarks']) ? $_POST['remarks'] : null,
                        $img, $img
                    ]);
                    $flash_msg = 'Certificate added successfully!';
                    break;

                case 'edit_certificate':
                    $stmt = $pdo->prepare("
                        UPDATE `certificates` SET
                        `sno` = ?, `name` = ?, `organization` = ?, `competition_level` = ?,
                        `workshop_level` = ?, `other_category` = ?, `date_text` = ?,
                        `place_rank` = ?, `cash_award` = ?, `remarks` = ?, `image_path` = ?, `thumbnail_path` = ?
                        WHERE id = ?
                    ");
                    $stmt->execute([
                        (int)$_POST['sno'], $_POST['name'], $_POST['organization'],
                        !empty($_POST['competition_level']) ? $_POST['competition_level'] : null,
                        !empty($_POST['workshop_level']) ? $_POST['workshop_level'] : null,
                        !empty($_POST['other_category']) ? $_POST['other_category'] : null,
                        $_POST['date_text'],
                        !empty($_POST['place_rank']) ? $_POST['place_rank'] : null,
                        !empty($_POST['cash_award']) ? $_POST['cash_award'] : null,
                        !empty($_POST['remarks']) ? $_POST['remarks'] : null,
                        $_POST['image_path'], $_POST['image_path'],
                        (int)$_POST['id']
                    ]);
                    $flash_msg = 'Certificate updated!';
                    break;

                case 'delete_certificate':
                    $stmt = $pdo->prepare("DELETE FROM `certificates` WHERE id = ?");
                    $stmt->execute([(int)$_POST['id']]);
                    $flash_msg = 'Certificate removed.';
                    break;

                // 3. CAMP CERTIFICATES CRUD
                case 'add_camp_certificate':
                    $stmt = $pdo->prepare("
                        INSERT INTO `camp_certificates`
                        (`sno`, `name`, `organization`, `camp_level`, `date_range_text`, `location`, `certificate_no`, `cash_award`, `other_note`, `image_path`, `thumbnail_path`)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $cImg = !empty($_POST['image_path']) ? $_POST['image_path'] : '/uploads/certificates/camp-placeholder.jpg';
                    $stmt->execute([
                        (int)$_POST['sno'], $_POST['name'], $_POST['organization'],
                        !empty($_POST['camp_level']) ? $_POST['camp_level'] : null,
                        $_POST['date_range_text'], $_POST['location'],
                        !empty($_POST['certificate_no']) ? $_POST['certificate_no'] : null,
                        !empty($_POST['cash_award']) ? $_POST['cash_award'] : null,
                        !empty($_POST['other_note']) ? $_POST['other_note'] : null,
                        $cImg, $cImg
                    ]);
                    $flash_msg = 'Camp certificate added!';
                    break;

                case 'delete_camp_certificate':
                    $stmt = $pdo->prepare("DELETE FROM `camp_certificates` WHERE id = ?");
                    $stmt->execute([(int)$_POST['id']]);
                    $flash_msg = 'Camp certificate removed.';
                    break;

                // 4. PROJECTS CRUD
                case 'add_project':
                    $stmt = $pdo->prepare("
                        INSERT INTO `projects` (`title`, `category`, `icon_class`, `description`, `technologies`, `github_url`, `sort_order`)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $_POST['title'], $_POST['category'], $_POST['icon_class'],
                        $_POST['description'], $_POST['technologies'], $_POST['github_url'], (int)$_POST['sort_order']
                    ]);
                    $flash_msg = 'Project added successfully!';
                    break;

                case 'delete_project':
                    $stmt = $pdo->prepare("DELETE FROM `projects` WHERE id = ?");
                    $stmt->execute([(int)$_POST['id']]);
                    $flash_msg = 'Project deleted.';
                    break;

                // 5. MESSAGES INBOX ACTIONS
                case 'toggle_message_read':
                    $stmt = $pdo->prepare("UPDATE `messages` SET `is_read` = NOT `is_read` WHERE id = ?");
                    $stmt->execute([(int)$_POST['id']]);
                    $flash_msg = 'Message status updated.';
                    break;

                case 'delete_message':
                    $stmt = $pdo->prepare("DELETE FROM `messages` WHERE id = ?");
                    $stmt->execute([(int)$_POST['id']]);
                    $flash_msg = 'Message deleted.';
                    break;

                // 6. ORDER REORDERING (Up / Down)
                case 'reorder_item':
                    $table = preg_replace('/[^a-z_]/', '', $_POST['table']);
                    $id = (int)$_POST['id'];
                    $direction = $_POST['direction'] === 'up' ? -1 : 1;
                    $allowed = ['certificates', 'camp_certificates', 'projects', 'research', 'education', 'experience', 'skills'];
                    if (in_array($table, $allowed)) {
                        $stmt = $pdo->prepare("UPDATE `$table` SET `sort_order` = `sort_order` + ? WHERE id = ?");
                        $stmt->execute([$direction, $id]);
                        $flash_msg = 'Order updated.';
                    }
                    break;
            }
        } catch (Exception $e) {
            $flash_err = 'Database Error: ' . $e->getMessage();
        }
    }
}

// Fetch all collections for the dashboard
$profile = $pdo->query("SELECT * FROM `profile` WHERE id = 1 LIMIT 1")->fetch() ?: [];
$certificates = $pdo->query("SELECT * FROM `certificates` ORDER BY `sort_order` ASC, `sno` ASC")->fetchAll();
$camps = $pdo->query("SELECT * FROM `camp_certificates` ORDER BY `sort_order` ASC, `sno` ASC")->fetchAll();
$projects = $pdo->query("SELECT * FROM `projects` ORDER BY `sort_order` ASC, `id` ASC")->fetchAll();
$research = $pdo->query("SELECT * FROM `research` ORDER BY `sort_order` ASC, `id` ASC")->fetchAll();
$education = $pdo->query("SELECT * FROM `education` ORDER BY `sort_order` ASC, `id` ASC")->fetchAll();
$experience = $pdo->query("SELECT * FROM `experience` ORDER BY `sort_order` ASC, `id` ASC")->fetchAll();
$skills = $pdo->query("SELECT * FROM `skills` ORDER BY `sort_order` ASC, `id` ASC")->fetchAll();
$messages = $pdo->query("SELECT * FROM `messages` ORDER BY `created_at` DESC")->fetchAll();

$unread_count = count(array_filter($messages, fn($m) => !$m['is_read']));
$csrf_token = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Sanjai B Portfolio</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="admin-body">

    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <h2>Sanjai B<span>.</span></h2>
            <span>Portfolio Admin CMS</span>
        </div>
        <ul class="sidebar-nav">
            <li><button data-tab="certificates" class="active"><i class="fas fa-award"></i> Certificates (<?= count($certificates) ?>)</button></li>
            <li><button data-tab="camps"><i class="fas fa-campground"></i> Camp Records (<?= count($camps) ?>)</button></li>
            <li><button data-tab="profile"><i class="fas fa-user-edit"></i> Profile & Resume</button></li>
            <li><button data-tab="projects"><i class="fas fa-project-diagram"></i> Projects (<?= count($projects) ?>)</button></li>
            <li><button data-tab="experience"><i class="fas fa-briefcase"></i> Experience (<?= count($experience) ?>)</button></li>
            <li><button data-tab="research"><i class="fas fa-microscope"></i> Research (<?= count($research) ?>)</button></li>
            <li><button data-tab="education"><i class="fas fa-graduation-cap"></i> Education (<?= count($education) ?>)</button></li>
            <li><button data-tab="skills"><i class="fas fa-code"></i> Skills (<?= count($skills) ?>)</button></li>
            <li>
                <button data-tab="messages">
                    <i class="fas fa-inbox"></i> Inbox 
                    <?php if ($unread_count > 0): ?>
                        <span class="badge-unread"><?= $unread_count ?></span>
                    <?php endif; ?>
                </button>
            </li>
        </ul>
        <div class="sidebar-footer">
            <a href="/" target="_blank" class="btn btn-outline btn-sm" style="color:white;justify-content:center;"><i class="fas fa-external-link-alt"></i> View Public Site</a>
            <a href="export_certificates.php" class="btn btn-outline btn-sm" style="color:white;justify-content:center;"><i class="fas fa-file-excel"></i> Export Excel/CSV</a>
            <a href="logout.php" class="btn btn-danger btn-sm" style="justify-content:center;"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main">
        <header class="admin-header">
            <h1 id="adminPageTitle">Certificates & Achievements</h1>
            <div class="admin-actions">
                <a href="export_certificates.php" class="btn btn-success btn-sm"><i class="fas fa-download"></i> Export Certificates CSV</a>
                <a href="/" target="_blank" class="btn btn-primary btn-sm"><i class="fas fa-eye"></i> View Site</a>
            </div>
        </header>

        <div class="admin-content">
            <?php if ($flash_msg): ?>
                <div class="alert-box alert-success"><i class="fas fa-check-circle"></i> <?= e($flash_msg) ?></div>
            <?php endif; ?>
            <?php if ($flash_err): ?>
                <div class="alert-box alert-error"><i class="fas fa-exclamation-triangle"></i> <?= e($flash_err) ?></div>
            <?php endif; ?>

            <!-- ================= TAB: CERTIFICATES ================= -->
            <section id="tab-certificates" class="tab-panel active">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-plus-circle"></i> Add New Certificate</h3>
                    </div>
                    <form method="POST">
                        <input type="hidden" name="action" value="add_certificate">
                        <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>S. No *</label>
                                <input type="number" name="sno" required value="<?= count($certificates) + 1 ?>">
                            </div>
                            <div class="form-group">
                                <label>Certificate Name *</label>
                                <input type="text" name="name" required placeholder="Speech Competition">
                            </div>
                            <div class="form-group">
                                <label>Organization *</label>
                                <input type="text" name="organization" required placeholder="TN Govt / Don Bosco College">
                            </div>
                            <div class="form-group">
                                <label>Competition Level</label>
                                <input type="text" name="competition_level" placeholder="District / State / College / School Level">
                            </div>
                            <div class="form-group">
                                <label>Workshop Level</label>
                                <input type="text" name="workshop_level" placeholder="National Level / District (if workshop)">
                            </div>
                            <div class="form-group">
                                <label>Date Text *</label>
                                <input type="text" name="date_text" required placeholder="30/07/2023 or July 2016">
                            </div>
                            <div class="form-group">
                                <label>Place / Rank (1, 2, 3)</label>
                                <input type="text" name="place_rank" placeholder="1 or 2 or 3">
                            </div>
                            <div class="form-group">
                                <label>Cash Award (INR)</label>
                                <input type="number" step="0.01" name="cash_award" placeholder="5000">
                            </div>
                            <div class="form-group">
                                <label>Remarks</label>
                                <input type="text" name="remarks" placeholder="Selected from State Level">
                            </div>
                            <div class="form-group">
                                <label>Upload Certificate Image (JPG/PNG/WEBP)</label>
                                <input type="file" id="certPhotoInput" accept="image/*">
                                <input type="hidden" name="image_path" id="certImagePathField" value="/uploads/certificates/cert-placeholder.jpg">
                                <div class="image-preview-box">
                                    <img id="certPhotoPreview" src="/uploads/certificates/cert-placeholder.jpg" style="display:none;" alt="Preview">
                                </div>
                            </div>
                        </div>
                        <div style="margin-top:16px;">
                            <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Certificate</button>
                        </div>
                    </form>
                </div>

                <!-- Certificates Table -->
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-list"></i> Verified Certificates (<?= count($certificates) ?>)</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Thumb</th>
                                    <th>S.No</th>
                                    <th>Certificate Name</th>
                                    <th>Organization</th>
                                    <th>Level</th>
                                    <th>Date</th>
                                    <th>Rank</th>
                                    <th>Cash</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($certificates as $c): ?>
                                <tr>
                                    <td>
                                        <img src="<?= e($c['thumbnail_path'] ?: $c['image_path']) ?>" class="table-thumb" alt="Thumb" onerror="this.src='/uploads/certificates/cert-placeholder.svg'">
                                    </td>
                                    <td><strong><?= (int)$c['sno'] ?></strong></td>
                                    <td><?= e($c['name']) ?></td>
                                    <td><?= e($c['organization']) ?></td>
                                    <td><?= e($c['competition_level'] ?: ($c['workshop_level'] ?: ($c['other_category'] ?: '-'))) ?></td>
                                    <td><?= e($c['date_text']) ?></td>
                                    <td>
                                        <?= $c['place_rank'] ? ($c['place_rank'] == '1' ? '🥇 1st' : ($c['place_rank'] == '2' ? '🥈 2nd' : '🥉 3rd')) : '-' ?>
                                    </td>
                                    <td><?= $c['cash_award'] ? '₹' . number_format($c['cash_award']) : '-' ?></td>
                                    <td>
                                        <div class="row-actions">
                                            <form method="POST" style="display:inline;" onsubmit="return confirmDelete('this certificate')">
                                                <input type="hidden" name="action" value="delete_certificate">
                                                <input type="hidden" name="id" value="<?= $c['id'] ?>">
                                                <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                                <button type="submit" class="btn btn-danger btn-sm" title="Delete"><i class="fas fa-trash"></i></button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: CAMP CERTIFICATES ================= -->
            <section id="tab-camps" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-plus-circle"></i> Add Camp Certificate</h3>
                    </div>
                    <form method="POST">
                        <input type="hidden" name="action" value="add_camp_certificate">
                        <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>S. No *</label>
                                <input type="number" name="sno" required value="<?= count($camps) + 1 ?>">
                            </div>
                            <div class="form-group">
                                <label>Camp Name *</label>
                                <input type="text" name="name" required placeholder="NSS 7-Day Annual Camp">
                            </div>
                            <div class="form-group">
                                <label>Organization *</label>
                                <input type="text" name="organization" required placeholder="NSS Unit / TASS">
                            </div>
                            <div class="form-group">
                                <label>Camp Level</label>
                                <input type="text" name="camp_level" placeholder="District / State / National">
                            </div>
                            <div class="form-group">
                                <label>Date Range Text *</label>
                                <input type="text" name="date_range_text" required placeholder="10/02/2025 – 16/02/2025">
                            </div>
                            <div class="form-group">
                                <label>Location *</label>
                                <input type="text" name="location" required placeholder="Yelagiri Hills, Tirupattur">
                            </div>
                            <div class="form-group">
                                <label>Certificate No</label>
                                <input type="text" name="certificate_no" placeholder="NSS/DBC/2025/042">
                            </div>
                            <div class="form-group">
                                <label>Special Note / Details</label>
                                <input type="text" name="other_note" placeholder="Youth for Clean and Green Village">
                            </div>
                            <div class="form-group">
                                <label>Upload Camp Certificate Photo</label>
                                <input type="file" id="campPhotoInput" accept="image/*">
                                <input type="hidden" name="image_path" id="campImagePathField" value="/uploads/certificates/camp-placeholder.jpg">
                                <div class="image-preview-box">
                                    <img id="campPhotoPreview" src="/uploads/certificates/camp-placeholder.jpg" style="display:none;" alt="Preview">
                                </div>
                            </div>
                        </div>
                        <div style="margin-top:16px;">
                            <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Camp Record</button>
                        </div>
                    </form>
                </div>

                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-campground"></i> Camp Certificates List (<?= count($camps) ?>)</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Thumb</th>
                                    <th>S.No</th>
                                    <th>Camp Name</th>
                                    <th>Organization</th>
                                    <th>Level</th>
                                    <th>Dates</th>
                                    <th>Location</th>
                                    <th>Cert No</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($camps as $cp): ?>
                                <tr>
                                    <td><img src="<?= e($cp['thumbnail_path'] ?: $cp['image_path']) ?>" class="table-thumb" alt="Thumb"></td>
                                    <td><?= (int)$cp['sno'] ?></td>
                                    <td><strong><?= e($cp['name']) ?></strong></td>
                                    <td><?= e($cp['organization']) ?></td>
                                    <td><?= e($cp['camp_level'] ?? '-') ?></td>
                                    <td><?= e($cp['date_range_text']) ?></td>
                                    <td><?= e($cp['location']) ?></td>
                                    <td><?= e($cp['certificate_no'] ?? '-') ?></td>
                                    <td>
                                        <form method="POST" style="display:inline;" onsubmit="return confirmDelete('this camp record')">
                                            <input type="hidden" name="action" value="delete_camp_certificate">
                                            <input type="hidden" name="id" value="<?= $cp['id'] ?>">
                                            <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                            <button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: PROFILE & RESUME ================= -->
            <section id="tab-profile" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-id-card"></i> Personal Bio & Information</h3>
                    </div>
                    <form method="POST">
                        <input type="hidden" name="action" value="update_profile">
                        <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="name" required value="<?= e($profile['name'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Primary Title</label>
                                <input type="text" name="title" required value="<?= e($profile['title'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Degree</label>
                                <input type="text" name="degree" required value="<?= e($profile['degree'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Institution</label>
                                <input type="text" name="institution" required value="<?= e($profile['institution'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Academic Status</label>
                                <input type="text" name="status" required value="<?= e($profile['status'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required value="<?= e($profile['email'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone" required value="<?= e($profile['phone'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>LinkedIn URL</label>
                                <input type="url" name="linkedin_url" value="<?= e($profile['linkedin_url'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>GitHub URL</label>
                                <input type="url" name="github_url" value="<?= e($profile['github_url'] ?? '') ?>">
                            </div>
                            <div class="form-group form-full">
                                <label>Hero Introduction</label>
                                <textarea name="hero_description" rows="3"><?= e($profile['hero_description'] ?? '') ?></textarea>
                            </div>
                            <div class="form-group form-full">
                                <label>About Me Description</label>
                                <textarea name="about_description" rows="4"><?= e($profile['about_description'] ?? '') ?></textarea>
                            </div>
                            <div class="form-group form-full">
                                <label>Career Objective</label>
                                <textarea name="career_objective" rows="2"><?= e($profile['career_objective'] ?? '') ?></textarea>
                            </div>
                            <div class="form-group">
                                <label>Meta SEO Title</label>
                                <input type="text" name="meta_title" value="<?= e($profile['meta_title'] ?? '') ?>">
                            </div>
                            <div class="form-group">
                                <label>Meta Description</label>
                                <input type="text" name="meta_description" value="<?= e($profile['meta_description'] ?? '') ?>">
                            </div>
                        </div>

                        <div style="margin-top:20px;">
                            <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Profile Details</button>
                        </div>
                    </form>
                </div>

                <!-- Profile Photo & Resume Upload -->
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-file-upload"></i> Profile Photo & Resume Upload</h3>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Update Profile Photo (JPG, PNG, WEBP)</label>
                            <input type="file" id="profilePhotoInput" accept="image/*">
                            <input type="hidden" id="profileImageField" value="<?= e($profile['profile_image'] ?? '') ?>">
                            <div class="image-preview-box" style="width:120px;height:120px;border-radius:50%;margin-top:10px;">
                                <img id="profilePhotoPreview" src="<?= e($profile['profile_image'] ?? '/uploads/profile.jpg') ?>" style="width:100%;height:100%;object-fit:cover;" alt="Avatar">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Update Resume PDF (Upload .pdf)</label>
                            <input type="file" id="resumeFileInput" accept="application/pdf">
                            <input type="hidden" id="resumePathField" value="<?= e($profile['resume_path'] ?? '') ?>">
                            <p style="font-size:0.85rem;color:#64748b;margin-top:8px;">
                                Current Resume: <a href="<?= e($profile['resume_path'] ?? '/uploads/Sanjai_B_Resume.pdf') ?>" target="_blank" style="color:#0066cc;">View Current PDF</a>
                            </p>
                            <p style="font-size:0.82rem;color:#10b981;">
                                <i class="fas fa-check-circle"></i> "Download Resume" button on public site immediately serves this latest uploaded file.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: PROJECTS ================= -->
            <section id="tab-projects" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-plus-circle"></i> Add Project / Book</h3>
                    </div>
                    <form method="POST">
                        <input type="hidden" name="action" value="add_project">
                        <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Project Title *</label>
                                <input type="text" name="title" required placeholder="The Mathematics Behind Modern Artificial Intelligence">
                            </div>
                            <div class="form-group">
                                <label>Category</label>
                                <input type="text" name="category" placeholder="Academic Research & AI / Web Application / Book">
                            </div>
                            <div class="form-group">
                                <label>Icon Class (Font Awesome)</label>
                                <input type="text" name="icon_class" value="fas fa-laptop-code" placeholder="fas fa-brain">
                            </div>
                            <div class="form-group">
                                <label>Technologies (Comma separated)</label>
                                <input type="text" name="technologies" required placeholder="Python, NumPy, Calculus, Linear Algebra">
                            </div>
                            <div class="form-group">
                                <label>GitHub URL</label>
                                <input type="url" name="github_url" placeholder="https://github.com/sanjaibabu310">
                            </div>
                            <div class="form-group">
                                <label>Sort Order</label>
                                <input type="number" name="sort_order" value="<?= count($projects) + 1 ?>">
                            </div>
                            <div class="form-group form-full">
                                <label>Project Description *</label>
                                <textarea name="description" rows="3" required placeholder="Detailed project summary..."></textarea>
                            </div>
                        </div>
                        <div style="margin-top:16px;">
                            <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Project</button>
                        </div>
                    </form>
                </div>

                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-folder-open"></i> Existing Projects (<?= count($projects) ?>)</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Technologies</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($projects as $pr): ?>
                                <tr>
                                    <td><?= (int)$pr['sort_order'] ?></td>
                                    <td><strong><?= e($pr['title']) ?></strong></td>
                                    <td><?= e($pr['category']) ?></td>
                                    <td><?= e($pr['technologies']) ?></td>
                                    <td>
                                        <form method="POST" style="display:inline;" onsubmit="return confirmDelete('this project')">
                                            <input type="hidden" name="action" value="delete_project">
                                            <input type="hidden" name="id" value="<?= $pr['id'] ?>">
                                            <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                            <button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: EXPERIENCE ================= -->
            <section id="tab-experience" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-briefcase"></i> Experience & Internship Records</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Organization</th>
                                    <th>Duration</th>
                                    <th>Mini Project</th>
                                    <th>Main Project</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($experience as $ex): ?>
                                <tr>
                                    <td><strong><?= e($ex['role_title']) ?></strong></td>
                                    <td><?= e($ex['organization']) ?> (<?= e($ex['location']) ?>)</td>
                                    <td><?= e($ex['duration']) ?></td>
                                    <td><?= e($ex['mini_project'] ?? '-') ?></td>
                                    <td><?= e($ex['main_project'] ?? '-') ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: RESEARCH ================= -->
            <section id="tab-research" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-microscope"></i> Research & Academic Activities (<?= count($research) ?>)</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($research as $re): ?>
                                <tr>
                                    <td><?= (int)$re['sort_order'] ?></td>
                                    <td><strong><?= e($re['title']) ?></strong></td>
                                    <td><?= e($re['description']) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: EDUCATION ================= -->
            <section id="tab-education" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-graduation-cap"></i> Educational Timeline</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Degree / Level</th>
                                    <th>Institution</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($education as $ed): ?>
                                <tr>
                                    <td><strong><?= e($ed['degree_title']) ?></strong> (<?= e($ed['specialization']) ?>)</td>
                                    <td><?= e($ed['institution']) ?></td>
                                    <td><?= e($ed['duration']) ?></td>
                                    <td><?= e($ed['status_text']) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: SKILLS ================= -->
            <section id="tab-skills" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-code"></i> Skills (<?= count($skills) ?>)</h3>
                    </div>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Skill Name</th>
                                    <th>Proficiency</th>
                                    <th>Icon</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($skills as $sk): ?>
                                <tr>
                                    <td><span style="text-transform:capitalize;"><?= e($sk['category']) ?></span></td>
                                    <td><strong><?= e($sk['name']) ?></strong></td>
                                    <td><?= (int)$sk['proficiency'] ?>%</td>
                                    <td><i class="<?= e($sk['icon_class']) ?>"></i> <?= e($sk['icon_class']) ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ================= TAB: MESSAGES INBOX ================= -->
            <section id="tab-messages" class="tab-panel">
                <div class="card">
                    <div class="card-title-bar">
                        <h3><i class="fas fa-envelope-open-text"></i> Contact Form Messages (<?= count($messages) ?>)</h3>
                    </div>
                    <?php if (empty($messages)): ?>
                        <p style="color:#64748b;padding:20px;text-align:center;">No inquiries or messages yet. Submissions from the contact form will appear here.</p>
                    <?php else: ?>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Sender</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($messages as $msg): ?>
                                <tr style="<?= !$msg['is_read'] ? 'background:#f0f9ff;font-weight:600;' : '' ?>">
                                    <td>
                                        <form method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="toggle_message_read">
                                            <input type="hidden" name="id" value="<?= $msg['id'] ?>">
                                            <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                            <button type="submit" class="btn btn-sm <?= $msg['is_read'] ? 'btn-outline' : 'btn-success' ?>">
                                                <?= $msg['is_read'] ? 'Read' : 'New' ?>
                                            </button>
                                        </form>
                                    </td>
                                    <td><?= e($msg['name']) ?></td>
                                    <td><a href="mailto:<?= e($msg['email']) ?>" style="color:#0066cc;"><?= e($msg['email']) ?></a></td>
                                    <td><?= e($msg['subject']) ?></td>
                                    <td><?= nl2br(e($msg['message'])) ?></td>
                                    <td style="font-size:0.8rem;color:#64748b;"><?= e($msg['created_at']) ?></td>
                                    <td>
                                        <form method="POST" style="display:inline;" onsubmit="return confirmDelete('this message')">
                                            <input type="hidden" name="action" value="delete_message">
                                            <input type="hidden" name="id" value="<?= $msg['id'] ?>">
                                            <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                            <button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php endif; ?>
                </div>
            </section>
        </div>
    </main>

    <script src="admin.js"></script>
</body>
</html>
