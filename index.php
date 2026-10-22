<?php
/**
 * Sanjai B - Personal Portfolio Website
 * 100% Database-Driven via PHP 8 & PDO
 * Design Reference: Modern Poppins + Playfair Display, Starry Hero, Theme Toggle, Lightbox
 */

require_once __DIR__ . '/config.php';

$pdo = getDB();

// Handle Contact Form Submission
$contact_feedback = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'contact') {
    // 1. Honeypot check (anti-spam)
    if (!empty($_POST['website_url_hp'])) {
        // Silent bot discard
        $contact_feedback = ['type' => 'success', 'message' => 'Thank you! Your message has been received.'];
    } else {
        $name    = trim($_POST['name'] ?? '');
        $email   = trim($_POST['email'] ?? '');
        $subject = trim($_POST['subject'] ?? '');
        $message = trim($_POST['message'] ?? '');
        $token   = $_POST['csrf_token'] ?? '';

        if (!verifyCsrfToken($token)) {
            $contact_feedback = ['type' => 'error', 'message' => 'Security token expired. Please refresh and try again.'];
        } elseif (empty($name) || empty($email) || empty($subject) || empty($message)) {
            $contact_feedback = ['type' => 'error', 'message' => 'Please fill out all required fields.'];
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $contact_feedback = ['type' => 'error', 'message' => 'Please provide a valid email address.'];
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO `messages` (`name`, `email`, `subject`, `message`, `ip_address`, `user_agent`)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);
            $stmt->execute([$name, $email, $subject, $message, $ip, $ua]);

            $contact_feedback = ['type' => 'success', 'message' => 'Thank you, ' . htmlspecialchars($name) . '! Your message has been sent successfully.'];
        }
    }
}

// 1. Fetch Profile
$stmtProfile = $pdo->query("SELECT * FROM `profile` WHERE id = 1 LIMIT 1");
$profile = $stmtProfile->fetch() ?: [
    'name' => 'Sanjai B',
    'title' => 'Aspiring Software Developer | Mathematics Enthusiast | Web Developer',
    'subtitle' => 'B.Sc. Mathematics with Computer Applications',
    'hero_description' => 'I am a B.Sc. Mathematics with Computer Applications student passionate about programming, web development, mathematics, data analysis, and emerging technologies.',
    'degree' => 'B.Sc. Mathematics with Computer Applications',
    'institution' => 'Don Bosco College (Co-Ed), Yelagiri Hills',
    'status' => 'Currently Pursuing',
    'about_description' => 'I am currently pursuing a Bachelor of Science in Mathematics with Computer Applications.',
    'career_objective' => 'To secure opportunities where I can apply my mathematical knowledge, programming skills, and technical expertise.',
    'email' => 'sanjaibabu1310@gmail.com',
    'phone' => '+91 97869 76122',
    'linkedin_url' => 'https://www.linkedin.com/in/sanjai-b-253a64349',
    'github_url' => 'https://github.com/sanjaibabu310',
    'profile_image' => '/uploads/profile.jpg',
    'resume_path' => '/uploads/Sanjai_B_Resume.pdf',
    'meta_title' => 'Sanjai B | Mathematics & Computer Applications Student',
    'meta_description' => 'Portfolio of Sanjai B - Aspiring Software Developer, Web Developer, Mathematics Enthusiast'
];

// 2. Fetch Skills by Category
$stmtSkills = $pdo->query("SELECT * FROM `skills` ORDER BY `sort_order` ASC, `id` ASC");
$allSkills = $stmtSkills->fetchAll();
$technicalSkills = array_filter($allSkills, fn($s) => $s['category'] === 'technical');
$academicSkills  = array_filter($allSkills, fn($s) => $s['category'] === 'academic');
$softSkills      = array_filter($allSkills, fn($s) => $s['category'] === 'soft');

// 3. Fetch Projects
$stmtProjects = $pdo->query("SELECT * FROM `projects` ORDER BY `sort_order` ASC, `id` ASC");
$projects = $stmtProjects->fetchAll();

// 4. Fetch Research
$stmtResearch = $pdo->query("SELECT * FROM `research` ORDER BY `sort_order` ASC, `id` ASC");
$research = $stmtResearch->fetchAll();

// 5. Fetch Education
$stmtEducation = $pdo->query("SELECT * FROM `education` ORDER BY `sort_order` ASC, `id` ASC");
$education = $stmtEducation->fetchAll();

// 6. Fetch Experience
$stmtExperience = $pdo->query("SELECT * FROM `experience` ORDER BY `sort_order` ASC, `id` ASC");
$experience = $stmtExperience->fetchAll();

// 7. Fetch Certificates (Newest first, null event_date at end)
$stmtCerts = $pdo->query("
    SELECT * FROM `certificates` 
    ORDER BY CASE WHEN `event_date` IS NOT NULL THEN 0 ELSE 1 END, `event_date` DESC, `id` DESC
");
$certificates = $stmtCerts->fetchAll();

// 8. Fetch Camp Certificates (Newest first)
$stmtCamps = $pdo->query("
    SELECT * FROM `camp_certificates` 
    ORDER BY CASE WHEN `date_to` IS NOT NULL THEN 0 ELSE 1 END, `date_to` DESC, `id` DESC
");
$campCertificates = $stmtCamps->fetchAll();

// 9. Fetch Achievements
$stmtAchievements = $pdo->query("SELECT * FROM `achievements` ORDER BY `sort_order` ASC, `id` ASC");
$achievements = $stmtAchievements->fetchAll();

// 10. Compute Summary Strip Stats from database
$total_certs = count($certificates) + count($campCertificates);
$total_first_places = 0;
$total_cash_awards = 0;

foreach ($certificates as $c) {
    if ((string)$c['place_rank'] === '1') {
        $total_first_places++;
    }
    if (!empty($c['cash_award'])) {
        $total_cash_awards += (float)$c['cash_award'];
    }
}
foreach ($campCertificates as $cc) {
    if (!empty($cc['cash_award'])) {
        $total_cash_awards += (float)$cc['cash_award'];
    }
}

$csrf_token = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= e($profile['meta_description']) ?>">
    <meta name="keywords" content="<?= e($profile['meta_keywords'] ?? 'Sanjai B, Portfolio, Mathematics, Software Developer') ?>">
    <meta name="author" content="<?= e($profile['name']) ?>">
    <meta property="og:title" content="<?= e($profile['meta_title']) ?>">
    <meta property="og:description" content="<?= e($profile['meta_description']) ?>">
    <meta property="og:type" content="website">
    <meta property="og:image" content="<?= e(SITE_URL . $profile['profile_image']) ?>">
    <title><?= e($profile['meta_title']) ?></title>
    
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar" role="navigation" aria-label="Main Navigation">
        <div class="navbar-container">
            <div class="nav-logo">
                <a href="#home"><?= e(explode(' ', $profile['name'])[0]) ?><span>.</span></a>
            </div>
            <button class="hamburger" id="hamburger" aria-label="Toggle navigation menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#skills" class="nav-link">Skills</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#research" class="nav-link">Research</a></li>
                <li><a href="#education" class="nav-link">Education</a></li>
                <li><a href="#certificates" class="nav-link">Certificates</a></li>
                <li><a href="#experience" class="nav-link">Experience</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
                <li><a href="/admin/" class="nav-link admin-link" title="Admin Panel"><i class="fas fa-lock"></i> Admin</a></li>
                <li><button id="themeToggle" class="nav-link theme-toggle" aria-label="Toggle Dark Mode"><i class="fas fa-moon"></i></button></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="stars" aria-hidden="true"></div>
        <div class="container hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Hello, I'm <span class="highlight"><?= e($profile['name']) ?></span></h1>
                <p class="hero-subtitle"><?= e($profile['title']) ?></p>
                <p class="hero-description"><?= e($profile['hero_description']) ?></p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="document.getElementById('about').scrollIntoView({behavior: 'smooth'})">
                        <i class="fas fa-user"></i> About Me
                    </button>
                    <button class="btn btn-secondary" onclick="document.getElementById('projects').scrollIntoView({behavior: 'smooth'})">
                        <i class="fas fa-folder"></i> View Projects
                    </button>
                    <a href="<?= e($profile['resume_path']) ?>" download="Sanjai_B_Resume.pdf" class="btn btn-primary">
                        <i class="fas fa-download"></i> Download Resume
                    </a>
                    <button class="btn btn-secondary" onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})">
                        <i class="fas fa-envelope"></i> Contact Me
                    </button>
                </div>
            </div>
            <div class="hero-image">
                <div class="profile-placeholder">
                    <img src="<?= e($profile['profile_image']) ?>" alt="<?= e($profile['name']) ?>" class="profile-img" onerror="this.onerror=null; this.src='/uploads/profile.svg';">
                </div>
            </div>
        </div>
        <div class="scroll-indicator" aria-hidden="true">
            <span>Scroll Down</span>
            <i class="fas fa-chevron-down"></i>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <h3><?= e($profile['about_heading'] ?? $profile['name']) ?></h3>
                    <div class="about-info">
                        <p><strong>Degree:</strong> <?= e($profile['degree']) ?></p>
                        <p><strong>Institution:</strong> <?= e($profile['institution']) ?></p>
                        <p><strong>Status:</strong> <?= e($profile['status']) ?></p>
                    </div>
                    <p class="about-description">
                        <?= nl2br(e($profile['about_description'])) ?>
                    </p>
                    <div class="career-objective">
                        <h4><i class="fas fa-bullseye"></i> Career Objective</h4>
                        <p><?= e($profile['career_objective']) ?></p>
                    </div>
                </div>
                <div class="about-image">
                    <div class="about-placeholder">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>
            <div class="skills-grid">
                <!-- Technical Skills -->
                <div class="skill-category">
                    <h3><i class="fas fa-code"></i> Technical Skills</h3>
                    <div class="skill-cards">
                        <?php foreach ($technicalSkills as $s): ?>
                        <div class="skill-card">
                            <div class="skill-icon"><i class="<?= e($s['icon_class']) ?>"></i></div>
                            <h4><?= e($s['name']) ?></h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: <?= (int)$s['proficiency'] ?>%;"></div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Academic Skills -->
                <div class="skill-category">
                    <h3><i class="fas fa-graduation-cap"></i> Academic Skills</h3>
                    <div class="skill-cards">
                        <?php foreach ($academicSkills as $s): ?>
                        <div class="skill-card">
                            <div class="skill-icon"><i class="<?= e($s['icon_class']) ?>"></i></div>
                            <h4><?= e($s['name']) ?></h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: <?= (int)$s['proficiency'] ?>%;"></div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Soft Skills -->
                <div class="skill-category">
                    <h3><i class="fas fa-users"></i> Soft Skills</h3>
                    <div class="skill-cards">
                        <?php foreach ($softSkills as $s): ?>
                        <div class="skill-card">
                            <div class="skill-icon"><i class="<?= e($s['icon_class']) ?>"></i></div>
                            <h4><?= e($s['name']) ?></h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: <?= (int)$s['proficiency'] ?>%;"></div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                <?php foreach ($projects as $proj): ?>
                <div class="project-card">
                    <div class="project-image">
                        <i class="<?= e($proj['icon_class']) ?>"></i>
                        <span class="project-overlay">
                            <?php if (!empty($proj['github_url']) && $proj['github_url'] !== '#'): ?>
                            <a href="<?= e($proj['github_url']) ?>" target="_blank" rel="noopener noreferrer" class="project-link" title="View Source"><i class="fab fa-github"></i></a>
                            <?php else: ?>
                            <a href="#contact" class="project-link" title="Learn More"><i class="fas fa-external-link-alt"></i></a>
                            <?php endif; ?>
                        </span>
                    </div>
                    <div class="project-content">
                        <h3><?= e($proj['title']) ?></h3>
                        <p><?= e($proj['description']) ?></p>
                        <div class="project-tech">
                            <?php foreach (explode(',', $proj['technologies']) as $tech): ?>
                                <span><?= e(trim($tech)) ?></span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Research & Academic Activities -->
    <section id="research" class="research">
        <div class="container">
            <h2 class="section-title">Research & Academic Activities</h2>
            <div class="research-timeline">
                <?php foreach ($research as $res): ?>
                <div class="research-item">
                    <div class="research-icon">
                        <i class="<?= e($res['icon_class']) ?>"></i>
                    </div>
                    <div class="research-content">
                        <h3><?= e($res['title']) ?></h3>
                        <p><?= e($res['description']) ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Education Timeline Section -->
    <section id="education" class="education">
        <div class="container">
            <h2 class="section-title">Educational Journey</h2>
            <p class="section-subtitle">Building Excellence Through Academic Growth</p>
            
            <div class="education-timeline">
                <?php foreach ($education as $edu): ?>
                <div class="timeline-item <?= $edu['status_type'] === 'current' ? 'active' : '' ?>">
                    <div class="timeline-marker">
                        <i class="<?= e($edu['icon_class']) ?>"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="education-card">
                            <div class="degree-header">
                                <h3 class="degree-title"><?= e($edu['degree_title']) ?></h3>
                                <span class="degree-specialization"><?= e($edu['specialization']) ?></span>
                            </div>
                            <div class="education-details">
                                <div class="detail-item">
                                    <i class="fas fa-university"></i>
                                    <div>
                                        <strong>Institution:</strong>
                                        <p><?= e($edu['institution']) ?></p>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-calendar-alt"></i>
                                    <div>
                                        <strong>Duration:</strong>
                                        <p><?= e($edu['duration']) ?></p>
                                    </div>
                                </div>
                            </div>
                            <div class="education-description">
                                <p><?= e($edu['description']) ?></p>
                            </div>
                            <div class="key-areas">
                                <h4><i class="fas fa-lightbulb"></i> <?= e($edu['key_areas_label']) ?>:</h4>
                                <div class="skills-tags">
                                    <?php foreach (explode(',', $edu['key_areas_tags']) as $tag): ?>
                                    <span class="skill-tag"><?= e(trim($tag)) ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <div class="status-badge <?= $edu['status_type'] === 'current' ? 'current' : 'completed' ?>">
                                <i class="<?= $edu['status_type'] === 'current' ? 'fas fa-star' : 'fas fa-check-circle' ?>"></i> <?= e($edu['status_text']) ?>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Academic Journey Highlights -->
            <div class="academic-journey">
                <h3><i class="fas fa-compass"></i> Academic Journey Highlights</h3>
                <p>My educational journey reflects a strong passion for mathematics, technology, and continuous learning. From building fundamental knowledge during my SSLC and HSC studies to pursuing advanced mathematical and computational concepts at the undergraduate level, I remain committed to academic excellence and professional development.</p>
                
                <div class="journey-highlights">
                    <div class="highlight-item">
                        <div class="highlight-icon"><i class="fas fa-calculator"></i></div>
                        <h4>Strong Mathematical Foundation</h4>
                        <p>Excelling in advanced mathematics and computational concepts</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon"><i class="fas fa-laptop-code"></i></div>
                        <h4>Computer Science Background</h4>
                        <p>Comprehensive understanding of programming and computer applications</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon"><i class="fas fa-brain"></i></div>
                        <h4>Analytical Thinking</h4>
                        <p>Developed critical thinking and logical reasoning skills</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon"><i class="fas fa-puzzle-piece"></i></div>
                        <h4>Problem Solving Skills</h4>
                        <p>Expertise in complex problem analysis and solution development</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon"><i class="fas fa-sync-alt"></i></div>
                        <h4>Continuous Learning</h4>
                        <p>Committed to staying updated with emerging technologies</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon"><i class="fas fa-rocket"></i></div>
                        <h4>Technology Enthusiast</h4>
                        <p>Passionate about innovation and technological advancement</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- NEW SECTION: Certificates & Achievements with Lightbox & Filters -->
    <section id="certificates" class="certificates-section">
        <div class="container">
            <h2 class="section-title">Certificates & Achievements</h2>
            <p class="section-subtitle">Verified Records of Academic, Co-Curricular & Competitive Excellence</p>

            <!-- Dynamic Summary Strip -->
            <div class="summary-strip">
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-award"></i></div>
                    <div class="summary-info">
                        <span class="summary-number"><?= $total_certs ?></span>
                        <span class="summary-label">Total Verified Records</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon gold"><i class="fas fa-trophy"></i></div>
                    <div class="summary-info">
                        <span class="summary-number"><?= $total_first_places ?></span>
                        <span class="summary-label">1st Places & Wins</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon green"><i class="fas fa-rupee-sign"></i></div>
                    <div class="summary-info">
                        <span class="summary-number">₹<?= number_format($total_cash_awards) ?></span>
                        <span class="summary-label">Cash Awards Won</span>
                    </div>
                </div>
            </div>

            <!-- Filter Controls Bar -->
            <div class="cert-controls">
                <div class="filter-buttons" role="tablist">
                    <button class="filter-btn active" data-filter="all">All (<?= $total_certs ?>)</button>
                    <button class="filter-btn" data-filter="competition">Competitions</button>
                    <button class="filter-btn" data-filter="workshop">Workshops</button>
                    <button class="filter-btn" data-filter="camp">Camps</button>
                    <button class="filter-btn" data-filter="other">Other Events</button>
                </div>
                <div class="cert-search-wrap">
                    <div class="search-input-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="certSearch" placeholder="Search event, organizer, award...">
                    </div>
                    <select id="certYearFilter" class="year-select" aria-label="Filter by Year">
                        <option value="all">All Years</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2016">2016</option>
                    </select>
                </div>
            </div>

            <!-- Certificates Grid -->
            <div class="certs-grid" id="certsGrid">
                <!-- Sheet 1 Certificates -->
                <?php foreach ($certificates as $idx => $cert): 
                    $cat = 'other';
                    if (!empty($cert['competition_level'])) $cat = 'competition';
                    elseif (!empty($cert['workshop_level'])) $cat = 'workshop';
                    
                    $level = $cert['competition_level'] ?: ($cert['workshop_level'] ?: ($cert['other_category'] ?: 'Recognized'));
                    $year = substr($cert['date_text'], -4);
                    if (!preg_match('/^\d{4}$/', $year)) {
                        preg_match('/\b(20\d\d)\b/', $cert['date_text'], $ym);
                        $year = $ym[1] ?? 'other';
                    }
                ?>
                <div class="cert-item-card" 
                     data-category="<?= e($cat) ?>" 
                     data-year="<?= e($year) ?>"
                     data-title="<?= e(strtolower($cert['name'])) ?>"
                     data-org="<?= e(strtolower($cert['organization'])) ?>"
                     data-remarks="<?= e(strtolower($cert['remarks'] ?? '')) ?>"
                     data-type="cert"
                     data-index="<?= $idx ?>">
                    
                    <div class="cert-thumb-box" onclick="openLightbox('cert', <?= $idx ?>)">
                        <img src="<?= e($cert['thumbnail_path'] ?: $cert['image_path']) ?>" 
                             alt="<?= e($cert['name']) ?> Certificate" 
                             loading="lazy" 
                             class="cert-thumbnail"
                             onerror="this.onerror=null; this.src='/uploads/certificates/cert-placeholder.svg';">
                        <div class="thumb-hover-overlay">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span>View Full Certificate</span>
                        </div>
                        <?php if (!empty($cert['place_rank'])): ?>
                            <div class="rank-badge rank-<?= e($cert['place_rank']) ?>">
                                <?= $cert['place_rank'] === '1' ? '🥇 1st Place' : ($cert['place_rank'] === '2' ? '🥈 2nd Place' : '🥉 3rd Place') ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="cert-card-body">
                        <div class="cert-card-header">
                            <span class="level-badge level-<?= strtolower(str_replace(' ', '-', $level)) ?>">
                                <i class="fas fa-layer-group"></i> <?= e($level) ?>
                            </span>
                            <span class="cert-date-kicker">
                                <i class="far fa-calendar-alt"></i> <?= e($cert['date_text']) ?>
                            </span>
                        </div>
                        
                        <h3 class="cert-card-title"><?= e($cert['name']) ?></h3>
                        <p class="cert-card-org"><i class="fas fa-university"></i> <?= e($cert['organization']) ?></p>
                        
                        <?php if (!empty($cert['cash_award'])): ?>
                        <div class="cert-award-pill">
                            <i class="fas fa-gift"></i> Cash Award: <strong>₹<?= number_format($cert['cash_award']) ?></strong>
                        </div>
                        <?php endif; ?>

                        <?php if (!empty($cert['remarks'])): ?>
                        <p class="cert-card-remarks"><i class="fas fa-info-circle"></i> <?= e($cert['remarks']) ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>

                <!-- Sheet 2 Camp Certificates -->
                <?php foreach ($campCertificates as $cidx => $camp): 
                    $year = substr($camp['date_range_text'], -4);
                    if (!preg_match('/^\d{4}$/', $year)) {
                        preg_match('/\b(20\d\d)\b/', $camp['date_range_text'], $ym);
                        $year = $ym[1] ?? 'other';
                    }
                    $campGlobalIdx = count($certificates) + $cidx;
                ?>
                <div class="cert-item-card" 
                     data-category="camp" 
                     data-year="<?= e($year) ?>"
                     data-title="<?= e(strtolower($camp['name'])) ?>"
                     data-org="<?= e(strtolower($camp['organization'])) ?>"
                     data-remarks="<?= e(strtolower($camp['other_note'] ?? '')) ?>"
                     data-type="camp"
                     data-index="<?= $campGlobalIdx ?>">
                    
                    <div class="cert-thumb-box" onclick="openLightbox('camp', <?= $cidx ?>)">
                        <img src="<?= e($camp['thumbnail_path'] ?: $camp['image_path']) ?>" 
                             alt="<?= e($camp['name']) ?> Camp Certificate" 
                             loading="lazy" 
                             class="cert-thumbnail"
                             onerror="this.onerror=null; this.src='/uploads/certificates/camp-placeholder.svg';">
                        <div class="thumb-hover-overlay">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span>View Full Camp Record</span>
                        </div>
                        <div class="rank-badge rank-camp">
                            <i class="fas fa-campground"></i> Special Camp
                        </div>
                    </div>

                    <div class="cert-card-body">
                        <div class="cert-card-header">
                            <span class="level-badge level-camp">
                                <i class="fas fa-compass"></i> <?= e($camp['camp_level'] ?: 'State') ?> Camp
                            </span>
                            <span class="cert-date-kicker">
                                <i class="far fa-calendar-alt"></i> <?= e($camp['date_range_text']) ?>
                            </span>
                        </div>
                        
                        <h3 class="cert-card-title"><?= e($camp['name']) ?></h3>
                        <p class="cert-card-org"><i class="fas fa-university"></i> <?= e($camp['organization']) ?></p>
                        
                        <p class="cert-location"><i class="fas fa-map-marker-alt"></i> <?= e($camp['location']) ?></p>

                        <?php if (!empty($camp['certificate_no'])): ?>
                        <p class="cert-card-no"><i class="fas fa-stamp"></i> No: <?= e($camp['certificate_no']) ?></p>
                        <?php endif; ?>

                        <?php if (!empty($camp['other_note'])): ?>
                        <p class="cert-card-remarks"><i class="fas fa-clipboard-check"></i> <?= e($camp['other_note']) ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Empty Search State -->
            <div id="noCertsFound" class="no-certs-box" style="display: none;">
                <i class="fas fa-search-minus"></i>
                <h3>No certificates match your search</h3>
                <p>Try selecting a different category or clearing search filters.</p>
                <button class="btn btn-secondary" onclick="resetCertFilters()">Reset Filters</button>
            </div>
        </div>
    </section>

    <!-- Experience / Internship Section -->
    <section id="experience" class="experience-section">
        <div class="container">
            <h2 class="section-title">Experience & Internships</h2>
            <div class="experience-cards">
                <?php foreach ($experience as $exp): ?>
                <div class="experience-card">
                    <div class="exp-header">
                        <div class="exp-title-group">
                            <h3><i class="fas fa-briefcase"></i> <?= e($exp['role_title']) ?></h3>
                            <h4 class="company-name"><?= e($exp['organization']) ?></h4>
                        </div>
                        <div class="exp-meta">
                            <span class="exp-duration"><i class="far fa-calendar-alt"></i> <?= e($exp['duration']) ?></span>
                            <span class="exp-location"><i class="fas fa-map-marker-alt"></i> <?= e($exp['location']) ?></span>
                        </div>
                    </div>
                    <p class="exp-desc"><?= e($exp['description']) ?></p>
                    
                    <div class="exp-projects-block">
                        <?php if (!empty($exp['mini_project'])): ?>
                        <div class="exp-proj-item">
                            <h5><i class="fas fa-microchip"></i> Mini Project:</h5>
                            <p><?= e($exp['mini_project']) ?></p>
                        </div>
                        <?php endif; ?>

                        <?php if (!empty($exp['main_project'])): ?>
                        <div class="exp-proj-item">
                            <h5><i class="fas fa-network-wired"></i> Main Project:</h5>
                            <p><?= e($exp['main_project']) ?></p>
                        </div>
                        <?php endif; ?>
                    </div>

                    <div class="exp-skills">
                        <strong>Key Skills & Hardware:</strong>
                        <div class="skills-tags">
                            <?php foreach (explode(',', $exp['skills_acquired']) as $sk): ?>
                            <span class="skill-tag"><?= e(trim($sk)) ?></span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Achievements Section -->
    <section id="achievements" class="achievements">
        <div class="container">
            <h2 class="section-title">Achievements</h2>
            <div class="achievements-grid">
                <?php foreach ($achievements as $ach): ?>
                <div class="achievement-card">
                    <div class="achievement-icon"><i class="<?= e($ach['icon_class']) ?>"></i></div>
                    <h3><?= e($ach['title']) ?></h3>
                    <p><?= e($ach['description']) ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            
            <?php if ($contact_feedback): ?>
            <div class="alert-box alert-<?= $contact_feedback['type'] ?>">
                <i class="fas <?= $contact_feedback['type'] === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle' ?>"></i>
                <span><?= e($contact_feedback['message']) ?></span>
            </div>
            <?php endif; ?>

            <div class="contact-wrapper">
                <div class="contact-info">
                    <h3>Contact Information</h3>
                    <div class="contact-item">
                        <div class="contact-icon"><i class="fas fa-user"></i></div>
                        <div class="contact-details">
                            <h4>Name</h4>
                            <p><?= e($profile['name']) ?></p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                        <div class="contact-details">
                            <h4>Email</h4>
                            <a href="mailto:<?= e($profile['email']) ?>"><?= e($profile['email']) ?></a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon"><i class="fas fa-phone"></i></div>
                        <div class="contact-details">
                            <h4>Phone</h4>
                            <a href="tel:<?= preg_replace('/\s+/', '', $profile['phone']) ?>"><?= e($profile['phone']) ?></a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon"><i class="fab fa-linkedin"></i></div>
                        <div class="contact-details">
                            <h4>LinkedIn</h4>
                            <a href="<?= e($profile['linkedin_url']) ?>" target="_blank" rel="noopener noreferrer"><?= e($profile['name']) ?></a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon"><i class="fab fa-github"></i></div>
                        <div class="contact-details">
                            <h4>GitHub</h4>
                            <a href="<?= e($profile['github_url']) ?>" target="_blank" rel="noopener noreferrer">sanjaibabu310</a>
                        </div>
                    </div>
                    <div class="social-links">
                        <h4>Follow Me</h4>
                        <div class="social-icons">
                            <a href="<?= e($profile['linkedin_url']) ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a href="<?= e($profile['github_url']) ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="mailto:<?= e($profile['email']) ?>" class="social-icon" aria-label="Send Email">
                                <i class="fas fa-envelope"></i>
                            </a>
                            <a href="tel:<?= preg_replace('/\s+/', '', $profile['phone']) ?>" class="social-icon" aria-label="Call">
                                <i class="fas fa-phone"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <form class="contact-form" id="contactForm" method="POST" action="#contact">
                    <input type="hidden" name="action" value="contact">
                    <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                    <!-- Anti-spam Honeypot (hidden from human users) -->
                    <div style="display:none !important;" aria-hidden="true">
                        <label for="website_url_hp">Leave this field blank</label>
                        <input type="text" name="website_url_hp" id="website_url_hp" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" required placeholder="Your Name">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required placeholder="your.email@example.com">
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject *</label>
                        <input type="text" id="subject" name="subject" required placeholder="Project Inquiry / Opportunity">
                    </div>
                    <div class="form-group">
                        <label for="message">Message *</label>
                        <textarea id="message" name="message" rows="5" required placeholder="Write your message here..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>
            </div>

            <!-- Map Location -->
            <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.8267621485024!2d78.85477!3d12.16528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac7bd0df67c7ff%3A0x8d25e7a5db2e5e5f!2sDon%20Bosco%20College%2C%20Yelagiri!5e0!3m2!1sen!2sin!4v1234567890" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Don Bosco College Yelagiri Map"></iframe>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#skills">Skills</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#certificates">Certificates</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Social Connect</h3>
                    <div class="footer-social">
                        <a href="<?= e($profile['linkedin_url']) ?>" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="<?= e($profile['github_url']) ?>" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        <a href="mailto:<?= e($profile['email']) ?>" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        <a href="tel:<?= preg_replace('/\s+/', '', $profile['phone']) ?>" aria-label="Phone"><i class="fas fa-phone"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Contact Info</h3>
                    <p><strong>Email:</strong> <?= e($profile['email']) ?></p>
                    <p><strong>Phone:</strong> <?= e($profile['phone']) ?></p>
                    <p><strong>Institution:</strong> <?= e($profile['institution']) ?></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?= date('Y') ?> <?= e($profile['name']) ?>. All Rights Reserved. • <a href="/admin/" style="color:#60a5fa;text-decoration:none;"><i class="fas fa-lock"></i> Admin Portal</a></p>
            </div>
        </div>
    </footer>

    <!-- Lightbox Modal for Certificates -->
    <div id="certLightbox" class="lightbox-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="lightbox-backdrop" onclick="closeLightbox()"></div>
        <div class="lightbox-container">
            <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close Certificate modal">&times;</button>
            <button class="lightbox-arrow prev-arrow" onclick="navLightbox(-1)" aria-label="Previous Certificate"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-arrow next-arrow" onclick="navLightbox(1)" aria-label="Next Certificate"><i class="fas fa-chevron-right"></i></button>
            
            <div class="lightbox-body">
                <div class="lightbox-image-wrap">
                    <img id="lightboxImg" src="" alt="Certificate Preview" class="lightbox-image">
                </div>
                <div class="lightbox-details" id="lightboxDetails">
                    <span id="lbBadge" class="lightbox-badge"></span>
                    <h3 id="lbTitle" class="lightbox-title"></h3>
                    <p id="lbOrg" class="lightbox-org"></p>
                    <div class="lightbox-meta-grid">
                        <div class="lb-meta-item">
                            <span class="lb-meta-label">Date:</span>
                            <span id="lbDate" class="lb-meta-val"></span>
                        </div>
                        <div class="lb-meta-item" id="lbRankItem">
                            <span class="lb-meta-label">Result / Rank:</span>
                            <span id="lbRank" class="lb-meta-val"></span>
                        </div>
                        <div class="lb-meta-item" id="lbAwardItem">
                            <span class="lb-meta-label">Cash Award:</span>
                            <span id="lbAward" class="lb-meta-val"></span>
                        </div>
                        <div class="lb-meta-item" id="lbLocItem">
                            <span class="lb-meta-label">Location:</span>
                            <span id="lbLoc" class="lb-meta-val"></span>
                        </div>
                    </div>
                    <div id="lbRemarksItem" class="lightbox-remarks-box">
                        <strong>Remarks & Scope:</strong>
                        <p id="lbRemarks"></p>
                    </div>
                    <div class="lightbox-actions">
                        <a id="lbDownloadBtn" href="" download class="btn btn-primary"><i class="fas fa-download"></i> View / Download High-Res</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scroll to Top Button -->
    <button id="scrollToTop" class="scroll-to-top" aria-label="Scroll to top of page">
        <i class="fas fa-arrow-up"></i>
    </button>

    <!-- Embedded Certificate JSON dataset for Lightbox -->
    <script>
        const CERTIFICATES_DATA = <?= json_encode(array_values($certificates)) ?>;
        const CAMP_DATA = <?= json_encode(array_values($campCertificates)) ?>;
    </script>
    <script src="script.js"></script>
</body>
</html>
