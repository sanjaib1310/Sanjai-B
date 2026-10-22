import fs from 'fs';
import path from 'path';

// Professional avatar SVG for Sanjai B
const avatarSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#0066CC"/>
      <stop offset="100%" stop-color="#1E88E5"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="200" fill="url(#avatarBg)"/>
  <!-- Mathematician / Software Developer Silhouette & Monogram -->
  <circle cx="200" cy="140" r="65" fill="#E2E8F0"/>
  <path d="M90 350 C90 240, 310 240, 310 350 Z" fill="#E2E8F0"/>
  <!-- Elegant Initial Badge -->
  <circle cx="200" cy="140" r="50" fill="#0066CC"/>
  <text x="200" y="158" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="bold" fill="#FFFFFF">
    SB
  </text>
  <!-- Decorative border ring -->
  <circle cx="200" cy="200" r="190" fill="none" stroke="#60A5FA" stroke-width="4" stroke-dasharray="10 6" opacity="0.6"/>
</svg>`;

for (const p of ['./public/uploads', './php/uploads']) {
  fs.mkdirSync(p, { recursive: true });
  fs.writeFileSync(path.join(p, 'profile.jpg'), avatarSvg);
  fs.writeFileSync(path.join(p, 'profile.svg'), avatarSvg);
}

// Sample Resume file for download
const resumeContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 480 >> stream
BT
/F1 20 Tf 50 720 Td (SANJAI B - CURRICULUM VITAE) Tj
/F1 12 Tf 0 -30 Td (B.Sc. Mathematics with Computer Applications - Don Bosco College) Tj
/F1 10 Tf 0 -20 Td (Email: sanjaibabu1310@gmail.com | Phone: +91 97869 76122 | Yelagiri Hills, TN) Tj
/F1 12 Tf 0 -30 Td (ACADEMIC PROFILE & OBJECTIVE) Tj
/F1 10 Tf 0 -18 Td (Pursuing B.Sc. Mathematics with Computer Applications with high academic excellence.) Tj
/F1 10 Tf 0 -15 Td (Objective: Contributing to innovative software, IoT, and mathematical research.) Tj
/F1 12 Tf 0 -30 Td (TECHNICAL SKILLS) Tj
/F1 10 Tf 0 -18 Td (Languages: HTML5, CSS3, JavaScript, PHP 8, Python, Java, MySQL) Tj
/F1 10 Tf 0 -15 Td (IoT & Systems: Raspberry Pi, Raspberry Pi Pico, RFID, Sensors, C/C++) Tj
/F1 12 Tf 0 -30 Td (KEY PROJECTS) Tj
/F1 10 Tf 0 -18 Td (1. The Mathematics Behind Modern Artificial Intelligence - Final Year Project) Tj
/F1 10 Tf 0 -15 Td (2. Time Series Analysis and Forecasting of Gold & Silver Price in Tamil Nadu) Tj
/F1 10 Tf 0 -15 Td (3. Smart City Environmental Monitoring System using IoT (Karunadu Technologies)) Tj
/F1 10 Tf 0 -15 Td (4. Smart Library Monitoring System (Karunadu Technologies)) Tj
/F1 12 Tf 0 -30 Td (AWARDS & CERTIFICATES) Tj
/F1 10 Tf 0 -18 Td (21+ State, District, and University awards including 1st place in State PPT & Speech.) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000799 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
868
%%EOF`;

for (const p of ['./public/uploads', './php/uploads']) {
  fs.writeFileSync(path.join(p, 'resume.pdf'), resumeContent);
  fs.writeFileSync(path.join(p, 'Sanjai_B_Resume.pdf'), resumeContent);
}

console.log('Profile and resume files created successfully!');
