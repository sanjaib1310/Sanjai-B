# Verification & Testing Checklist

Use this checklist to test every feature of the portfolio website on localhost or production.

---

### 1. Public Portfolio Display & Styling
- [ ] **Home / Hero Section**:
  - [ ] Starry animated background twinkles smoothly.
  - [ ] Name ("Sanjai B"), subtitle ("Aspiring Software Developer..."), and bio are loaded from the database.
  - [ ] Profile photo avatar loads without broken images.
  - [ ] "About Me", "View Projects", and "Contact Me" buttons scroll smoothly to their respective sections.
  - [ ] "Download Resume" button downloads the latest uploaded `Sanjai_B_Resume.pdf`.
- [ ] **Theme Toggle**:
  - [ ] Clicking the Moon/Sun icon toggles between Light and Dark themes.
  - [ ] Preference persists across page refreshes via `localStorage`.
- [ ] **Responsive Navigation**:
  - [ ] Desktop navbar sticks to the top with blurred background effect.
  - [ ] Mobile hamburger menu toggles menu links and closes on link click.

---

### 2. Database-Driven Content Verification
- [ ] **About Section**:
  - [ ] Displays degree (*B.Sc. Mathematics with Computer Applications*), institution (*Don Bosco College, Yelagiri*), status (*Currently Pursuing*), and career objective from the `profile` table.
- [ ] **Skills Section**:
  - [ ] Displays 8 Technical skills (HTML5, CSS3, JS, PHP, Java, Python, MySQL, MS Office).
  - [ ] Displays 5 Academic skills (Mathematics, Statistics, Data Analysis, Logical Reasoning, Problem Solving).
  - [ ] Displays 5 Soft skills (Communication, Teamwork, Leadership, Time Management, Adaptability).
  - [ ] Animated progress bars reflect database percentage values.
- [ ] **Projects Section**:
  - [ ] Includes capstone: *"The Mathematics Behind Modern Artificial Intelligence"*.
  - [ ] Includes: *"Time Series Analysis and Forecasting of Gold & Silver Price in Tamil Nadu"*.
  - [ ] Includes: *"Cosmic Close Calls"* (Book in Progress).
  - [ ] Includes sample projects (*Attendance Management System*, *Department Website*, *Personal Portfolio*, *Celestial Mechanics*).
- [ ] **Research Section**:
  - [ ] Displays all 4 astronomy and celestial mechanics research activities in the timeline.
- [ ] **Educational Journey**:
  - [ ] Displays B.Sc. (active/current badge), HSC (completed badge), and SSLC (completed badge).
- [ ] **Experience / Internship**:
  - [ ] Displays Karunadu Technologies Pvt. Ltd., Bengaluru (June 2026).
  - [ ] Mini project: *Smart Library Monitoring System (RFID, Raspberry Pi Pico, LCD, buzzer)*.
  - [ ] Main project: *Smart City Environmental Monitoring System using IoT*.

---

### 3. Certificates & Achievements Gallery
- [ ] **Dynamic Summary Strip**:
  - [ ] Total verified records count is calculated from database rows (24 total).
  - [ ] Total 1st places won is calculated dynamically (7 first-place wins).
  - [ ] Total cash awards amount is calculated dynamically (₹12,000).
- [ ] **Card Badges & Information**:
  - [ ] Level badges render correctly (*District, State, National, College, University*).
  - [ ] Rank badges render with emojis (*🥇 1st Place, 🥈 2nd Place, 🥉 3rd Place*).
  - [ ] Cash awards display with rupee formatting (e.g., *₹5,000*, *₹2,000*).
  - [ ] Remarks (e.g., *"Selected from State Level"*) appear clearly.
  - [ ] Correct spellings verified (*District, Thirukkural, Debate, Conference, Selected, Certificate No*).
- [ ] **Interactive Lightbox Modal**:
  - [ ] Clicking any certificate card opens the high-resolution lightbox modal.
  - [ ] Displays full certificate photo, event title, organizer, date, rank, cash award, and remarks.
  - [ ] Previous and Next arrows cycle through certificates.
  - [ ] Keyboard arrows (`←`, `→`) and `Escape` key navigate and close the modal.
  - [ ] "View / Download High-Res" button initiates direct file download.
- [ ] **Filter & Search Controls**:
  - [ ] Clicking "Competitions" displays only competition certificates.
  - [ ] Clicking "Workshops" displays only workshop certificates.
  - [ ] Clicking "Camps" displays the 3 camp records.
  - [ ] Real-time search filters instantly as you type (e.g., typing *"Speech"* or *"Gonzaga"*).
  - [ ] Year dropdown filters certificates by 2026, 2025, 2024, 2023, 2016.
  - [ ] "No certificates match your search" card appears when query has zero results.

---

### 4. Contact Form & Anti-Spam
- [ ] **Form Validation**:
  - [ ] Submitting empty fields triggers HTML5 / server-side validation error.
  - [ ] Submitting invalid email displays validation error.
- [ ] **Database Insertion**:
  - [ ] Valid submission stores message in `messages` table with sender IP and user agent.
  - [ ] Confirmation success banner appears.
- [ ] **Honeypot Protection**:
  - [ ] Automated bot filling the invisible `website_url_hp` field is silently dropped.

---

### 5. Admin Panel (`/admin`)
- [ ] **Authentication & Security**:
  - [ ] Accessing `/admin/` without login redirects to `login.php`.
  - [ ] Password verification uses `password_verify()` with bcrypt hash.
  - [ ] 5 consecutive invalid login attempts triggers temporary 15-minute account lockout.
  - [ ] CSRF tokens validated on all form submissions.
  - [ ] "Logout" terminates session and destroys cookies.
- [ ] **Profile & Resume Management**:
  - [ ] Updating bio, titles, phone, email, or social links updates the database and public site immediately.
  - [ ] Uploading a new profile photo (JPG, PNG, WEBP) updates preview and public avatar.
  - [ ] Uploading a new PDF resume replaces `Sanjai_B_Resume.pdf` and serves via "Download Resume".
- [ ] **Certificates & Camp Management**:
  - [ ] Adding a new certificate creates a database row and appears in public gallery.
  - [ ] Deleting a certificate removes it from the database and updates summary counters.
- [ ] **Project, Experience & Skills CRUD**:
  - [ ] Edit or add projects, skills, and experience directly in dashboard.
- [ ] **Contact Form Inbox**:
  - [ ] Submissions appear in the Inbox tab with sender details, subject, and timestamp.
  - [ ] Toggling status changes between "New" and "Read".
  - [ ] Delete button removes message from the database.
- [ ] **Export to CSV / Excel**:
  - [ ] Clicking "Export Certificates CSV" downloads a `.csv` file with UTF-8 BOM containing all 21 certificates and 3 camp records.
