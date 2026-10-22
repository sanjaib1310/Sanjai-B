<?php
/**
 * Admin Login Page
 * Security: CSRF token, password_verify(), rate limiting (max 5 attempts with lockout)
 */

require_once __DIR__ . '/../config.php';

// Redirect if already logged in
if (!empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: index.php');
    exit;
}

$pdo = getDB();
$error_msg = '';

// Check if admin user exists; if none, redirect to setup
$checkAdmin = $pdo->query("SELECT COUNT(*) FROM `admin_users`")->fetchColumn();
if ($checkAdmin == 0) {
    header('Location: setup.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string)($_POST['password'] ?? '');
    $csrf     = $_POST['csrf_token'] ?? '';

    if (!verifyCsrfToken($csrf)) {
        $error_msg = 'Invalid security token. Please try again.';
    } elseif (empty($username) || empty($password)) {
        $error_msg = 'Please enter both username and password.';
    } else {
        // Find user
        $stmt = $pdo->prepare("SELECT * FROM `admin_users` WHERE `username` = ? OR `email` = ? LIMIT 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if ($user) {
            // Check rate limiting: max 5 attempts in 15 minutes
            $attempts = (int)$user['failed_login_attempts'];
            $last_fail = $user['last_failed_login'] ? strtotime($user['last_failed_login']) : 0;
            $now = time();

            if ($attempts >= 5 && ($now - $last_fail) < 900) {
                $wait_mins = ceil((900 - ($now - $last_fail)) / 60);
                $error_msg = "Too many failed attempts. Account temporarily locked. Please try again in {$wait_mins} minute(s).";
            } else {
                if (password_verify($password, $user['password_hash'])) {
                    // Reset failed attempts
                    $resetStmt = $pdo->prepare("UPDATE `admin_users` SET `failed_login_attempts` = 0, `last_failed_login` = NULL WHERE `id` = ?");
                    $resetStmt->execute([$user['id']]);

                    // Session regeneration for fixation protection
                    session_regenerate_id(true);
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_user_id'] = $user['id'];
                    $_SESSION['admin_username'] = $user['username'];

                    header('Location: index.php');
                    exit;
                } else {
                    // Increment failed attempt
                    $failStmt = $pdo->prepare("UPDATE `admin_users` SET `failed_login_attempts` = `failed_login_attempts` + 1, `last_failed_login` = NOW() WHERE `id` = ?");
                    $failStmt->execute([$user['id']]);
                    $error_msg = 'Invalid credentials. Please verify your login details.';
                }
            }
        } else {
            // Generic message to prevent user enumeration
            $error_msg = 'Invalid credentials. Please verify your login details.';
        }
    }
}

$csrf_token = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Sanjai B Portfolio</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
            padding: 20px;
        }
        .login-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .login-header {
            text-align: center;
            margin-bottom: 28px;
        }
        .login-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(0, 102, 204, 0.1);
            color: #0066cc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin: 0 auto 16px;
        }
        .login-header h2 {
            font-size: 1.6rem;
            color: #0f172a;
            margin-bottom: 6px;
        }
        .login-header p {
            color: #64748b;
            font-size: 0.9rem;
        }
        .alert-error {
            background: #fef2f2;
            color: #b91c1c;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.88rem;
            border: 1px solid #fecaca;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .login-card .form-group label {
            color: #1e293b;
        }
        .login-card .btn {
            width: 100%;
            justify-content: center;
            margin-top: 10px;
        }
        .back-home {
            text-align: center;
            margin-top: 20px;
        }
        .back-home a {
            color: #64748b;
            text-decoration: none;
            font-size: 0.88rem;
            transition: color 0.2s;
        }
        .back-home a:hover {
            color: #0066cc;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-header">
            <div class="login-icon"><i class="fas fa-user-shield"></i></div>
            <h2>Admin Portal</h2>
            <p>Sanjai B Portfolio Management System</p>
        </div>

        <?php if ($error_msg): ?>
            <div class="alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <span><?= e($error_msg) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
            
            <div class="form-group">
                <label for="username"><i class="fas fa-user"></i> Username or Email</label>
                <input type="text" id="username" name="username" required autofocus placeholder="admin">
            </div>

            <div class="form-group">
                <label for="password"><i class="fas fa-lock"></i> Password</label>
                <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>

            <button type="submit" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> Sign In to Dashboard
            </button>
        </form>

        <div class="back-home">
            <a href="/"><i class="fas fa-arrow-left"></i> Return to Public Portfolio</a>
        </div>
    </div>
</body>
</html>
