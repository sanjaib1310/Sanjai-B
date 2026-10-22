/**
 * Sanjai B - Personal Portfolio Website Script
 * Vanilla JavaScript (No frameworks)
 * Controls: Menu, Starry Sky, Light/Dark Theme, Certificate Filters, Lightbox Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // 2. Mobile Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.id !== 'themeToggle') {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // 3. Theme Toggle (Dark / Light) with LocalStorage
    if (themeToggle) {
        const savedTheme = localStorage.getItem('sanjai_theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('sanjai_theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // 4. Scroll to Top Button
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Starry Hero Sky Generator
    function generateStars() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;
        const starCount = 55;
        starsContainer.innerHTML = '';

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = (Math.random() * 0.6 + 0.3).toString();
            star.style.animation = `twinkle ${2.5 + Math.random() * 3}s ease-in-out infinite`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }

    // Twinkle Animation Style
    const twinkleStyle = document.createElement('style');
    twinkleStyle.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 0.95; transform: scale(1.3); }
        }
    `;
    document.head.appendChild(twinkleStyle);
    generateStars();

    // 6. Smooth Scrolling for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 7. Certificate & Achievement Filters & Search
    initCertificateControls();
});

// ================= Certificate Filtering Logic =================
let currentFilter = 'all';
let currentSearch = '';
let currentYear = 'all';

function initCertificateControls() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('certSearch');
    const yearSelect = document.getElementById('certYearFilter');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                applyCertFilters();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.toLowerCase().trim();
            applyCertFilters();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', function(e) {
            currentYear = e.target.value;
            applyCertFilters();
        });
    }
}

function applyCertFilters() {
    const cards = document.querySelectorAll('.cert-item-card');
    const noCerts = document.getElementById('noCertsFound');
    let visibleCount = 0;

    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const year = card.getAttribute('data-year');
        const title = card.getAttribute('data-title') || '';
        const org = card.getAttribute('data-org') || '';
        const remarks = card.getAttribute('data-remarks') || '';

        // Category Match
        let matchCat = (currentFilter === 'all') || (cat === currentFilter);
        
        // Year Match
        let matchYear = (currentYear === 'all') || (year === currentYear);

        // Search Match
        let matchSearch = !currentSearch || 
            title.includes(currentSearch) || 
            org.includes(currentSearch) || 
            remarks.includes(currentSearch);

        if (matchCat && matchYear && matchSearch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noCerts) {
        noCerts.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function resetCertFilters() {
    currentFilter = 'all';
    currentSearch = '';
    currentYear = 'all';

    const searchInput = document.getElementById('certSearch');
    if (searchInput) searchInput.value = '';

    const yearSelect = document.getElementById('certYearFilter');
    if (yearSelect) yearSelect.value = 'all';

    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') btn.classList.add('active');
        else btn.classList.remove('active');
    });

    applyCertFilters();
}

// ================= Certificate Lightbox Modal =================
let activeCertIndex = 0;
let activeCertList = [];

function openLightbox(type, index) {
    const modal = document.getElementById('certLightbox');
    if (!modal) return;

    // Collect currently visible cards in the DOM to navigate through
    const visibleCards = Array.from(document.querySelectorAll('.cert-item-card'))
        .filter(c => c.style.display !== 'none');

    activeCertList = visibleCards.map(c => {
        const cType = c.getAttribute('data-type');
        const idx = parseInt(c.getAttribute('data-index'), 10);
        return { cType, idx, element: c };
    });

    // Find position in visible cards
    let targetPos = activeCertList.findIndex(item => item.cType === type && (
        type === 'cert' ? item.idx === index : item.idx === (index + (window.CERTIFICATES_DATA ? window.CERTIFICATES_DATA.length : 0))
    ));

    if (targetPos === -1) targetPos = 0;
    activeCertIndex = targetPos;

    renderLightboxContent();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function renderLightboxContent() {
    if (!activeCertList.length) return;
    const current = activeCertList[activeCertIndex];
    if (!current) return;

    const imgEl = document.getElementById('lightboxImg');
    const badgeEl = document.getElementById('lbBadge');
    const titleEl = document.getElementById('lbTitle');
    const orgEl = document.getElementById('lbOrg');
    const dateEl = document.getElementById('lbDate');
    const rankItem = document.getElementById('lbRankItem');
    const rankEl = document.getElementById('lbRank');
    const awardItem = document.getElementById('lbAwardItem');
    const awardEl = document.getElementById('lbAward');
    const locItem = document.getElementById('lbLocItem');
    const locEl = document.getElementById('lbLoc');
    const remarksItem = document.getElementById('lbRemarksItem');
    const remarksEl = document.getElementById('lbRemarks');
    const downloadBtn = document.getElementById('lbDownloadBtn');

    // Retrieve data object from global datasets
    let data;
    if (current.cType === 'cert' && window.CERTIFICATES_DATA) {
        data = window.CERTIFICATES_DATA[current.idx];
    } else if (current.cType === 'camp' && window.CAMP_DATA) {
        const campIdx = current.idx - (window.CERTIFICATES_DATA ? window.CERTIFICATES_DATA.length : 0);
        data = window.CAMP_DATA[campIdx] || window.CAMP_DATA[0];
    }

    if (!data) return;

    const isCamp = (current.cType === 'camp');
    const fullImg = data.image_path || '/uploads/certificates/cert-placeholder.jpg';

    if (imgEl) {
        imgEl.src = fullImg;
        imgEl.alt = data.name + ' Certificate';
    }

    if (badgeEl) {
        if (isCamp) {
            badgeEl.className = 'lightbox-badge level-camp';
            badgeEl.textContent = (data.camp_level || 'State') + ' Level Camp';
        } else {
            const level = data.competition_level || data.workshop_level || data.other_category || 'Recognized';
            badgeEl.className = 'lightbox-badge level-' + level.toLowerCase().replace(/\s+/g, '-');
            badgeEl.textContent = level + ' Level Event';
        }
    }

    if (titleEl) titleEl.textContent = data.name;
    if (orgEl) orgEl.textContent = data.organization;
    if (dateEl) dateEl.textContent = data.date_text || data.date_range_text || 'Documented';

    if (rankItem && rankEl) {
        if (data.place_rank) {
            rankItem.style.display = 'flex';
            rankEl.textContent = data.place_rank === '1' ? '🥇 1st Place (Winner)' : (data.place_rank === '2' ? '🥈 2nd Place (Runner-up)' : '🥉 3rd Place');
        } else {
            rankItem.style.display = isCamp ? 'flex' : 'none';
            if (isCamp) rankEl.textContent = '⛺ Camp Participation & Leadership';
        }
    }

    if (awardItem && awardEl) {
        if (data.cash_award && parseFloat(data.cash_award) > 0) {
            awardItem.style.display = 'flex';
            awardEl.textContent = '₹' + Number(data.cash_award).toLocaleString();
        } else {
            awardItem.style.display = 'none';
        }
    }

    if (locItem && locEl) {
        if (data.location) {
            locItem.style.display = 'flex';
            locEl.textContent = data.location;
        } else {
            locItem.style.display = 'none';
        }
    }

    if (remarksItem && remarksEl) {
        const text = data.remarks || data.other_note || (data.certificate_no ? 'Certificate No: ' + data.certificate_no : '');
        if (text) {
            remarksItem.style.display = 'block';
            remarksEl.textContent = text;
        } else {
            remarksItem.style.display = 'none';
        }
    }

    if (downloadBtn) {
        downloadBtn.href = fullImg;
        downloadBtn.setAttribute('download', `${data.name.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.jpg`);
    }
}

function navLightbox(direction) {
    if (!activeCertList.length) return;
    activeCertIndex = (activeCertIndex + direction + activeCertList.length) % activeCertList.length;
    renderLightboxContent();
}

function closeLightbox() {
    const modal = document.getElementById('certLightbox');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Keyboard navigation for Lightbox
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('certLightbox');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navLightbox(-1);
        if (e.key === 'ArrowRight') navLightbox(1);
    }
});
