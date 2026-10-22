import fs from 'fs';
import path from 'path';

const certificates = [
  { sno: 1, name: "Painting Competition", org: "TN Govt", level: "School Level", date: "July 2016", place: "1", cash: "", remarks: "" },
  { sno: 2, name: "Speech Competition", org: "TN Govt", level: "District", date: "30/07/2023", place: "3", cash: "2000", remarks: "" },
  { sno: 3, name: "Speech Competition", org: "TN Govt", level: "District", date: "02/08/2023", place: "3", cash: "2000", remarks: "" },
  { sno: 4, name: "Speech Competition", org: "Vailankanni School Education", level: "District", date: "02/10/2023", place: "1", cash: "5000", remarks: "" },
  { sno: 5, name: "Speech Competition", org: "TN Govt", level: "District", date: "2022 – 2023", place: "1", cash: "", remarks: "" },
  { sno: 6, name: "Thirukkural Competition", org: "TN Govt", level: "District", date: "2023 – 2023", place: "1", cash: "", remarks: "" },
  { sno: 7, name: "NAAC Preparation", org: "Don Bosco College", level: "College", date: "30/08/2024", place: "", cash: "", remarks: "" },
  { sno: 8, name: "Workshop", org: "TN Tamil Department", level: "District", date: "13/12/2024", place: "", cash: "", remarks: "" },
  { sno: 9, name: "Skit", org: "Don Bosco College (Extravaganza 25)", level: "College", date: "10/01/2025", place: "2", cash: "", remarks: "" },
  { sno: 10, name: "Speech Competition", org: "Don Bosco College (Extravaganza 25)", level: "College", date: "10/01/2025", place: "3", cash: "", remarks: "" },
  { sno: 11, name: "Tamil Debate", org: "Don Bosco College Tamil Dept", level: "College", date: "12/01/2025", place: "", cash: "", remarks: "" },
  { sno: 12, name: "Speech Competition", org: "Thiruvalluvar University", level: "University", date: "04/03/2025", place: "", cash: "", remarks: "" },
  { sno: 13, name: "Workshop", org: "TN Tamil Department", level: "District", date: "29/07/2025", place: "", cash: "", remarks: "" },
  { sno: 14, name: "YASSC", org: "TASS", level: "State", date: "17/08/2025", place: "", cash: "", remarks: "" },
  { sno: 15, name: "PPT", org: "Gonzaga College", level: "State", date: "07/10/2025", place: "2", cash: "", remarks: "" },
  { sno: 16, name: "Viksit Bharat", org: "NSS", level: "District", date: "22/12/2025", place: "2", cash: "", remarks: "Selected from State Level" },
  { sno: 17, name: "PPT", org: "Auxilium College", level: "State", date: "29/01/2026", place: "1", cash: "5000", remarks: "" },
  { sno: 18, name: "Workshop", org: "Sacred Heart College", level: "National Level", date: "20/08/2026", place: "", cash: "", remarks: "" },
  { sno: 19, name: "YASSC", org: "TASS", level: "State", date: "29/08/2026", place: "1", cash: "", remarks: "Selected from State Level" },
  { sno: 20, name: "Conference", org: "Gonzaga College", level: "State", date: "11/09/2026", place: "", cash: "", remarks: "" },
  { sno: 21, name: "Conference", org: "Don Bosco College (BBA Department)", level: "College Level", date: "12/09/2026", place: "", cash: "", remarks: "" }
];

const campCertificates = [
  { sno: 1, name: "NSS 7-Day Special Annual Camp", org: "National Service Scheme (NSS), Don Bosco College", level: "District", date: "10/02/2025 – 16/02/2025", location: "Yelagiri Hills, Tirupattur", certNo: "NSS/DBC/2025/042", note: "Youth for Clean and Green Village" },
  { sno: 2, name: "State Level Youth Leadership & Adventure Camp", org: "Tamil Nadu State Youth Service / TASS", level: "State", date: "15/05/2025 – 20/05/2025", location: "Ooty, Nilgiris", certNo: "YLC/TN/2025/118", note: "Personality Development, Community Living & Leadership" },
  { sno: 3, name: "Space Science & Sky Observation Camp", org: "Tamil Nadu Astronomy & Science Society (TASS)", level: "State", date: "05/01/2026 – 08/01/2026", location: "Vainu Bappu Observatory, Kavalur", certNo: "TASS/SOC/2026/033", note: "Celestial Mechanics & Night Sky Observation" }
];

function generateCertSvg(cert, isCamp = false) {
  const rankText = cert.place === '1' ? 'FIRST PLACE (WINNER)' : cert.place === '2' ? 'SECOND PLACE (RUNNER-UP)' : cert.place === '3' ? 'THIRD PLACE' : isCamp ? 'PARTICIPATION & COMPLETION' : 'CERTIFICATE OF MERIT & APPRECIATION';
  const badgeColor = cert.place === '1' ? '#D97706' : cert.place === '2' ? '#6B7280' : cert.place === '3' ? '#B45309' : '#0284C7';
  const rankSeal = cert.place ? (cert.place === '1' ? '🥇 1st' : cert.place === '2' ? '🥈 2nd' : '🥉 3rd') : (isCamp ? '⛺ Camp' : '🎖️ Merit');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="560" viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFDFD"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F3E5AB"/>
      <stop offset="100%" stop-color="#AA771C"/>
    </linearGradient>
    <linearGradient id="sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="560" fill="url(#bgGrad)"/>

  <!-- Ornate Border -->
  <rect x="20" y="20" width="760" height="520" rx="8" fill="none" stroke="url(#borderGrad)" stroke-width="10"/>
  <rect x="35" y="35" width="730" height="490" rx="4" fill="none" stroke="#0066CC" stroke-width="2" stroke-dasharray="8 4"/>

  <!-- Corner Ornaments -->
  <circle cx="45" cy="45" r="12" fill="#D4AF37" opacity="0.6"/>
  <circle cx="755" cy="45" r="12" fill="#D4AF37" opacity="0.6"/>
  <circle cx="45" cy="515" r="12" fill="#D4AF37" opacity="0.6"/>
  <circle cx="755" cy="515" r="12" fill="#D4AF37" opacity="0.6"/>

  <!-- Header / Organization -->
  <text x="400" y="85" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="bold" fill="#0F172A" letter-spacing="1">
    ${cert.org.toUpperCase()}
  </text>
  <text x="400" y="112" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="13" font-weight="500" fill="#64748B" letter-spacing="2">
    ${(cert.level || 'RECOGNIZED').toUpperCase()} LEVEL • EVENT RECORD
  </text>

  <!-- Certificate Title -->
  <text x="400" y="165" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="32" font-weight="bold" fill="#0066CC">
    CERTIFICATE OF ACHIEVEMENT
  </text>
  <line x1="280" y1="180" x2="520" y2="180" stroke="#D4AF37" stroke-width="2"/>

  <!-- Presentation text -->
  <text x="400" y="215" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="14" fill="#475569">
    THIS IS PROUDLY PRESENTED TO
  </text>

  <!-- Recipient Name -->
  <text x="400" y="265" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold" fill="#0F172A">
    SANJAI B
  </text>
  <line x1="240" y1="280" x2="560" y2="280" stroke="#0066CC" stroke-width="1.5"/>

  <!-- Description Body -->
  <text x="400" y="318" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="15" fill="#334155">
    for distinguished participation and excellence in <tspan font-weight="bold" fill="#0066CC">${cert.name}</tspan>
  </text>
  ${cert.remarks ? `<text x="400" y="342" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="13" font-style="italic" fill="#059669">${cert.remarks}</text>` : ''}
  ${isCamp && cert.note ? `<text x="400" y="342" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="13" font-style="italic" fill="#0284C7">${cert.note}</text>` : ''}

  <!-- Rank Banner -->
  <rect x="250" y="365" width="300" height="34" rx="17" fill="${badgeColor}" opacity="0.95"/>
  <text x="400" y="388" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
    ${rankText}
  </text>

  <!-- Award / Cert No if any -->
  ${cert.cash ? `
  <rect x="330" y="408" width="140" height="26" rx="13" fill="#ECFDF5" stroke="#10B981" stroke-width="1"/>
  <text x="400" y="425" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="12" font-weight="600" fill="#047857">
    💰 Cash Award: ₹${cert.cash}
  </text>` : ''}

  ${cert.certNo ? `
  <text x="400" y="425" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="12" font-weight="500" fill="#64748B">
    Certificate No: ${cert.certNo}
  </text>` : ''}

  <!-- Footer Details -->
  <!-- Left: Date & Location -->
  <text x="120" y="475" font-family="'Poppins', sans-serif" font-size="12" font-weight="600" fill="#0F172A">
    Date: ${cert.date}
  </text>
  ${cert.location ? `<text x="120" y="495" font-family="'Poppins', sans-serif" font-size="11" fill="#64748B">Venue: ${cert.location}</text>` : `<text x="120" y="495" font-family="'Poppins', sans-serif" font-size="11" fill="#64748B">Ref ID: CERT-${cert.sno.toString().padStart(3, '0')}</text>`}
  <line x1="120" y1="460" x2="240" y2="460" stroke="#CBD5E1" stroke-width="1.5"/>

  <!-- Right: Verification Seal -->
  <g transform="translate(640, 460)">
    <circle cx="0" cy="0" r="36" fill="url(#sealGrad)"/>
    <circle cx="0" cy="0" r="31" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 2"/>
    <text x="0" y="5" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">
      ${rankSeal}
    </text>
  </g>
  <text x="640" y="515" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="10" font-weight="600" fill="#64748B">
    VERIFIED RECORD
  </text>
</svg>`;
}

const outDirs = [
  path.resolve('./public/uploads/certificates'),
  path.resolve('./public/uploads/certificates/thumbs'),
  path.resolve('./php/uploads/certificates'),
  path.resolve('./php/uploads/certificates/thumbs')
];

for (const d of outDirs) {
  fs.mkdirSync(d, { recursive: true });
}

// Generate cert-1.jpg ... cert-21.jpg
for (const cert of certificates) {
  const svg = generateCertSvg(cert, false);
  for (const base of ['./public/uploads/certificates', './php/uploads/certificates']) {
    fs.writeFileSync(path.join(base, `cert-${cert.sno}.jpg`), svg);
    fs.writeFileSync(path.join(base, `cert-${cert.sno}.svg`), svg);
    fs.writeFileSync(path.join(base, 'thumbs', `cert-${cert.sno}.jpg`), svg);
    fs.writeFileSync(path.join(base, 'thumbs', `cert-${cert.sno}.svg`), svg);
  }
}

// Generate camp-1.jpg ... camp-3.jpg
for (const camp of campCertificates) {
  const svg = generateCertSvg(camp, true);
  for (const base of ['./public/uploads/certificates', './php/uploads/certificates']) {
    fs.writeFileSync(path.join(base, `camp-${camp.sno}.jpg`), svg);
    fs.writeFileSync(path.join(base, `camp-${camp.sno}.svg`), svg);
    fs.writeFileSync(path.join(base, 'thumbs', `camp-${camp.sno}.jpg`), svg);
    fs.writeFileSync(path.join(base, 'thumbs', `camp-${camp.sno}.svg`), svg);
  }
}

console.log('Successfully generated all certificate images and thumbnails!');
