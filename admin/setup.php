<?php
/**
 * Initial Admin Setup Page
 * Allows creating the initial administrator account securely.
 * Automatically disabled once an admin user exists (unless authorized with SETUP_TOKEN).
 */

require_once __DIR__ . '/../config.php';

$pdo = getDB();
$adminCount = $pdo->query("SELECT COUNT(*) FROM `admin_users`")->fetchColumn();

// If admin exists, only allow reset if authorized token provided in GET or .env
$setup_token = getenv('SETUP_TOKEN') ?: 'sanjai_secure_setup_token';
$can_setup = ($adminCount == 0) || (isset($_GET['token']) && $_GET['token'] === $setup_token);

if (!$can_setup) {
    die("Setup is already completed. Please log in at <a href='login.php'>login.php</a>.");
}

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = (string)($_POST['password'] ?? '');
    $confirm  = (string)($_POST['confirm_password'] ?? '');

    if (empty($username) || empty($email) || empty($password)) {
        $error = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email address.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters long.';
    } elseif ($password !== $confirm) {
        $error = 'Passwords do not match.';
    } else {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        
        if ($adminCount == 0) {
            $stmt = $pdo->prepare("INSERT INTO `admin_users` (`username`, `email`, `password_hash`) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $hash]);
        } else {
            // Update existing primary admin
            $stmt = $pdo->prepare("UPDATE `admin_users` SET `username` = ?, `email` = ?, `password_hash` = ?, `failed_login_attempts` = 0 WHERE id = 1");
            $stmt->execute([$username, $email, $hash]);
        }

        $message = "Admin account created successfully! You can now log in.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Initial Setup | Sanjai B Portfolio</title>
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
        .setup-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 460px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .setup-card h2 {
            color: #0f172a;
            font-size: 1.6rem;
            margin-bottom: 8px;
        }
        .setup-card p {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 24px;
        }
        .alert-success {
            background: #ecfdf5;
            color: #065f46;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #a7f3d0;
        }
        .alert-error {
            background: #fef2f2;
            color: #b91c1c;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #fecaca;
        }
        .btn-full {
            width: 100%;
            justify-content: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="setup-card">
        <h2><i class="fas fa-tools"></i> Admin Account Setup</h2>
        <p>Initialize or update the primary administrator credentials for your portfolio.</p>

        <?php if ($message): ?>
            <div class="alert-success">
                <i class="fas fa-check-circle"></i> <?= e($message) ?>
                <div style="margin-top:12px;">
                    <a href="login.php" class="btn btn-primary btn-full"><i class="fas fa-sign-in-alt"></i> Proceed to Login</a>
                </div>
            </div>
        <?php else: ?>

            <?php if ($error): ?>
                <div class="alert-error">
                    <i class="fas fa-exclamation-circle"></i> <?= e($error) ?>
                </div>
            <?php endif; ?>

            <form method="POST">
                <div class="form-group">
                    <label for="username">Admin Username</label>
                    <input type="text" id="username" name="username" required value="admin" placeholder="admin">
                </div>

                <div class="form-group">
                    <label for="email">Admin Email Address</label>
                    <input type="email" id="email" name="email" required value="sanjaibabu1310@gmail.com">
                </div>

                <div class="form-group">
                    <label for="password">Create New Password (min. 8 chars)</label>
                    <input type="password" id="password" name="password" required minlength="8" placeholder="••••••••">
                </div>

                <div class="form-group">
                    <label for="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" required minlength="8" placeholder="••••••••">
                </div>

                <button type="submit" class="btn btn-primary btn-full">
                    <i class="fas fa-shield-alt"></i> Create Admin Account
                </button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
