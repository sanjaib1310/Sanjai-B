export interface Certificate {
  id: number;
  sno: number;
  name: string;
  organization: string;
  competition_level: string | null;
  workshop_level: string | null;
  other_category: string | null;
  event_date: string | null;
  date_text: string;
  place_rank: string | null;
  cash_award: number | null;
  remarks: string | null;
  image_path: string;
  thumbnail_path?: string;
  sort_order: number;
}

export interface CampCertificate {
  id: number;
  sno: number;
  name: string;
  organization: string;
  camp_level: string | null;
  date_from: string | null;
  date_to: string | null;
  date_range_text: string;
  location: string;
  cash_award: number | null;
  certificate_no: string | null;
  other_note: string | null;
  image_path: string;
  thumbnail_path?: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  icon_class: string;
  description: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  is_featured: boolean;
  sort_order: number;
}

export interface ResearchItem {
  id: number;
  title: string;
  description: string;
  icon_class: string;
  sort_order: number;
}

export interface EducationItem {
  id: number;
  degree_title: string;
  specialization: string;
  institution: string;
  duration: string;
  status_text: string;
  status_type: 'current' | 'completed';
  icon_class: string;
  description: string;
  key_areas_label: string;
  key_areas_tags: string[];
  sort_order: number;
}

export interface ExperienceItem {
  id: number;
  role_title: string;
  organization: string;
  location: string;
  duration: string;
  description: string;
  mini_project?: string;
  main_project?: string;
  skills_acquired: string[];
  sort_order: number;
}

export interface Skill {
  id: number;
  category: 'technical' | 'academic' | 'soft';
  name: string;
  icon_class: string;
  proficiency: number;
  sort_order: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon_class: string;
  sort_order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  hero_description: string;
  about_heading: string;
  degree: string;
  institution: string;
  status: string;
  about_description: string;
  career_objective: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  profile_image: string;
  resume_path: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export const INITIAL_PROFILE: Profile = {
  name: 'Sanjai B',
  title: 'Aspiring Software Developer | Mathematics Enthusiast | Web Developer',
  subtitle: 'B.Sc. Mathematics with Computer Applications',
  hero_description: 'I am a B.Sc. Mathematics with Computer Applications student passionate about programming, web development, mathematics, data analysis, and emerging technologies. I enjoy creating innovative digital solutions and continuously learning new technologies.',
  about_heading: 'Sanjai B',
  degree: 'B.Sc. Mathematics with Computer Applications',
  institution: 'Don Bosco College (Co-Ed), Yelagiri Hills',
  status: 'Currently Pursuing',
  about_description: 'I am currently pursuing a Bachelor of Science in Mathematics with Computer Applications. I have a strong interest in software development, web technologies, mathematics, statistics, and problem-solving. I enjoy building websites, developing applications, and applying mathematical concepts to real-world computing challenges. My goal is to become a skilled software professional and contribute to innovative technology solutions.',
  career_objective: 'To secure opportunities where I can apply my mathematical knowledge, programming skills, and technical expertise while continuously learning and contributing to innovative projects in software development and technology.',
  email: 'sanjaibabu1310@gmail.com',
  phone: '+91 97869 76122',
  linkedin_url: 'https://www.linkedin.com/in/sanjai-b-253a64349',
  github_url: 'https://github.com/sanjaibabu310',
  profile_image: '/uploads/profile.jpg',
  resume_path: '/uploads/Sanjai_B_Resume.pdf',
  meta_title: 'Sanjai B | Mathematics & Computer Applications Student',
  meta_description: 'Portfolio of Sanjai B - Aspiring Software Developer, Web Developer, Mathematics Enthusiast from Don Bosco College, Yelagiri Hills.',
  meta_keywords: 'Sanjai B, Portfolio, Web Developer, Software Developer, Mathematics, Computer Applications, Don Bosco College, Yelagiri'
};

export const INITIAL_SKILLS: Skill[] = [
  { id: 1, category: 'technical', name: 'HTML5', icon_class: 'fab fa-html5', proficiency: 95, sort_order: 1 },
  { id: 2, category: 'technical', name: 'CSS3', icon_class: 'fab fa-css3-alt', proficiency: 90, sort_order: 2 },
  { id: 3, category: 'technical', name: 'JavaScript', icon_class: 'fab fa-js-square', proficiency: 85, sort_order: 3 },
  { id: 4, category: 'technical', name: 'PHP', icon_class: 'fab fa-php', proficiency: 80, sort_order: 4 },
  { id: 5, category: 'technical', name: 'Java', icon_class: 'fab fa-java', proficiency: 75, sort_order: 5 },
  { id: 6, category: 'technical', name: 'Python', icon_class: 'fab fa-python', proficiency: 80, sort_order: 6 },
  { id: 7, category: 'technical', name: 'MySQL', icon_class: 'fas fa-database', proficiency: 85, sort_order: 7 },
  { id: 8, category: 'technical', name: 'MS Office', icon_class: 'fas fa-file-word', proficiency: 90, sort_order: 8 },
  { id: 9, category: 'academic', name: 'Mathematics', icon_class: 'fas fa-calculator', proficiency: 95, sort_order: 1 },
  { id: 10, category: 'academic', name: 'Statistics', icon_class: 'fas fa-chart-bar', proficiency: 85, sort_order: 2 },
  { id: 11, category: 'academic', name: 'Data Analysis', icon_class: 'fas fa-chart-line', proficiency: 80, sort_order: 3 },
  { id: 12, category: 'academic', name: 'Logical Reasoning', icon_class: 'fas fa-brain', proficiency: 90, sort_order: 4 },
  { id: 13, category: 'academic', name: 'Problem Solving', icon_class: 'fas fa-puzzle-piece', proficiency: 90, sort_order: 5 },
  { id: 14, category: 'soft', name: 'Communication', icon_class: 'fas fa-comments', proficiency: 85, sort_order: 1 },
  { id: 15, category: 'soft', name: 'Teamwork', icon_class: 'fas fa-handshake', proficiency: 90, sort_order: 2 },
  { id: 16, category: 'soft', name: 'Leadership', icon_class: 'fas fa-star', proficiency: 80, sort_order: 3 },
  { id: 17, category: 'soft', name: 'Time Management', icon_class: 'fas fa-hourglass-end', proficiency: 85, sort_order: 4 },
  { id: 18, category: 'soft', name: 'Adaptability', icon_class: 'fas fa-sync-alt', proficiency: 90, sort_order: 5 }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'The Mathematics Behind Modern Artificial Intelligence',
    category: 'Final Year Capstone Project',
    icon_class: 'fas fa-brain',
    description: 'In-depth mathematical capstone investigating optimization theory (SGD, Adam), high-dimensional vector spaces, singular value decomposition (SVD), matrix calculus, and probability distributions powering modern transformers and deep neural network architectures.',
    technologies: ['Linear Algebra', 'Multivariate Calculus', 'Python', 'NumPy', 'Matplotlib'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 1
  },
  {
    id: 2,
    title: 'Time Series Analysis and Forecasting of Gold & Silver Price in Tamil Nadu',
    category: 'Data Science & Statistical Modeling',
    icon_class: 'fas fa-chart-line',
    description: 'Rigorous statistical time-series forecasting study utilizing ARIMA, SARIMAX, and exponential smoothing techniques to analyze historical precious metals volatility and forecast gold and silver price trends in Tamil Nadu markets.',
    technologies: ['Python', 'Pandas', 'Statsmodels', 'Time Series Analysis', 'MySQL'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 2
  },
  {
    id: 3,
    title: 'Attendance Management System',
    category: 'Full-Stack Web Application',
    icon_class: 'fas fa-clipboard-list',
    description: 'A comprehensive web-based attendance management system enabling department administrators and faculty members to manage student attendance, track attendance percentages, and generate exportable departmental reports.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 3
  },
  {
    id: 4,
    title: 'Department Website',
    category: 'Web Application',
    icon_class: 'fas fa-globe',
    description: 'A responsive academic department website providing information about curriculum courses, faculty profiles, upcoming events, and departmental symposiums. Optimized for high mobile responsiveness.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 4
  },
  {
    id: 5,
    title: 'Personal Portfolio Website',
    category: 'Web Application & CMS',
    icon_class: 'fas fa-briefcase',
    description: 'Database-driven personal portfolio website showcasing academic journey, verified certificates with interactive lightbox, projects, research activities, and administrative CMS dashboard.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP 8', 'MySQL PDO'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 5
  },
  {
    id: 6,
    title: 'Mathematics Research Projects',
    category: 'Celestial Mechanics Research',
    icon_class: 'fas fa-satellite',
    description: 'Research work focused on Mathematics in Astronomy, Planetary Orbit Modeling, and Computational Approaches in Celestial Mechanics. Applying differential equations to real-world orbital trajectories.',
    technologies: ['Mathematics', 'Python', 'Numerical Methods', 'Data Analysis'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 6
  },
  {
    id: 7,
    title: 'Cosmic Close Calls (Book Authoring)',
    category: 'Book in Progress',
    icon_class: 'fas fa-book-open',
    description: 'An upcoming science and mathematics book currently authored by Sanjai B analyzing asteroid orbital dynamics, gravitational keyholes, near-Earth object detection algorithms, and historical close celestial encounters.',
    technologies: ['Celestial Mechanics', 'Astrophysics', 'LaTeX', 'Scientific Writing'],
    github_url: 'https://github.com/sanjaibabu310',
    is_featured: true,
    sort_order: 7
  }
];

export const INITIAL_RESEARCH: ResearchItem[] = [
  {
    id: 1,
    title: 'Mathematics in Astronomy: Foundations and Frontiers in Modern Space Exploration',
    description: 'Exploring the fundamental mathematical principles that govern astronomical phenomena, coordinate transformations, and modern space exploration techniques.',
    icon_class: 'fas fa-star',
    sort_order: 1
  },
  {
    id: 2,
    title: 'Mathematical Modeling and Simulation of Planetary Orbits',
    description: 'Developing mathematical models and computational simulations to predict and analyze planetary orbital mechanics and orbital perturbations.',
    icon_class: 'fas fa-star',
    sort_order: 2
  },
  {
    id: 3,
    title: 'Computational Approach to Celestial Mechanics',
    description: 'Applying computational algorithms, Runge-Kutta numerical integration, and matrix methods to solve complex problems in orbital dynamics.',
    icon_class: 'fas fa-star',
    sort_order: 3
  },
  {
    id: 4,
    title: 'Youth Astronomy and Space Science Congress Participation',
    description: 'Active participation in youth-focused astronomy and space science conferences, presenting computational models and engaging with research scientists.',
    icon_class: 'fas fa-star',
    sort_order: 4
  }
];

export const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: 1,
    degree_title: 'Bachelor of Science (B.Sc.)',
    specialization: 'Mathematics with Computer Applications',
    institution: 'Don Bosco College, Yelagiri',
    duration: '2024 – Present (Currently Pursuing)',
    status_text: 'Currently Pursuing',
    status_type: 'current',
    icon_class: 'fas fa-graduation-cap',
    description: 'Currently pursuing a Bachelor\'s degree in Mathematics with Computer Applications, focusing on mathematical problem-solving, programming, data analysis, web technologies, and computer applications. Developing strong analytical, computational, and technical skills through academic projects and practical learning.',
    key_areas_label: 'Key Areas of Study',
    key_areas_tags: ['Mathematics', 'Statistics', 'Programming Concepts', 'Web Development', 'Database Management', 'Computer Applications'],
    sort_order: 1
  },
  {
    id: 2,
    degree_title: 'Higher Secondary Education (HSC)',
    specialization: 'Computer Science Specialization',
    institution: 'Government Higher Secondary School, Vadugamuthampatti',
    duration: '2022 – 2024',
    status_text: 'Completed',
    status_type: 'completed',
    icon_class: 'fas fa-book',
    description: 'Completed Higher Secondary Education with a specialization in Computer Science, studying essential subjects while building a strong foundation in logical reasoning, scientific concepts, and computer applications. Enhanced analytical and technical skills through rigorous coursework.',
    key_areas_label: 'Subjects Studied',
    key_areas_tags: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry'],
    sort_order: 2
  },
  {
    id: 3,
    degree_title: 'Secondary School Leaving Certificate (SSLC)',
    specialization: 'Foundation Level Education',
    institution: 'Dominic Savio Higher Secondary School',
    duration: '2021 – 2022',
    status_text: 'Completed',
    status_type: 'completed',
    icon_class: 'fas fa-chalkboard-user',
    description: 'Successfully completed secondary education with a strong academic foundation in Mathematics, Science, and Technology. Developed discipline, critical thinking, and problem-solving abilities that continue to support academic growth and professional development.',
    key_areas_label: 'Core Strengths Developed',
    key_areas_tags: ['Academic Excellence', 'Logical Thinking', 'Problem Solving', 'Technical Foundation'],
    sort_order: 3
  }
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    id: 1,
    role_title: 'Embedded Systems & IoT Intern',
    organization: 'Karunadu Technologies Pvt. Ltd.',
    location: 'Bengaluru, Karnataka',
    duration: 'June 2026 (1 Month)',
    description: 'Completed a 1-month intensive industrial internship specializing in Embedded Systems and Internet of Things (IoT) using Python and Raspberry Pi hardware. Engineered sensor interfaces, hardware automation, and cloud telemetry systems.',
    mini_project: 'Smart Library Monitoring System (RFID, Raspberry Pi Pico, LCD, buzzer for automated student check-ins)',
    main_project: 'Smart City Environmental Monitoring System using IoT (Air quality sensors, temperature telemetry, and alert triggers)',
    skills_acquired: ['Python', 'Raspberry Pi', 'Raspberry Pi Pico', 'Embedded C', 'RFID', 'Sensors Interfacing', 'IoT Cloud Telemetry'],
    sort_order: 1
  }
];

// All 21 certificates from Sheet 1 with corrected spellings
export const INITIAL_CERTIFICATES: Certificate[] = [
  { id: 1, sno: 1, name: 'Painting Competition', organization: 'TN Govt', competition_level: 'School Level', workshop_level: null, other_category: null, event_date: '2016-07-01', date_text: 'July 2016', place_rank: '1', cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-1.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-1.jpg', sort_order: 1 },
  { id: 2, sno: 2, name: 'Speech Competition', organization: 'TN Govt', competition_level: 'District', workshop_level: null, other_category: null, event_date: '2023-07-30', date_text: '30/07/2023', place_rank: '3', cash_award: 2000, remarks: null, image_path: '/uploads/certificates/cert-2.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-2.jpg', sort_order: 2 },
  { id: 3, sno: 3, name: 'Speech Competition', organization: 'TN Govt', competition_level: 'District', workshop_level: null, other_category: null, event_date: '2023-08-02', date_text: '02/08/2023', place_rank: '3', cash_award: 2000, remarks: null, image_path: '/uploads/certificates/cert-3.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-3.jpg', sort_order: 3 },
  { id: 4, sno: 4, name: 'Speech Competition', organization: 'Vailankanni School Education', competition_level: 'District', workshop_level: null, other_category: null, event_date: '2023-10-02', date_text: '02/10/2023', place_rank: '1', cash_award: 5000, remarks: null, image_path: '/uploads/certificates/cert-4.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-4.jpg', sort_order: 4 },
  { id: 5, sno: 5, name: 'Speech Competition', organization: 'TN Govt', competition_level: 'District', workshop_level: null, other_category: null, event_date: '2023-01-01', date_text: '2022 – 2023', place_rank: '1', cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-5.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-5.jpg', sort_order: 5 },
  { id: 6, sno: 6, name: 'Thirukkural Competition', organization: 'TN Govt', competition_level: 'District', workshop_level: null, other_category: null, event_date: '2023-06-01', date_text: '2023 – 2023', place_rank: '1', cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-6.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-6.jpg', sort_order: 6 },
  { id: 7, sno: 7, name: 'NAAC Preparation', organization: 'Don Bosco College', competition_level: null, workshop_level: null, other_category: 'College', event_date: '2024-08-30', date_text: '30/08/2024', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-7.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-7.jpg', sort_order: 7 },
  { id: 8, sno: 8, name: 'Workshop', organization: 'TN Tamil Department', competition_level: null, workshop_level: 'District', other_category: null, event_date: '2024-12-13', date_text: '13/12/2024', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-8.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-8.jpg', sort_order: 8 },
  { id: 9, sno: 9, name: 'Skit', organization: 'Don Bosco College (Extravaganza 25)', competition_level: 'College', workshop_level: null, other_category: null, event_date: '2025-01-10', date_text: '10/01/2025', place_rank: '2', cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-9.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-9.jpg', sort_order: 9 },
  { id: 10, sno: 10, name: 'Speech Competition', organization: 'Don Bosco College (Extravaganza 25)', competition_level: 'College', workshop_level: null, other_category: null, event_date: '2025-01-10', date_text: '10/01/2025', place_rank: '3', cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-10.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-10.jpg', sort_order: 10 },
  { id: 11, sno: 11, name: 'Tamil Debate', organization: 'Don Bosco College Tamil Dept', competition_level: 'College', workshop_level: null, other_category: null, event_date: '2025-01-12', date_text: '12/01/2025', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-11.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-11.jpg', sort_order: 11 },
  { id: 12, sno: 12, name: 'Speech Competition', organization: 'Thiruvalluvar University', competition_level: 'University', workshop_level: null, other_category: null, event_date: '2025-03-04', date_text: '04/03/2025', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-12.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-12.jpg', sort_order: 12 },
  { id: 13, sno: 13, name: 'Workshop', organization: 'TN Tamil Department', competition_level: null, workshop_level: 'District', other_category: null, event_date: '2025-07-29', date_text: '29/07/2025', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-13.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-13.jpg', sort_order: 13 },
  { id: 14, sno: 14, name: 'YASSC', organization: 'TASS', competition_level: 'State', workshop_level: null, other_category: null, event_date: '2025-08-17', date_text: '17/08/2025', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-14.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-14.jpg', sort_order: 14 },
  { id: 15, sno: 15, name: 'PPT', organization: 'Gonzaga College', competition_level: 'State', workshop_level: null, other_category: null, event_date: '2025-10-07', date_text: '07/10/2025', place_rank: '2', cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-15.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-15.jpg', sort_order: 15 },
  { id: 16, sno: 16, name: 'Viksit Bharat', organization: 'NSS', competition_level: 'District', workshop_level: null, other_category: null, event_date: '2025-12-22', date_text: '22/12/2025', place_rank: '2', cash_award: null, remarks: 'Selected from State Level', image_path: '/uploads/certificates/cert-16.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-16.jpg', sort_order: 16 },
  { id: 17, sno: 17, name: 'PPT', organization: 'Auxilium College', competition_level: 'State', workshop_level: null, other_category: null, event_date: '2026-01-29', date_text: '29/01/2026', place_rank: '1', cash_award: 5000, remarks: null, image_path: '/uploads/certificates/cert-17.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-17.jpg', sort_order: 17 },
  { id: 18, sno: 18, name: 'Workshop', organization: 'Sacred Heart College', competition_level: null, workshop_level: 'National Level', other_category: null, event_date: '2026-08-20', date_text: '20/08/2026', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-18.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-18.jpg', sort_order: 18 },
  { id: 19, sno: 19, name: 'YASSC', organization: 'TASS', competition_level: 'State', workshop_level: null, other_category: null, event_date: '2026-08-29', date_text: '29/08/2026', place_rank: '1', cash_award: null, remarks: 'Selected from State Level', image_path: '/uploads/certificates/cert-19.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-19.jpg', sort_order: 19 },
  { id: 20, sno: 20, name: 'Conference', organization: 'Gonzaga College', competition_level: 'State', workshop_level: null, other_category: null, event_date: '2026-09-11', date_text: '11/09/2026', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-20.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-20.jpg', sort_order: 20 },
  { id: 21, sno: 21, name: 'Conference', organization: 'Don Bosco College (BBA Department)', competition_level: null, workshop_level: 'College Level', other_category: null, event_date: '2026-09-12', date_text: '12/09/2026', place_rank: null, cash_award: null, remarks: null, image_path: '/uploads/certificates/cert-21.jpg', thumbnail_path: '/uploads/certificates/thumbs/cert-21.jpg', sort_order: 21 }
];

// 3 Camp Certificates from Sheet 2
export const INITIAL_CAMPS: CampCertificate[] = [
  {
    id: 1,
    sno: 1,
    name: 'NSS 7-Day Special Annual Camp',
    organization: 'National Service Scheme (NSS), Don Bosco College',
    camp_level: 'District',
    date_from: '2025-02-10',
    date_to: '2025-02-16',
    date_range_text: '10/02/2025 – 16/02/2025',
    location: 'Yelagiri Hills, Tirupattur',
    cash_award: null,
    certificate_no: 'NSS/DBC/2025/042',
    other_note: 'Youth for Clean and Green Village: 7 days village adoption, health awareness camp, and rural literacy drive.',
    image_path: '/uploads/certificates/camp-1.jpg',
    thumbnail_path: '/uploads/certificates/thumbs/camp-1.jpg',
    sort_order: 1
  },
  {
    id: 2,
    sno: 2,
    name: 'State Level Youth Leadership & Adventure Camp',
    organization: 'Tamil Nadu State Youth Service / TASS',
    camp_level: 'State',
    date_from: '2025-05-15',
    date_to: '2025-05-20',
    date_range_text: '15/05/2025 – 20/05/2025',
    location: 'Ooty, Nilgiris, Tamil Nadu',
    cash_award: null,
    certificate_no: 'YLC/TN/2025/118',
    other_note: 'Personality development, high-altitude trekking, community living, and emergency disaster response training.',
    image_path: '/uploads/certificates/camp-2.jpg',
    thumbnail_path: '/uploads/certificates/thumbs/camp-2.jpg',
    sort_order: 2
  },
  {
    id: 3,
    sno: 3,
    name: 'Space Science & Night Sky Observation Camp',
    organization: 'Tamil Nadu Astronomy & Science Society (TASS)',
    camp_level: 'State',
    date_from: '2026-01-05',
    date_to: '2026-01-08',
    date_range_text: '05/01/2026 – 08/01/2026',
    location: 'Vainu Bappu Observatory (VBO), Kavalur',
    cash_award: null,
    certificate_no: 'TASS/SOC/2026/033',
    other_note: 'Optical telescope tracking, planetary orbit observations, astrophotography, and celestial mechanics seminars.',
    image_path: '/uploads/certificates/camp-3.jpg',
    thumbnail_path: '/uploads/certificates/thumbs/camp-3.jpg',
    sort_order: 3
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: 'Academic Projects', description: 'Successfully completed multiple academic projects demonstrating technical excellence and innovative problem-solving in mathematics and computer applications.', icon_class: 'fas fa-trophy', sort_order: 1 },
  { id: 2, title: 'Research Activities', description: 'Active participation in research projects focusing on mathematics, astronomy, celestial mechanics, and computational space sciences.', icon_class: 'fas fa-microscope', sort_order: 2 },
  { id: 3, title: 'Technical Workshops', description: 'Participated in district and national level technical workshops to enhance skills in web technologies, IoT, Python, and modern software paradigms.', icon_class: 'fas fa-tools', sort_order: 3 },
  { id: 4, title: 'Internship Programs', description: 'Gained hands-on industrial experience through a 1-month Embedded Systems & IoT internship at Karunadu Technologies Pvt. Ltd., Bengaluru.', icon_class: 'fas fa-building', sort_order: 4 },
  { id: 5, title: 'College Activities', description: 'Active participant and prize winner in college extravaganzas, Tamil debates, skits, speech competitions, and NAAC accreditation documentation.', icon_class: 'fas fa-users', sort_order: 5 }
];
