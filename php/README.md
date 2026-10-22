# Sanjai B - Personal Portfolio Website (PHP 8 + MySQL)

A complete, database-driven personal portfolio website built with modern PHP 8 (PDO), MySQL, HTML5, CSS3, and vanilla JavaScript. Features dynamic content rendering, an interactive Certificates & Achievements gallery with lightbox modal, filter controls, search, dynamic summary statistics, contact message inbox, and a secure Admin Panel.

---

## 🌟 Key Features

1. **100% Database-Driven**:
   - Zero hardcoded content in HTML; all sections (Profile, Education, Skills, Projects, Research, Experience, Certificates, Camp Certificates, Achievements, Messages) are rendered dynamically from MySQL via PDO prepared statements.
2. **Certificates & Achievements Section**:
   - All 21 awards from Sheet 1 + 3 field camp records from Sheet 2.
   - Live summary strip: Total verified records, 1st places won, total cash award amount.
   - Category filtering (*All, Competitions, Workshops, Camps, Other*).
   - Real-time search box & year filter dropdown.
   - Interactive Lightbox with high-resolution certificate photos, badges, remarks, and keyboard arrow navigation.
3. **Internship & Experience**:
   - 1-month Embedded Systems & IoT internship at Karunadu Technologies Pvt. Ltd., Bengaluru.
   - Highlights: Smart Library Monitoring System & Smart City Environmental Monitoring System.
4. **Academic Research & Projects**:
   - Final year capstone: *"The Mathematics Behind Modern Artificial Intelligence"*.
   - Statistical modeling: *"Time Series Analysis and Forecasting of Gold & Silver Price in Tamil Nadu"*.
   - Astronomy book in progress: *"Cosmic Close Calls"*.
5. **Secure Admin CMS (`/admin`)**:
   - Secure authentication with `password_hash()` and `password_verify()`.
   - Brute-force rate limiting (temporary lockout after 5 failed attempts).
   - CSRF token validation on all POST actions.
   - Full CRUD forms for certificates, camps, projects, experience, skills, profile, and education.
   - Drag-and-drop / up-down order adjustments.
   - Photo upload with MIME verification (`image/jpeg`, `image/png`, `image/webp`), size limiting (5MB), and auto-thumbnailing.
   - Resume PDF upload that immediately updates the public "Download Resume" link.
   - Messages inbox for incoming contact form inquiries (read/unread toggling, deletion).
   - One-click export of certificates to Microsoft Excel / CSV format.
6. **Robust Contact Form**:
   - Input validation, anti-spam honeypot protection, and PDO storage in `messages` table.

---

## 📁 Project Directory Structure

```text
sanjai-portfolio/
│
├── config.php                  # Database connection (PDO), sessions, CSRF & env helper
├── schema.sql                  # MySQL database structure (11 tables with utf8mb4)
├── seed.sql                    # Initial seed data (profile, projects, skills, certificates)
├── import_excel.php            # Automated import script for Excel data (clean NULL handling)
├── index.php                   # Public dynamic website rendered from MySQL
├── styles.css                  # Public website styling (Poppins, Playfair, dark/light theme)
├── script.js                   # Vanilla JS (mobile menu, theme toggle, lightbox, filters)
├── .env.example                # Sample environment configuration
├── README.md                   # Complete installation & setup documentation
├── TEST_CHECKLIST.md           # Verification checklist for all public & admin features
│
├── admin/                      # Secure Administration Panel
│   ├── index.php               # Admin dashboard with tabs & full CRUD management
│   ├── login.php               # Secure login with CSRF & rate limiting
│   ├── logout.php              # Session destruction script
│   ├── setup.php               # Initial admin account setup script
│   ├── export_certificates.php # Export certificates to CSV / Excel
│   ├── upload.php              # Secure file & photo uploader
│   ├── admin.css               # Admin CMS styling
│   └── admin.js                # Admin interactive behaviors & instant previews
│
└── uploads/                    # Uploaded media assets
    ├── profile.jpg             # Public profile picture
    ├── Sanjai_B_Resume.pdf     # Resume PDF document
    └── certificates/           # Full-resolution certificate photos (cert-1 to cert-21, camp-1 to camp-3)
        └── thumbs/             # Small thumbnails for fast lazy-loading
```

---

## 🚀 Setup Instructions for XAMPP (Localhost)

### Step 1: Place Files in XAMPP
1. Download or clone this project folder.
2. Copy the entire folder into your XAMPP web root:
   - **Windows**: `C:\xampp\htdocs\sanjai-portfolio`
   - **macOS**: `/Applications/XAMPP/xamppfiles/htdocs/sanjai-portfolio`
   - **Linux**: `/opt/lampp/htdocs/sanjai-portfolio`

### Step 2: Start Apache and MySQL
1. Open the **XAMPP Control Panel**.
2. Start both the **Apache** and **MySQL** modules.

### Step 3: Create Database & Import Schema
1. Open your browser and navigate to `http://localhost/phpmyadmin/`.
2. Click **New** on the left sidebar to create a database named `sanjai_portfolio` (Collation: `utf8mb4_unicode_ci`).
3. Click the **Import** tab:
   - Choose `schema.sql` from your project folder and click **Import**.
   - Next, choose `seed.sql` and click **Import** to populate all default content, projects, and certificates.
*(Alternatively, execute the SQL files directly using the MySQL CLI: `mysql -u root sanjai_portfolio < schema.sql`)*

### Step 4: Configure Database Settings
1. In the project root, open `config.php` (or copy `.env.example` to `.env`).
2. By default, XAMPP credentials work out of the box:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'sanjai_portfolio');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Default XAMPP has no password
   ```

### Step 5: (Optional) Run the Excel Importer
If you ever want to re-sync or re-import the Excel sheet data with clean NULL handling:
- In your browser, open `http://localhost/sanjai-portfolio/import_excel.php?token=import_secret_seed`, OR
- Run via terminal:
  ```bash
  cd C:\xampp\htdocs\sanjai-portfolio
  php import_excel.php
  ```

### Step 6: Access the Website & Admin Panel
- **Public Portfolio**: Open `http://localhost/sanjai-portfolio/` in your browser.
- **Admin Panel**: Navigate to `http://localhost/sanjai-portfolio/admin/login.php`.
  - Default Username: `admin`
  - Default Password: `Admin@123`
  - *(To change credentials or setup a new administrator, visit `http://localhost/sanjai-portfolio/admin/setup.php`)*

---

## 🌐 Setup Instructions for Shared Hosting (cPanel / Apache)

### Step 1: Upload Files
1. Log in to your hosting **cPanel**.
2. Open **File Manager** and navigate to your public directory (usually `public_html` or a subdomain folder like `public_html/portfolio`).
3. Upload all files from this project. Ensure write permissions (`755` or `775`) on the `uploads/` folder so photos and PDFs can be uploaded.

### Step 2: Create MySQL Database & User in cPanel
1. In cPanel, click **MySQL® Databases**.
2. Create a new database (e.g., `username_portfolio`).
3. Create a new MySQL user with a strong password (e.g., `username_sanjai`).
4. Add the user to the database and grant **ALL PRIVILEGES**.

### Step 3: Import SQL Schema & Data
1. In cPanel, open **phpMyAdmin**.
2. Select your newly created database.
3. Click **Import**, select `schema.sql`, and execute.
4. Click **Import**, select `seed.sql`, and execute.

### Step 4: Update Database Credentials
Edit `config.php` in the File Manager (or create `.env`):
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'username_portfolio');
define('DB_USER', 'username_sanjai');
define('DB_PASS', 'YourStrongPasswordHere');
```

### Step 5: Verify & Secure
1. Visit your domain: `https://yourdomain.com/`.
2. Log into the admin portal: `https://yourdomain.com/admin/login.php`.
3. Change the admin password immediately via the Admin Panel or `admin/setup.php`.

---

## 🔒 Security Best Practices Implemented

- **Prepared Statements**: Every single database interaction uses PDO parameter binding to prevent SQL injection.
- **Output Escaping**: All dynamic outputs are sanitized with `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')`.
- **CSRF Tokens**: Form submissions require a valid cryptographically random token stored in the session.
- **Anti-Spam Honeypot**: The contact form features an invisible trap field (`website_url_hp`) that immediately discards automated bot spam without disturbing human visitors.
- **Login Rate Limiting**: Automatic account lockout after 5 consecutive failed login attempts.
- **MIME Type Checking**: Uploaded images are checked on the server side using PHP's `finfo` extension to prevent script injection.
- **Cookie Flags**: Cookies enforce `HttpOnly`, `SameSite=Lax`, and `Secure` over HTTPS.
