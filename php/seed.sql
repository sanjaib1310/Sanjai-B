-- =======================================================
-- Seed Data for Sanjai B Personal Portfolio
-- Includes 21 Certificates & 3 Camp Certificates from Excel
-- =======================================================

USE `sanjai_portfolio`;

-- 1. Profile Data
INSERT INTO `profile` (
  `id`, `name`, `title`, `subtitle`, `hero_description`, `about_heading`,
  `degree`, `institution`, `status`, `about_description`, `career_objective`,
  `email`, `phone`, `linkedin_url`, `github_url`, `profile_image`, `resume_path`,
  `meta_title`, `meta_description`, `meta_keywords`
) VALUES (
  1,
  'Sanjai B',
  'Aspiring Software Developer | Mathematics Enthusiast | Web Developer',
  'B.Sc. Mathematics with Computer Applications',
  'I am a B.Sc. Mathematics with Computer Applications student passionate about programming, web development, mathematics, data analysis, and emerging technologies. I enjoy creating innovative digital solutions and continuously learning new technologies.',
  'Sanjai B',
  'B.Sc. Mathematics with Computer Applications',
  'Don Bosco College (Co-Ed), Yelagiri Hills',
  'Currently Pursuing',
  'I am currently pursuing a Bachelor of Science in Mathematics with Computer Applications. I have a strong interest in software development, web technologies, mathematics, statistics, and problem-solving. I enjoy building websites, developing applications, and applying mathematical concepts to real-world computing challenges. My goal is to become a skilled software professional and contribute to innovative technology solutions.',
  'To secure opportunities where I can apply my mathematical knowledge, programming skills, and technical expertise while continuously learning and contributing to innovative projects in software development and technology.',
  'sanjaibabu1310@gmail.com',
  '+91 97869 76122',
  'https://www.linkedin.com/in/sanjai-b-253a64349',
  'https://github.com/sanjaibabu310',
  '/uploads/profile.jpg',
  '/uploads/Sanjai_B_Resume.pdf',
  'Sanjai B | Mathematics & Computer Applications Student | Software Developer',
  'Portfolio of Sanjai B - Aspiring Software Developer, Web Developer, Mathematics Enthusiast from Don Bosco College, Yelagiri Hills.',
  'Sanjai B, Portfolio, Web Developer, Software Developer, Mathematics, Computer Applications, Don Bosco College, Yelagiri'
) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Skills Data
INSERT INTO `skills` (`category`, `name`, `icon_class`, `proficiency`, `sort_order`) VALUES
('technical', 'HTML5', 'fab fa-html5', 95, 1),
('technical', 'CSS3', 'fab fa-css3-alt', 90, 2),
('technical', 'JavaScript', 'fab fa-js-square', 85, 3),
('technical', 'PHP', 'fab fa-php', 80, 4),
('technical', 'Java', 'fab fa-java', 75, 5),
('technical', 'Python', 'fab fa-python', 80, 6),
('technical', 'MySQL', 'fas fa-database', 85, 7),
('technical', 'MS Office', 'fas fa-file-word', 90, 8),
('academic', 'Mathematics', 'fas fa-calculator', 95, 1),
('academic', 'Statistics', 'fas fa-chart-bar', 85, 2),
('academic', 'Data Analysis', 'fas fa-chart-line', 80, 3),
('academic', 'Logical Reasoning', 'fas fa-brain', 90, 4),
('academic', 'Problem Solving', 'fas fa-puzzle-piece', 90, 5),
('soft', 'Communication', 'fas fa-comments', 85, 1),
('soft', 'Teamwork', 'fas fa-handshake', 90, 2),
('soft', 'Leadership', 'fas fa-star', 80, 3),
('soft', 'Time Management', 'fas fa-hourglass-end', 85, 4),
('soft', 'Adaptability', 'fas fa-sync-alt', 90, 5);

-- 3. Projects Data
INSERT INTO `projects` (`title`, `category`, `icon_class`, `description`, `technologies`, `project_url`, `github_url`, `is_featured`, `sort_order`) VALUES
('The Mathematics Behind Modern Artificial Intelligence', 'Academic Research & AI', 'fas fa-brain', 'Final year capstone project examining gradient descent optimization, linear algebra transformations, singular value decomposition (SVD), probability theory, and backpropagation mechanics underlying modern neural network architectures.', 'Linear Algebra, Calculus, Python, NumPy, Matplotlib', '#', 'https://github.com/sanjaibabu310', 1, 1),
('Time Series Analysis and Forecasting of Gold & Silver Price in Tamil Nadu', 'Data Science & Statistics', 'fas fa-chart-line', 'Comprehensive statistical modeling project utilizing ARIMA, SARIMA, exponential smoothing, and regression techniques to analyze historic precious metals market volatility and accurately forecast future prices in Tamil Nadu markets.', 'Python, Pandas, Statsmodels, Matplotlib, MySQL', '#', 'https://github.com/sanjaibabu310', 1, 2),
('Attendance Management System', 'Web Application', 'fas fa-clipboard-list', 'A web-based attendance management system that allows administrators and staff members to manage student attendance efficiently. Features include department management, class management, attendance tracking, student records, and report generation.', 'HTML, CSS, JavaScript, PHP, MySQL', '#', 'https://github.com/sanjaibabu310', 1, 3),
('Department Website', 'Web Application', 'fas fa-globe', 'A responsive academic department website providing information about courses, faculty members, events, and departmental activities. Built with modern web technologies for optimal performance and user experience.', 'HTML, CSS, JavaScript', '#', 'https://github.com/sanjaibabu310', 1, 4),
('Personal Portfolio Website', 'Web Application', 'fas fa-briefcase', 'A professional database-driven portfolio website showcasing education, skills, projects, achievements, certificates, and contact information. Fully responsive design with smooth animations and dynamic admin dashboard.', 'HTML5, CSS3, JavaScript, PHP 8, MySQL', '#', 'https://github.com/sanjaibabu310', 1, 5),
('Mathematics Research Projects', 'Celestial Mechanics', 'fas fa-satellite', 'Research work focused on Mathematics in Astronomy, Planetary Orbit Modeling, and Computational Approaches in Celestial Mechanics. Applying mathematical concepts to real-world space exploration challenges.', 'Mathematics, Python, Data Analysis', '#', 'https://github.com/sanjaibabu310', 1, 6),
('Cosmic Close Calls (Book in Progress)', 'Book Authoring', 'fas fa-book-open', 'An engaging science and mathematics book currently authored by Sanjai B exploring near-Earth asteroids, gravitational slingshot trajectories, historical astronomical near-misses, and orbital calculation methods.', 'Astronomy, Physics, LaTeX, Scientific Writing', '#', 'https://github.com/sanjaibabu310', 1, 7);

-- 4. Research Data
INSERT INTO `research` (`title`, `description`, `icon_class`, `sort_order`) VALUES
('Mathematics in Astronomy: Foundations and Frontiers in Modern Space Exploration', 'Exploring the fundamental mathematical principles that govern astronomical phenomena and modern space exploration techniques.', 'fas fa-star', 1),
('Mathematical Modeling and Simulation of Planetary Orbits', 'Developing mathematical models and computational simulations to predict and analyze planetary orbital mechanics and trajectories.', 'fas fa-star', 2),
('Computational Approach to Celestial Mechanics', 'Applying computational methods and algorithms to solve complex problems in celestial mechanics and orbital dynamics.', 'fas fa-star', 3),
('Youth Astronomy and Space Science Congress Participation', 'Active participation in youth-focused astronomy and space science conferences, engaging with latest research and developments in the field.', 'fas fa-star', 4);

-- 5. Education Data
INSERT INTO `education` (`degree_title`, `specialization`, `institution`, `duration`, `status_text`, `status_type`, `icon_class`, `description`, `key_areas_label`, `key_areas_tags`, `sort_order`) VALUES
('Bachelor of Science (B.Sc.)', 'Mathematics with Computer Applications', 'Don Bosco College, Yelagiri', '2024 – Present (Currently Pursuing)', 'Currently Pursuing', 'current', 'fas fa-graduation-cap', 'Currently pursuing a Bachelor\'s degree in Mathematics with Computer Applications, focusing on mathematical problem-solving, programming, data analysis, web technologies, and computer applications. Developing strong analytical, computational, and technical skills through academic projects and practical learning.', 'Key Areas of Study', 'Mathematics, Statistics, Programming Concepts, Web Development, Database Management, Computer Applications', 1),
('Higher Secondary Education (HSC)', 'Computer Science Specialization', 'Government Higher Secondary School, Vadugamuthampatti', '2022 – 2024', 'Completed', 'completed', 'fas fa-book', 'Completed Higher Secondary Education with a specialization in Computer Science, studying essential subjects while building a strong foundation in logical reasoning, scientific concepts, and computer applications. Enhanced analytical and technical skills through rigorous coursework.', 'Subjects Studied', 'Mathematics, Computer Science, Physics, Chemistry', 2),
('Secondary School Leaving Certificate (SSLC)', 'Foundation Level Education', 'Dominic Savio Higher Secondary School', '2021 – 2022', 'Completed', 'completed', 'fas fa-chalkboard-user', 'Successfully completed secondary education with a strong academic foundation in Mathematics, Science, and Technology. Developed discipline, critical thinking, and problem-solving abilities that continue to support academic growth and professional development.', 'Core Strengths Developed', 'Academic Excellence, Logical Thinking, Problem Solving, Technical Foundation', 3);

-- 6. Experience Data
INSERT INTO `experience` (`role_title`, `organization`, `location`, `duration`, `description`, `mini_project`, `main_project`, `skills_acquired`, `sort_order`) VALUES
('Embedded Systems & IoT Intern', 'Karunadu Technologies Pvt. Ltd.', 'Bengaluru, Karnataka', 'June 2026 (1 Month)', 'One-month intensive industrial internship specializing in Embedded Systems and Internet of Things (IoT) using Python and Raspberry Pi hardware. Designed sensor interfacing, automated telemetry, and edge-computing microcontrollers.', 'Smart Library Monitoring System (RFID, Raspberry Pi Pico, LCD, buzzer for automated book check-ins)', 'Smart City Environmental Monitoring System using IoT (Air quality sensors, DHT11, Cloud telemetry)', 'Python, Raspberry Pi, Raspberry Pi Pico, Embedded C, RFID, IoT Cloud, Sensors Interfacing', 1);

-- 7. Certificates Data (Sheet 1)
INSERT INTO `certificates` (`sno`, `name`, `organization`, `competition_level`, `workshop_level`, `other_category`, `event_date`, `date_text`, `place_rank`, `cash_award`, `remarks`, `image_path`, `thumbnail_path`, `sort_order`) VALUES
(1, 'Painting Competition', 'TN Govt', 'School Level', NULL, NULL, '2016-07-01', 'July 2016', '1', NULL, NULL, '/uploads/certificates/cert-1.jpg', '/uploads/certificates/thumbs/cert-1.jpg', 1),
(2, 'Speech Competition', 'TN Govt', 'District', NULL, NULL, '2023-07-30', '30/07/2023', '3', 2000.00, NULL, '/uploads/certificates/cert-2.jpg', '/uploads/certificates/thumbs/cert-2.jpg', 2),
(3, 'Speech Competition', 'TN Govt', 'District', NULL, NULL, '2023-08-02', '02/08/2023', '3', 2000.00, NULL, '/uploads/certificates/cert-3.jpg', '/uploads/certificates/thumbs/cert-3.jpg', 3),
(4, 'Speech Competition', 'Vailankanni School Education', 'District', NULL, NULL, '2023-10-02', '02/10/2023', '1', 5000.00, NULL, '/uploads/certificates/cert-4.jpg', '/uploads/certificates/thumbs/cert-4.jpg', 4),
(5, 'Speech Competition', 'TN Govt', 'District', NULL, NULL, '2023-01-01', '2022 – 2023', '1', NULL, NULL, '/uploads/certificates/cert-5.jpg', '/uploads/certificates/thumbs/cert-5.jpg', 5),
(6, 'Thirukkural Competition', 'TN Govt', 'District', NULL, NULL, '2023-06-01', '2023 – 2023', '1', NULL, NULL, '/uploads/certificates/cert-6.jpg', '/uploads/certificates/thumbs/cert-6.jpg', 6),
(7, 'NAAC Preparation', 'Don Bosco College', NULL, NULL, 'College', '2024-08-30', '30/08/2024', NULL, NULL, NULL, '/uploads/certificates/cert-7.jpg', '/uploads/certificates/thumbs/cert-7.jpg', 7),
(8, 'Workshop', 'TN Tamil Department', NULL, 'District', NULL, '2024-12-13', '13/12/2024', NULL, NULL, NULL, '/uploads/certificates/cert-8.jpg', '/uploads/certificates/thumbs/cert-8.jpg', 8),
(9, 'Skit', 'Don Bosco College (Extravaganza 25)', 'College', NULL, NULL, '2025-01-10', '10/01/2025', '2', NULL, NULL, '/uploads/certificates/cert-9.jpg', '/uploads/certificates/thumbs/cert-9.jpg', 9),
(10, 'Speech Competition', 'Don Bosco College (Extravaganza 25)', 'College', NULL, NULL, '2025-01-10', '10/01/2025', '3', NULL, NULL, '/uploads/certificates/cert-10.jpg', '/uploads/certificates/thumbs/cert-10.jpg', 10),
(11, 'Tamil Debate', 'Don Bosco College Tamil Dept', 'College', NULL, NULL, '2025-01-12', '12/01/2025', NULL, NULL, NULL, '/uploads/certificates/cert-11.jpg', '/uploads/certificates/thumbs/cert-11.jpg', 11),
(12, 'Speech Competition', 'Thiruvalluvar University', 'University', NULL, NULL, '2025-03-04', '04/03/2025', NULL, NULL, NULL, '/uploads/certificates/cert-12.jpg', '/uploads/certificates/thumbs/cert-12.jpg', 12),
(13, 'Workshop', 'TN Tamil Department', NULL, 'District', NULL, '2025-07-29', '29/07/2025', NULL, NULL, NULL, '/uploads/certificates/cert-13.jpg', '/uploads/certificates/thumbs/cert-13.jpg', 13),
(14, 'YASSC', 'TASS', 'State', NULL, NULL, '2025-08-17', '17/08/2025', NULL, NULL, NULL, '/uploads/certificates/cert-14.jpg', '/uploads/certificates/thumbs/cert-14.jpg', 14),
(15, 'PPT', 'Gonzaga College', 'State', NULL, NULL, '2025-10-07', '07/10/2025', '2', NULL, NULL, '/uploads/certificates/cert-15.jpg', '/uploads/certificates/thumbs/cert-15.jpg', 15),
(16, 'Viksit Bharat', 'NSS', 'District', NULL, NULL, '2025-12-22', '22/12/2025', '2', NULL, 'Selected from State Level', '/uploads/certificates/cert-16.jpg', '/uploads/certificates/thumbs/cert-16.jpg', 16),
(17, 'PPT', 'Auxilium College', 'State', NULL, NULL, '2026-01-29', '29/01/2026', '1', 5000.00, NULL, '/uploads/certificates/cert-17.jpg', '/uploads/certificates/thumbs/cert-17.jpg', 17),
(18, 'Workshop', 'Sacred Heart College', NULL, 'National Level', NULL, '2026-08-20', '20/08/2026', NULL, NULL, NULL, '/uploads/certificates/cert-18.jpg', '/uploads/certificates/thumbs/cert-18.jpg', 18),
(19, 'YASSC', 'TASS', 'State', NULL, NULL, '2026-08-29', '29/08/2026', '1', NULL, 'Selected from State Level', '/uploads/certificates/cert-19.jpg', '/uploads/certificates/thumbs/cert-19.jpg', 19),
(20, 'Conference', 'Gonzaga College', 'State', NULL, NULL, '2026-09-11', '11/09/2026', NULL, NULL, NULL, '/uploads/certificates/cert-20.jpg', '/uploads/certificates/thumbs/cert-20.jpg', 20),
(21, 'Conference', 'Don Bosco College (BBA Department)', NULL, 'College Level', NULL, '2026-09-12', '12/09/2026', NULL, NULL, NULL, '/uploads/certificates/cert-21.jpg', '/uploads/certificates/thumbs/cert-21.jpg', 21);

-- 8. Camp Certificates Data (Sheet 2)
INSERT INTO `camp_certificates` (`sno`, `name`, `organization`, `camp_level`, `date_from`, `date_to`, `date_range_text`, `location`, `cash_award`, `certificate_no`, `other_note`, `image_path`, `thumbnail_path`, `sort_order`) VALUES
(1, 'NSS 7-Day Special Annual Camp', 'National Service Scheme (NSS), Don Bosco College', 'District', '2025-02-10', '2025-02-16', '10/02/2025 – 16/02/2025', 'Yelagiri Hills, Tirupattur', NULL, 'NSS/DBC/2025/042', 'Youth for Clean and Green Village: 7 days village adoption, health awareness camp, and rural literacy drive.', '/uploads/certificates/camp-1.jpg', '/uploads/certificates/thumbs/camp-1.jpg', 1),
(2, 'State Level Youth Leadership & Adventure Camp', 'Tamil Nadu State Youth Service / TASS', 'State', '2025-05-15', '2025-05-20', '15/05/2025 – 20/05/2025', 'Ooty, Nilgiris, Tamil Nadu', NULL, 'YLC/TN/2025/118', 'Personality development, high-altitude trekking, community living, and emergency disaster response training.', '/uploads/certificates/camp-2.jpg', '/uploads/certificates/thumbs/camp-2.jpg', 2),
(3, 'Space Science & Night Sky Observation Camp', 'Tamil Nadu Astronomy & Science Society (TASS)', 'State', '2026-01-05', '2026-01-08', '05/01/2026 – 08/01/2026', 'Vainu Bappu Observatory (VBO), Kavalur', NULL, 'TASS/SOC/2026/033', 'Optical telescope tracking, planetary orbit observations, astrophotography, and celestial mechanics seminars.', '/uploads/certificates/camp-3.jpg', '/uploads/certificates/thumbs/camp-3.jpg', 3);

-- 9. Achievements Data
INSERT INTO `achievements` (`title`, `description`, `icon_class`, `sort_order`) VALUES
('Academic Projects', 'Successfully completed multiple academic projects demonstrating technical excellence and innovative problem-solving in mathematics and computer applications.', 'fas fa-trophy', 1),
('Research Activities', 'Active participation in research projects focusing on mathematics, astronomy, celestial mechanics, and computational space sciences.', 'fas fa-microscope', 2),
('Technical Workshops', 'Participated in district and national level technical workshops to enhance skills in web technologies, IoT, Python, and modern software paradigms.', 'fas fa-tools', 3),
('Internship Programs', 'Gained hands-on industrial experience through a 1-month Embedded Systems & IoT internship at Karunadu Technologies Pvt. Ltd., Bengaluru.', 'fas fa-building', 4),
('College Activities', 'Active participant and prize winner in college extravaganzas, Tamil debates, skits, speech competitions, and NAAC accreditation documentation.', 'fas fa-users', 5);

-- 10. Default Admin User (Password: Admin@123)
-- Hash generated using password_hash('Admin@123', PASSWORD_BCRYPT)
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'admin', 'sanjaibabu1310@gmail.com', '$2y$10$wK1k6xZ9dD.4V8aHl1gXo.61sXkF3VsmJ1e.L3z7qR1aB2vC3dE4e')
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`);
