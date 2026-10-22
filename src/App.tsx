import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_RESEARCH,
  INITIAL_EDUCATION,
  INITIAL_EXPERIENCE,
  INITIAL_CERTIFICATES,
  INITIAL_CAMPS,
  INITIAL_ACHIEVEMENTS,
  Certificate,
  CampCertificate,
  Project,
  Skill,
  ExperienceItem,
  ContactMessage,
  Profile
} from './data/initialData';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sanjai_theme') === 'dark';
  });

  // Mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Admin View State
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminTab, setAdminTab] = useState<'certificates' | 'camps' | 'profile' | 'projects' | 'experience' | 'skills' | 'messages'>('certificates');

  // Database Data States
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('sanjai_db_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('sanjai_db_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('sanjai_db_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [experience, setExperience] = useState<ExperienceItem[]>(() => {
    const saved = localStorage.getItem('sanjai_db_experience');
    return saved ? JSON.parse(saved) : INITIAL_EXPERIENCE;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('sanjai_db_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [camps, setCamps] = useState<CampCertificate[]>(() => {
    const saved = localStorage.getItem('sanjai_db_camps');
    return saved ? JSON.parse(saved) : INITIAL_CAMPS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('sanjai_db_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Dr. K. Annamalai',
        email: 'annamalai.edu@gmail.com',
        subject: 'Commendation on Astronomy Modeling Presentation',
        message: 'Dear Sanjai, Outstanding presentation on Celestial Mechanics algorithms at the congress! We would like to invite you for a guest student talk next month.',
        is_read: false,
        created_at: '2026-10-15 14:22'
      }
    ];
  });

  // Persist edits to localStorage for live demo simulation
  useEffect(() => {
    localStorage.setItem('sanjai_db_profile', JSON.stringify(profile));
    localStorage.setItem('sanjai_db_skills', JSON.stringify(skills));
    localStorage.setItem('sanjai_db_projects', JSON.stringify(projects));
    localStorage.setItem('sanjai_db_experience', JSON.stringify(experience));
    localStorage.setItem('sanjai_db_certificates', JSON.stringify(certificates));
    localStorage.setItem('sanjai_db_camps', JSON.stringify(camps));
    localStorage.setItem('sanjai_db_messages', JSON.stringify(messages));
  }, [profile, skills, projects, experience, certificates, camps, messages]);

  // Dark Mode side-effects
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('sanjai_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('sanjai_theme', 'light');
    }
  }, [isDarkMode]);

  // Certificate filtering & search
  const [certFilter, setCertFilter] = useState<'all' | 'competition' | 'workshop' | 'camp' | 'other'>('all');
  const [certSearch, setCertSearch] = useState('');
  const [certYear, setCertYear] = useState('all');

  // Lightbox Modal state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = useState<Array<{ type: 'cert' | 'camp'; data: Certificate | CampCertificate }>>([]);

  // Contact form submission state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '', hp: '' });
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // New certificate form state in Admin
  const [newCert, setNewCert] = useState({
    sno: certificates.length + 1,
    name: '',
    organization: '',
    competition_level: '',
    workshop_level: '',
    date_text: '',
    place_rank: '',
    cash_award: '',
    remarks: ''
  });

  // Summary statistics calculations
  const stats = useMemo(() => {
    const totalRecords = certificates.length + camps.length;
    let firstPlaces = 0;
    let totalCash = 0;

    certificates.forEach(c => {
      if (c.place_rank === '1') firstPlaces++;
      if (c.cash_award) totalCash += Number(c.cash_award);
    });

    camps.forEach(c => {
      if (c.cash_award) totalCash += Number(c.cash_award);
    });

    return { totalRecords, firstPlaces, totalCash };
  }, [certificates, camps]);

  // Combined certificates & camps filtered view
  const filteredItems = useMemo(() => {
    const items: Array<{ type: 'cert' | 'camp'; data: Certificate | CampCertificate }> = [];

    // Filter regular certificates
    if (certFilter !== 'camp') {
      certificates.forEach(c => {
        let cat: 'competition' | 'workshop' | 'other' = 'other';
        if (c.competition_level) cat = 'competition';
        else if (c.workshop_level) cat = 'workshop';

        if (certFilter !== 'all' && certFilter !== cat) return;

        // Year check
        let year = 'other';
        const ym = c.date_text.match(/\b(20\d\d)\b/);
        if (ym) year = ym[1];
        if (certYear !== 'all' && year !== certYear) return;

        // Search check
        if (certSearch) {
          const q = certSearch.toLowerCase();
          const match = c.name.toLowerCase().includes(q) ||
                        c.organization.toLowerCase().includes(q) ||
                        (c.remarks && c.remarks.toLowerCase().includes(q));
          if (!match) return;
        }

        items.push({ type: 'cert', data: c });
      });
    }

    // Filter camp certificates
    if (certFilter === 'all' || certFilter === 'camp') {
      camps.forEach(c => {
        let year = 'other';
        const ym = c.date_range_text.match(/\b(20\d\d)\b/);
        if (ym) year = ym[1];
        if (certYear !== 'all' && year !== certYear) return;

        if (certSearch) {
          const q = certSearch.toLowerCase();
          const match = c.name.toLowerCase().includes(q) ||
                        c.organization.toLowerCase().includes(q) ||
                        (c.other_note && c.other_note.toLowerCase().includes(q));
          if (!match) return;
        }

        items.push({ type: 'camp', data: c });
      });
    }

    return items;
  }, [certificates, camps, certFilter, certYear, certSearch]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxItems(filteredItems);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const nextLightbox = () => {
    if (lightboxIndex === null || lightboxItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % lightboxItems.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null || lightboxItems.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, lightboxItems]);

  // Handle Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(null);
    setContactError(null);

    // Anti-spam honeypot
    if (contactForm.hp) {
      setContactSuccess('Thank you! Your message has been received.');
      setContactForm({ name: '', email: '', subject: '', message: '', hp: '' });
      return;
    }

    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      setContactError('Please fill in all required fields.');
      return;
    }

    const newMessage: ContactMessage = {
      id: Date.now(),
      name: contactForm.name,
      email: contactForm.email,
      subject: contactForm.subject,
      message: contactForm.message,
      is_read: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMessages(prev => [newMessage, ...prev]);
    setContactSuccess(`Thank you, ${contactForm.name}! Your message has been sent and stored in the database.`);
    setContactForm({ name: '', email: '', subject: '', message: '', hp: '' });
  };

  // Export Certificates to CSV
  const handleExportCSV = () => {
    let csv = '\uFEFFS. No,Certificate Name,Organization,Level,Date,Rank,Cash Award (INR),Remarks\n';
    certificates.forEach(c => {
      const level = c.competition_level || c.workshop_level || c.other_category || '-';
      const rank = c.place_rank ? (c.place_rank === '1' ? '1st Place' : c.place_rank === '2' ? '2nd Place' : '3rd Place') : '-';
      const cash = c.cash_award ? `Rs. ${c.cash_award}` : '-';
      const remarks = c.remarks ? `"${c.remarks.replace(/"/g, '""')}"` : '-';
      csv += `${c.sno},"${c.name.replace(/"/g, '""')}","${c.organization.replace(/"/g, '""')}","${level}","${c.date_text}","${rank}","${cash}",${remarks}\n`;
    });

    csv += '\n--- CAMP CERTIFICATES ---\n';
    csv += 'S. No,Camp Name,Organization,Camp Level,Dates,Location,Certificate No,Note\n';
    camps.forEach(cp => {
      csv += `${cp.sno},"${cp.name.replace(/"/g, '""')}","${cp.organization.replace(/"/g, '""')}","${cp.camp_level || '-'}","${cp.date_range_text}","${cp.location}","${cp.certificate_no || '-'}","${(cp.other_note || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sanjai_B_Certificates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-mode text-slate-100 bg-[#0f172a]' : 'text-slate-800 bg-white'}`}>
      {/* ================= Public Navigation Bar ================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-[#0f172a]/95 border-b border-slate-800' : 'bg-white/95 border-b border-slate-200'
      } backdrop-blur-md shadow-xs`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <a href="#home" className="font-serif text-2xl font-bold tracking-tight text-[#0066cc] dark:text-[#38bdf8] flex items-center gap-1">
            Sanjai<span className="text-[#1e88e5] dark:text-[#60a5fa]">.</span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6 text-[0.92rem] font-medium">
            <a href="#home" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">About</a>
            <a href="#skills" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Skills</a>
            <a href="#projects" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Projects</a>
            <a href="#research" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Research</a>
            <a href="#education" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Education</a>
            <a href="#certificates" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Certificates</a>
            <a href="#experience" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Experience</a>
            <a href="#contact" className="hover:text-[#0066cc] dark:hover:text-[#38bdf8] transition-colors">Contact</a>

            {/* Admin CMS Launcher Button */}
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0066cc] dark:text-[#38bdf8] border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all cursor-pointer"
              title="Toggle Interactive Database Admin CMS"
            >
              <i className="fas fa-lock text-xs"></i>
              {isAdminView ? 'Exit Admin' : 'Admin CMS'}
              {messages.filter(m => !m.is_read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-[#0066cc] dark:hover:text-[#38bdf8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-700'} text-lg`}></i>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-lg text-slate-700 dark:text-slate-200"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon'}`}></i>
            </button>
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className="p-1.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-[#0066cc] dark:text-[#38bdf8] rounded-md"
            >
              {isAdminView ? 'Site' : 'Admin'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-xl text-slate-700 dark:text-slate-200"
              aria-label="Toggle Navigation"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800">
            {['home', 'about', 'skills', 'projects', 'research', 'education', 'certificates', 'experience', 'contact'].map(sec => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium capitalize text-slate-700 dark:text-slate-200 hover:text-[#0066cc]"
              >
                {sec}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ================= ADMIN CMS MODAL / PANEL ================= */}
      {isAdminView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Admin Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0066cc] flex items-center justify-center text-white">
                  <i className="fas fa-database text-sm"></i>
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-white">Sanjai B Portfolio CMS & Database Panel</h2>
                  <p className="text-xs text-slate-400">Manage all 10 MySQL tables live with instant persistence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/sanjai-b-portfolio-php-mysql.zip"
                  download="sanjai-b-portfolio-php-mysql.zip"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                >
                  <i className="fas fa-file-archive"></i> Download PHP+MySQL ZIP
                </a>
                <button
                  onClick={() => setIsAdminView(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setAdminTab('certificates')}
                className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer ${adminTab === 'certificates' ? 'bg-white dark:bg-[#1e293b] text-[#0066cc] dark:text-[#38bdf8] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <i className="fas fa-award mr-1.5"></i> Certificates ({certificates.length})
              </button>
              <button
                onClick={() => setAdminTab('camps')}
                className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer ${adminTab === 'camps' ? 'bg-white dark:bg-[#1e293b] text-[#0066cc] dark:text-[#38bdf8] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <i className="fas fa-campground mr-1.5"></i> Camps ({camps.length})
              </button>
              <button
                onClick={() => setAdminTab('profile')}
                className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer ${adminTab === 'profile' ? 'bg-white dark:bg-[#1e293b] text-[#0066cc] dark:text-[#38bdf8] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <i className="fas fa-user mr-1.5"></i> Profile & Resume
              </button>
              <button
                onClick={() => setAdminTab('projects')}
                className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer ${adminTab === 'projects' ? 'bg-white dark:bg-[#1e293b] text-[#0066cc] dark:text-[#38bdf8] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <i className="fas fa-folder mr-1.5"></i> Projects ({projects.length})
              </button>
              <button
                onClick={() => setAdminTab('messages')}
                className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${adminTab === 'messages' ? 'bg-white dark:bg-[#1e293b] text-[#0066cc] dark:text-[#38bdf8] shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <i className="fas fa-inbox"></i> Inbox
                {messages.filter(m => !m.is_read).length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold">
                    {messages.filter(m => !m.is_read).length}
                  </span>
                )}
              </button>
            </div>

            {/* Admin Body Content */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
              {/* TAB: Certificates */}
              {adminTab === 'certificates' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <div>
                      <h4 className="font-semibold text-sm text-[#0066cc] dark:text-[#38bdf8]">Certificates & Achievements Management</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Total: {certificates.length} | 1st Places: {stats.firstPlaces} | Cash Total: ₹{stats.totalCash.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <i className="fas fa-file-excel"></i> Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Add Certificate Form */}
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                    <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <i className="fas fa-plus-circle text-[#0066cc]"></i> Add New Certificate Row
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-500 mb-1 font-medium">S. No</label>
                        <input
                          type="number"
                          value={newCert.sno}
                          onChange={e => setNewCert({ ...newCert, sno: Number(e.target.value) })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-500 mb-1 font-medium">Certificate Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Speech Competition"
                          value={newCert.name}
                          onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-medium">Organization *</label>
                        <input
                          type="text"
                          placeholder="e.g. TN Govt / Don Bosco"
                          value={newCert.organization}
                          onChange={e => setNewCert({ ...newCert, organization: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-medium">Competition Level</label>
                        <input
                          type="text"
                          placeholder="District / State / College"
                          value={newCert.competition_level}
                          onChange={e => setNewCert({ ...newCert, competition_level: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-medium">Date Text</label>
                        <input
                          type="text"
                          placeholder="e.g. 15/10/2026 or Oct 2026"
                          value={newCert.date_text}
                          onChange={e => setNewCert({ ...newCert, date_text: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-medium">Rank (1, 2, 3)</label>
                        <input
                          type="text"
                          placeholder="1, 2, or 3"
                          value={newCert.place_rank}
                          onChange={e => setNewCert({ ...newCert, place_rank: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-medium">Cash Award (INR)</label>
                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          value={newCert.cash_award}
                          onChange={e => setNewCert({ ...newCert, cash_award: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-slate-500 mb-1 font-medium">Remarks</label>
                        <input
                          type="text"
                          placeholder="e.g. Selected from State Level"
                          value={newCert.remarks}
                          onChange={e => setNewCert({ ...newCert, remarks: e.target.value })}
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            if (!newCert.name || !newCert.organization) {
                              alert('Please provide at least a Certificate Name and Organization.');
                              return;
                            }
                            const created: Certificate = {
                              id: Date.now(),
                              sno: newCert.sno,
                              name: newCert.name,
                              organization: newCert.organization,
                              competition_level: newCert.competition_level || null,
                              workshop_level: newCert.workshop_level || null,
                              other_category: null,
                              event_date: '2026-10-18',
                              date_text: newCert.date_text || 'October 2026',
                              place_rank: newCert.place_rank || null,
                              cash_award: newCert.cash_award ? Number(newCert.cash_award) : null,
                              remarks: newCert.remarks || null,
                              image_path: `/uploads/certificates/cert-${(newCert.sno % 21) + 1}.jpg`,
                              sort_order: newCert.sno
                            };
                            setCertificates([created, ...certificates]);
                            setNewCert({
                              sno: certificates.length + 2,
                              name: '',
                              organization: '',
                              competition_level: '',
                              workshop_level: '',
                              date_text: '',
                              place_rank: '',
                              cash_award: '',
                              remarks: ''
                            });
                            alert('Certificate successfully added to database!');
                          }}
                          className="w-full py-2 bg-[#0066cc] hover:bg-[#004c99] text-white font-semibold rounded-md shadow-xs cursor-pointer"
                        >
                          <i className="fas fa-save mr-1"></i> Add Record
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Certificates Table */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        <tr>
                          <th className="p-3">S.No</th>
                          <th className="p-3">Certificate Name</th>
                          <th className="p-3">Organization</th>
                          <th className="p-3">Level</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Rank</th>
                          <th className="p-3">Cash</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {certificates.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                            <td className="p-3 font-bold">{c.sno}</td>
                            <td className="p-3 font-semibold">{c.name}</td>
                            <td className="p-3 text-slate-500">{c.organization}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                                {c.competition_level || c.workshop_level || c.other_category || 'Recognized'}
                              </span>
                            </td>
                            <td className="p-3">{c.date_text}</td>
                            <td className="p-3">
                              {c.place_rank ? (
                                <span className="font-bold">
                                  {c.place_rank === '1' ? '🥇 1st' : c.place_rank === '2' ? '🥈 2nd' : '🥉 3rd'}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                              {c.cash_award ? `₹${Number(c.cash_award).toLocaleString()}` : '-'}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Delete certificate "${c.name}"?`)) {
                                    setCertificates(certificates.filter(item => item.id !== c.id));
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: Camps */}
              {adminTab === 'camps' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                    <h4 className="font-semibold text-sm text-sky-800 dark:text-sky-300">Special Camp Certificates ({camps.length})</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Manage field camps, dates, certificate numbers, and details.</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        <tr>
                          <th className="p-3">S.No</th>
                          <th className="p-3">Camp Title</th>
                          <th className="p-3">Organization</th>
                          <th className="p-3">Dates</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Certificate No</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {camps.map(cp => (
                          <tr key={cp.id}>
                            <td className="p-3 font-bold">{cp.sno}</td>
                            <td className="p-3 font-semibold">{cp.name}</td>
                            <td className="p-3">{cp.organization}</td>
                            <td className="p-3">{cp.date_range_text}</td>
                            <td className="p-3">{cp.location}</td>
                            <td className="p-3 font-mono">{cp.certificate_no || '-'}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Delete camp record "${cp.name}"?`)) {
                                    setCamps(camps.filter(item => item.id !== cp.id));
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: Profile & Resume */}
              {adminTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Degree</label>
                      <input
                        type="text"
                        value={profile.degree}
                        onChange={e => setProfile({ ...profile, degree: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Institution</label>
                      <input
                        type="text"
                        value={profile.institution}
                        onChange={e => setProfile({ ...profile, institution: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Phone</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={profile.linkedin_url}
                        onChange={e => setProfile({ ...profile, linkedin_url: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 font-medium mb-1">Hero Description</label>
                      <textarea
                        rows={3}
                        value={profile.hero_description}
                        onChange={e => setProfile({ ...profile, hero_description: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 font-medium mb-1">Career Objective</label>
                      <textarea
                        rows={2}
                        value={profile.career_objective}
                        onChange={e => setProfile({ ...profile, career_objective: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => alert('Profile changes saved successfully!')}
                      className="px-5 py-2.5 bg-[#0066cc] text-white rounded-lg text-xs font-semibold"
                    >
                      <i className="fas fa-check mr-1.5"></i> Save Profile Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: Projects */}
              {adminTab === 'projects' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        <tr>
                          <th className="p-3">Order</th>
                          <th className="p-3">Project Title</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Technologies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {projects.map(p => (
                          <tr key={p.id}>
                            <td className="p-3 font-bold">{p.sort_order}</td>
                            <td className="p-3 font-semibold">{p.title}</td>
                            <td className="p-3 text-slate-500">{p.category}</td>
                            <td className="p-3">{p.technologies.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: Messages Inbox */}
              {adminTab === 'messages' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-300">Contact Form Submissions Inbox ({messages.length})</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Inquiries submitted through the public website contact form.</p>
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-center py-8 text-slate-500 text-sm">Inbox is empty. Submit a test message on the contact form to see it here.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl border transition-all ${
                            !msg.is_read
                              ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-xs'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{msg.name}</span>
                              <a href={`mailto:${msg.email}`} className="text-xs text-[#0066cc] dark:text-[#38bdf8]">
                                &lt;{msg.email}&gt;
                              </a>
                              {!msg.is_read && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">New</span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{msg.created_at}</span>
                          </div>
                          <h5 className="font-medium text-xs text-slate-700 dark:text-slate-300 mb-1">
                            <strong>Subject:</strong> {msg.subject}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                            {msg.message}
                          </p>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: !m.is_read } : m));
                              }}
                              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer"
                            >
                              {msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                            </button>
                            <button
                              onClick={() => {
                                setMessages(messages.filter(m => m.id !== msg.id));
                              }}
                              className="px-2.5 py-1 text-xs rounded-md bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-[#090d16] dark:via-[#0f172a] dark:to-[#1e293b]">
        {/* Twinkling Stars Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 55 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: `${(i % 3) * 1 + 2}px`,
                height: `${(i % 3) * 1 + 2}px`,
                left: `${(i * 19.3) % 100}%`,
                top: `${(i * 27.7) % 100}%`,
                opacity: 0.3 + ((i % 5) * 0.15),
                animationDelay: `${(i % 7) * 0.4}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col-reverse lg:flex-row items-center gap-12 z-10">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white leading-tight">
              Hello, I'm <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0066cc] to-[#1e88e5] dark:from-[#38bdf8] dark:to-[#60a5fa]">{profile.name}</span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-[#0066cc] dark:text-[#38bdf8] mb-4">
              {profile.title}
            </p>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-8 leading-relaxed mx-auto lg:mx-0">
              {profile.hero_description}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-linear-to-r from-[#0066cc] to-[#1e88e5] text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
              >
                <i className="fas fa-user text-xs"></i> About Me
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-[#0066cc] text-[#0066cc] dark:text-[#38bdf8] dark:border-[#38bdf8] hover:bg-[#0066cc] hover:text-white dark:hover:bg-[#38bdf8] dark:hover:text-slate-950 transition-all hover:-translate-y-0.5"
              >
                <i className="fas fa-folder text-xs"></i> View Projects
              </a>
              <a
                href={profile.resume_path}
                download="Sanjai_B_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
              >
                <i className="fas fa-download text-xs"></i> Download Resume
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-slate-400 dark:border-slate-600 hover:border-slate-700 text-slate-700 dark:text-slate-200 transition-all hover:-translate-y-0.5"
              >
                <i className="fas fa-envelope text-xs"></i> Contact Me
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-linear-to-tr from-[#0066cc] via-sky-400 to-[#1e88e5] shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img
                  src={profile.profile_image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs font-semibold text-[#0066cc] dark:text-[#38bdf8]">
          <span>Scroll Down</span>
          <i className="fas fa-chevron-down animate-bounce text-sm"></i>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">About Me</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0066cc] dark:text-[#38bdf8]">
                {profile.about_heading}
              </h3>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-sm">
                <p><strong className="text-slate-900 dark:text-white">Degree:</strong> {profile.degree}</p>
                <p><strong className="text-slate-900 dark:text-white">Institution:</strong> {profile.institution}</p>
                <p><strong className="text-slate-900 dark:text-white">Status:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{profile.status}</span></p>
              </div>

              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {profile.about_description}
              </p>

              <div className="p-6 rounded-2xl bg-linear-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 border-l-4 border-[#0066cc] dark:border-[#38bdf8]">
                <h4 className="font-semibold text-base text-[#0066cc] dark:text-[#38bdf8] mb-2 flex items-center gap-2">
                  <i className="fas fa-bullseye"></i> Career Objective
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {profile.career_objective}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-64 h-64 rounded-3xl bg-linear-to-br from-[#0066cc] to-[#1e88e5] text-white flex flex-col items-center justify-center p-6 shadow-xl text-center">
                <i className="fas fa-graduation-cap text-6xl mb-4 text-sky-200"></i>
                <h4 className="font-serif font-bold text-xl mb-1">Mathematics & Computing</h4>
                <p className="text-xs text-sky-100">Don Bosco College, Yelagiri Hills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SKILLS SECTION ================= */}
      <section id="skills" className="py-24 bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Skills & Expertise</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
          </div>

          <div className="space-y-14">
            {/* Technical Skills */}
            <div>
              <h3 className="text-xl font-bold text-[#0066cc] dark:text-[#38bdf8] mb-6 flex items-center gap-2.5">
                <i className="fas fa-code"></i> Technical Skills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {skills.filter(s => s.category === 'technical').map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all shadow-xs">
                    <i className={`${s.icon_class} text-3xl text-[#0066cc] dark:text-[#38bdf8] mb-2`}></i>
                    <h4 className="font-semibold text-xs mb-2 text-slate-800 dark:text-slate-200">{s.name}</h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-linear-to-r from-[#0066cc] to-[#1e88e5] h-full rounded-full" style={{ width: `${s.proficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Skills */}
            <div>
              <h3 className="text-xl font-bold text-[#0066cc] dark:text-[#38bdf8] mb-6 flex items-center gap-2.5">
                <i className="fas fa-graduation-cap"></i> Academic Skills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {skills.filter(s => s.category === 'academic').map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all shadow-xs">
                    <i className={`${s.icon_class} text-3xl text-[#0066cc] dark:text-[#38bdf8] mb-2`}></i>
                    <h4 className="font-semibold text-xs mb-2 text-slate-800 dark:text-slate-200">{s.name}</h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-linear-to-r from-[#0066cc] to-[#1e88e5] h-full rounded-full" style={{ width: `${s.proficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-xl font-bold text-[#0066cc] dark:text-[#38bdf8] mb-6 flex items-center gap-2.5">
                <i className="fas fa-users"></i> Soft Skills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {skills.filter(s => s.category === 'soft').map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1 transition-all shadow-xs">
                    <i className={`${s.icon_class} text-3xl text-[#0066cc] dark:text-[#38bdf8] mb-2`}></i>
                    <h4 className="font-semibold text-xs mb-2 text-slate-800 dark:text-slate-200">{s.name}</h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-linear-to-r from-[#0066cc] to-[#1e88e5] h-full rounded-full" style={{ width: `${s.proficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section id="projects" className="py-24 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Featured Projects</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 mt-2">Capstone research, predictive models, IoT prototypes & web software</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(proj => (
              <div
                key={proj.id}
                className="group rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col"
              >
                <div className="h-44 bg-linear-to-br from-slate-900 to-blue-950 flex items-center justify-center relative overflow-hidden">
                  <i className={`${proj.icon_class} text-5xl text-sky-400 group-hover:scale-110 transition-transform duration-300`}></i>
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full bg-[#0066cc] hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        title="GitHub Repository"
                      >
                        <i className="fab fa-github text-sm"></i>
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[11px] font-semibold text-[#0066cc] dark:text-[#38bdf8] mb-1 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <h3 className="font-serif font-bold text-lg mb-2 text-slate-900 dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#38bdf8] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {proj.technologies.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-[#0066cc] dark:text-[#38bdf8] border border-blue-100 dark:border-blue-900/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESEARCH SECTION ================= */}
      <section id="research" className="py-24 bg-white dark:bg-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Research & Academic Activities</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 mt-2">Mathematical modeling, orbital trajectories & space exploration mechanics</p>
          </div>

          <div className="relative pl-8 sm:pl-10 border-l-2 border-[#0066cc]/40 dark:border-[#38bdf8]/40 space-y-10">
            {INITIAL_RESEARCH.map(res => (
              <div key={res.id} className="relative group">
                <div className="absolute -left-[45px] sm:-left-[53px] top-1 w-8 h-8 rounded-full bg-linear-to-tr from-[#0066cc] to-[#1e88e5] text-white flex items-center justify-center text-xs shadow-md">
                  <i className="fas fa-star"></i>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#0066cc] transition-colors">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0066cc] dark:text-[#38bdf8] mb-2">
                    {res.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EDUCATION SECTION ================= */}
      <section id="education" className="py-24 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Educational Journey</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 mt-2">Building Excellence Through Academic Growth</p>
          </div>

          <div className="space-y-8">
            {INITIAL_EDUCATION.map(edu => (
              <div
                key={edu.id}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-[#0066cc] dark:border-l-[#38bdf8]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0066cc] dark:text-[#38bdf8]">{edu.degree_title}</h3>
                    <p className="text-sm text-slate-500 italic">{edu.specialization}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    edu.status_type === 'current'
                      ? 'bg-blue-100 text-[#0066cc] dark:bg-blue-900/60 dark:text-blue-200'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                  }`}>
                    <i className={`fas ${edu.status_type === 'current' ? 'fa-star' : 'fa-check-circle'} mr-1`}></i>
                    {edu.status_text}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4 text-slate-600 dark:text-slate-400">
                  <p><i className="fas fa-university text-[#0066cc] mr-1.5"></i> <strong>Institution:</strong> {edu.institution}</p>
                  <p><i className="far fa-calendar-alt text-[#0066cc] mr-1.5"></i> <strong>Duration:</strong> {edu.duration}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {edu.description}
                </p>

                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{edu.key_areas_label}:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.key_areas_tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CERTIFICATES & ACHIEVEMENTS SECTION ================= */}
      <section id="certificates" className="py-24 bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Certificates & Achievements</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 mt-2">
              Verified records loaded from Excel (21 Competitions & Workshops + 3 Field Camps)
            </p>
          </div>

          {/* Dynamic Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center gap-4">
              <div className="w-13 h-13 rounded-xl bg-[#0066cc] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                <i className="fas fa-award"></i>
              </div>
              <div>
                <span className="block font-serif font-bold text-2xl text-slate-900 dark:text-white leading-tight">
                  {stats.totalRecords}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Verified Records</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-4">
              <div className="w-13 h-13 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                <i className="fas fa-trophy"></i>
              </div>
              <div>
                <span className="block font-serif font-bold text-2xl text-slate-900 dark:text-white leading-tight">
                  {stats.firstPlaces}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">1st Places & Top Honors</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-4">
              <div className="w-13 h-13 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div>
                <span className="block font-serif font-bold text-2xl text-slate-900 dark:text-white leading-tight">
                  ₹{stats.totalCash.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Cash Awards Won</span>
              </div>
            </div>
          </div>

          {/* Interactive Filter Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: `All (${certificates.length + camps.length})` },
                { id: 'competition', label: 'Competitions' },
                { id: 'workshop', label: 'Workshops' },
                { id: 'camp', label: `Camps (${camps.length})` },
                { id: 'other', label: 'Other Events' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCertFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    certFilter === tab.id
                      ? 'bg-[#0066cc] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0066cc]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-56">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Search name, org, award..."
                  value={certSearch}
                  onChange={e => setCertSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:border-[#0066cc]"
                />
              </div>

              {/* Year Select */}
              <select
                value={certYear}
                onChange={e => setCertYear(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden"
              >
                <option value="all">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2016">2016</option>
              </select>
            </div>
          </div>

          {/* Certificates Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
              <i className="fas fa-search-minus text-4xl text-slate-400 mb-3"></i>
              <h3 className="font-serif font-bold text-lg mb-1">No certificates match your filters</h3>
              <p className="text-xs text-slate-500 mb-4">Try clearing search terms or selecting 'All' categories.</p>
              <button
                onClick={() => { setCertFilter('all'); setCertSearch(''); setCertYear('all'); }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0066cc] text-white"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => {
                const isCamp = item.type === 'camp';
                const cert = item.data as Certificate;
                const camp = item.data as CampCertificate;

                const level = isCamp ? (camp.camp_level || 'State') : (cert.competition_level || cert.workshop_level || cert.other_category || 'Recognized');
                const rank = !isCamp ? cert.place_rank : null;
                const cash = item.data.cash_award;
                const remarks = isCamp ? camp.other_note : cert.remarks;

                return (
                  <div
                    key={`${item.type}-${item.data.id}-${idx}`}
                    className="group rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                  >
                    {/* Thumbnail box */}
                    <div
                      onClick={() => openLightbox(idx)}
                      className="relative h-48 bg-slate-100 dark:bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={item.data.image_path}
                        alt={`${item.data.name} Certificate`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Neutral fallback SVG
                          (e.target as HTMLImageElement).src = '/uploads/certificates/cert-placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white text-xs font-medium">
                        <i className="fas fa-expand-arrows-alt text-xl"></i>
                        <span>Click to View Full Certificate</span>
                      </div>

                      {/* Rank Badge */}
                      {rank && (
                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-md ${
                          rank === '1' ? 'bg-linear-to-r from-amber-500 to-amber-600' :
                          rank === '2' ? 'bg-linear-to-r from-slate-400 to-slate-500' :
                          'bg-linear-to-r from-amber-700 to-amber-800'
                        }`}>
                          {rank === '1' ? '🥇 1st Place' : rank === '2' ? '🥈 2nd Place' : '🥉 3rd Place'}
                        </div>
                      )}

                      {isCamp && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-linear-to-r from-sky-600 to-blue-600 shadow-md">
                          <i className="fas fa-campground mr-1"></i> Special Camp
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0066cc] dark:text-[#38bdf8] border border-blue-100 dark:border-blue-900/60">
                          {level} Level
                        </span>
                        <span className="text-[11px] text-slate-400">
                          <i className="far fa-calendar-alt mr-1"></i>
                          {isCamp ? camp.date_range_text : cert.date_text}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-1 group-hover:text-[#0066cc] dark:group-hover:text-[#38bdf8] transition-colors line-clamp-2">
                        {item.data.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                        <i className="fas fa-university text-[#0066cc]/70"></i>
                        {item.data.organization}
                      </p>

                      {isCamp && (
                        <p className="text-xs text-slate-500 mb-2">
                          <i className="fas fa-map-marker-alt text-red-500 mr-1"></i> {camp.location}
                        </p>
                      )}

                      {cash && Number(cash) > 0 && (
                        <div className="mt-auto py-1 px-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold inline-flex items-center gap-1.5 self-start">
                          <i className="fas fa-gift"></i> Cash Award: <strong>₹{Number(cash).toLocaleString()}</strong>
                        </div>
                      )}

                      {remarks && (
                        <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 italic">
                          <i className="fas fa-info-circle mr-1"></i> {remarks}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= LIGHTBOX MODAL ================= */}
      {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative bg-white dark:bg-[#1e293b] rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center text-lg shadow-md transition-colors cursor-pointer"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Left / Prev Arrow */}
            <button
              onClick={prevLightbox}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl flex items-center justify-center hover:bg-[#0066cc] hover:text-white transition-all cursor-pointer"
              title="Previous (Left Arrow)"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {/* Right / Next Arrow */}
            <button
              onClick={nextLightbox}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl flex items-center justify-center hover:bg-[#0066cc] hover:text-white transition-all cursor-pointer"
              title="Next (Right Arrow)"
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Certificate Preview Image */}
            <div className="md:w-3/5 bg-slate-950 p-6 flex items-center justify-center">
              <img
                src={lightboxItems[lightboxIndex].data.image_path}
                alt={lightboxItems[lightboxIndex].data.name}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Metadata Info Panel */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/50 text-[#0066cc] dark:text-[#38bdf8] mb-3">
                  Verified Academic & Co-Curricular Record
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {lightboxItems[lightboxIndex].data.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <i className="fas fa-university text-[#0066cc]"></i>
                  {lightboxItems[lightboxIndex].data.organization}
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Date / Term:</span>
                    <span className="font-semibold">{('date_text' in lightboxItems[lightboxIndex].data) ? (lightboxItems[lightboxIndex].data as Certificate).date_text : (lightboxItems[lightboxIndex].data as CampCertificate).date_range_text}</span>
                  </div>

                  {('place_rank' in lightboxItems[lightboxIndex].data) && (lightboxItems[lightboxIndex].data as Certificate).place_rank && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Rank / Award:</span>
                      <span className="font-bold text-amber-500">
                        {(lightboxItems[lightboxIndex].data as Certificate).place_rank === '1' ? '🥇 1st Place (Winner)' :
                         (lightboxItems[lightboxIndex].data as Certificate).place_rank === '2' ? '🥈 2nd Place (Runner-up)' : '🥉 3rd Place'}
                      </span>
                    </div>
                  )}

                  {lightboxItems[lightboxIndex].data.cash_award && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Cash Award:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(lightboxItems[lightboxIndex].data.cash_award).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {('location' in lightboxItems[lightboxIndex].data) && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Camp Location:</span>
                      <span className="font-semibold">{(lightboxItems[lightboxIndex].data as CampCertificate).location}</span>
                    </div>
                  )}

                  {('certificate_no' in lightboxItems[lightboxIndex].data) && (lightboxItems[lightboxIndex].data as CampCertificate).certificate_no && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Certificate No:</span>
                      <span className="font-mono">{(lightboxItems[lightboxIndex].data as CampCertificate).certificate_no}</span>
                    </div>
                  )}
                </div>

                {/* Remarks box */}
                {(('remarks' in lightboxItems[lightboxIndex].data && (lightboxItems[lightboxIndex].data as Certificate).remarks) ||
                  ('other_note' in lightboxItems[lightboxIndex].data && (lightboxItems[lightboxIndex].data as CampCertificate).other_note)) && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-l-3 border-[#0066cc] text-xs text-slate-600 dark:text-slate-300">
                    <strong>Remarks / Scope:</strong>
                    <p className="mt-0.5">
                      {('remarks' in lightboxItems[lightboxIndex].data)
                        ? (lightboxItems[lightboxIndex].data as Certificate).remarks
                        : (lightboxItems[lightboxIndex].data as CampCertificate).other_note}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{lightboxIndex + 1} of {lightboxItems.length} records</span>
                <a
                  href={lightboxItems[lightboxIndex].data.image_path}
                  download={`${lightboxItems[lightboxIndex].data.name}_Certificate.jpg`}
                  className="px-4 py-2 rounded-lg bg-[#0066cc] hover:bg-[#004c99] text-white font-semibold transition-colors"
                >
                  <i className="fas fa-download mr-1.5"></i> Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXPERIENCE SECTION ================= */}
      <section id="experience" className="py-24 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Experience & Internships</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 mt-2">Industrial training, embedded hardware systems & IoT engineering</p>
          </div>

          <div className="space-y-8">
            {experience.map(exp => (
              <div
                key={exp.id}
                className="p-8 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-[#0066cc] dark:border-l-[#38bdf8]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0066cc] dark:text-[#38bdf8] flex items-center gap-2">
                      <i className="fas fa-briefcase"></i> {exp.role_title}
                    </h3>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{exp.organization}</h4>
                  </div>
                  <div className="text-right text-xs text-slate-500 space-y-0.5">
                    <p><i className="far fa-calendar-alt text-[#0066cc] mr-1"></i> {exp.duration}</p>
                    <p><i className="fas fa-map-marker-alt text-red-500 mr-1"></i> {exp.location}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {exp.description}
                </p>

                {/* Projects in Internship */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {exp.mini_project && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <h5 className="font-semibold text-xs text-[#0066cc] dark:text-[#38bdf8] mb-1.5 flex items-center gap-1.5">
                        <i className="fas fa-microchip"></i> Mini Project:
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{exp.mini_project}</p>
                    </div>
                  )}

                  {exp.main_project && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <h5 className="font-semibold text-xs text-[#0066cc] dark:text-[#38bdf8] mb-1.5 flex items-center gap-1.5">
                        <i className="fas fa-network-wired"></i> Main Project:
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{exp.main_project}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Technologies & Hardware Mastered:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills_acquired.map(sk => (
                      <span key={sk} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-[#0066cc] dark:text-[#38bdf8]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ACHIEVEMENTS OVERVIEW ================= */}
      <section id="achievements" className="py-24 bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Key Highlights & Honors</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {INITIAL_ACHIEVEMENTS.map(ach => (
              <div
                key={ach.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center hover:-translate-y-1.5 transition-all shadow-xs border-t-3 border-t-[#0066cc]"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066cc] dark:text-[#38bdf8] flex items-center justify-center text-xl mx-auto mb-4">
                  <i className={ach.icon_class}></i>
                </div>
                <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white mb-2">{ach.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-24 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">Get In Touch</h2>
            <div className="w-16 h-1 bg-linear-to-r from-[#0066cc] to-[#1e88e5] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-500 mt-2">Feel free to reach out for research collaborations or job opportunities</p>
          </div>

          {contactSuccess && (
            <div className="mb-8 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
              <i className="fas fa-check-circle text-lg"></i>
              <span>{contactSuccess}</span>
            </div>
          )}

          {contactError && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-sm flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-lg"></i>
              <span>{contactError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#0066cc] dark:text-[#38bdf8]">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066cc] dark:text-[#38bdf8] flex items-center justify-center text-lg shrink-0">
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase font-semibold">Name</h4>
                    <p className="text-sm font-semibold">{profile.name}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066cc] dark:text-[#38bdf8] flex items-center justify-center text-lg shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase font-semibold">Email</h4>
                    <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-[#0066cc] dark:text-[#38bdf8] hover:underline">
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066cc] dark:text-[#38bdf8] flex items-center justify-center text-lg shrink-0">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase font-semibold">Phone</h4>
                    <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {profile.phone}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066cc] dark:text-[#38bdf8] flex items-center justify-center text-lg shrink-0">
                    <i className="fab fa-linkedin"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase font-semibold">LinkedIn</h4>
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0066cc] dark:text-[#38bdf8] hover:underline">
                      Sanjai B Profile
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066cc] dark:text-[#38bdf8] flex items-center justify-center text-lg shrink-0">
                    <i className="fab fa-github"></i>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase font-semibold">GitHub</h4>
                    <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0066cc] dark:text-[#38bdf8] hover:underline">
                      sanjaibabu310
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {/* Anti-spam honeypot */}
                <div style={{ display: 'none' }}>
                  <label>Leave this empty</label>
                  <input
                    type="text"
                    value={contactForm.hp}
                    onChange={e => setContactForm({ ...contactForm, hp: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-hidden focus:border-[#0066cc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-hidden focus:border-[#0066cc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Project Inquiry / Academic Collaboration"
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-hidden focus:border-[#0066cc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-hidden focus:border-[#0066cc]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-sm bg-linear-to-r from-[#0066cc] to-[#1e88e5] text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fas fa-paper-plane text-xs"></i> Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.8267621485024!2d78.85477!3d12.16528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac7bd0df67c7ff%3A0x8d25e7a5db2e5e5f!2sDon%20Bosco%20College%2C%20Yelagiri!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Don Bosco College Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-3 flex items-center gap-1">
                Sanjai<span className="text-sky-400">.</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                B.Sc. Mathematics with Computer Applications student passionate about software engineering, data analysis, and mathematical space mechanics.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-3">Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="#home" className="hover:text-sky-400">Home</a>
                <a href="#about" className="hover:text-sky-400">About</a>
                <a href="#skills" className="hover:text-sky-400">Skills</a>
                <a href="#projects" className="hover:text-sky-400">Projects</a>
                <a href="#certificates" className="hover:text-sky-400">Certificates</a>
                <a href="#contact" className="hover:text-sky-400">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-3">PHP Deliverables & CMS</h4>
              <p className="text-xs text-slate-400 mb-3">
                Full standalone PHP 8 + MySQL package available with <code>schema.sql</code>, <code>seed.sql</code>, and <code>admin/</code> panel.
              </p>
              <div className="flex gap-2">
                <a
                  href="/sanjai-b-portfolio-php-mysql.zip"
                  download="sanjai-b-portfolio-php-mysql.zip"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <i className="fas fa-file-archive"></i> Download ZIP
                </a>
                <button
                  onClick={() => setIsAdminView(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <i className="fas fa-lock"></i> Open Admin
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} Sanjai B. All Rights Reserved.</p>
            <p>Designed with Poppins & Playfair Display typography • Powered by MySQL & PHP 8 PDO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
