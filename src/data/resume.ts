export const personal = {
  name: 'Jad Kashmar',
  taglines: [
    'Full-Stack Developer',
    'Computer Engineering Student',
    'F1 & Motorsport Enthusiast',
    'Digital Hardware Designer',
  ],
  location: 'Byblos / Jbeil, Lebanon',
  summary:
    'Third-year Computer Engineering student at Lebanese American University with a solid foundation in full-stack web development and digital hardware design. Experienced in building responsive, data-driven web applications with modern JavaScript frameworks, including Sector Seven, a real-time F1 telemetry hub, Dormir, a student housing platform, and World Cup 2026 Live, an interactive tournament tracker, alongside hands-on design of synchronous counters and 74-series logic integrated circuits. Combines analytical engineering problem-solving with strong communication skills developed through customer-facing roles, and a personal interest in motorsport that carries into both karting and software.',
}

export const education = {
  degree: 'Bachelor of Engineering in Computer Engineering',
  school: 'Lebanese American University (LAU)',
  location: 'Byblos, Lebanon',
  graduation: 'Expected Graduation 2029',
  satScore: 'SAT: 1400 (750 Math / 650 English)',
}

export const spokenLanguages = [
  { name: 'Arabic', level: 'Native', fluency: 100 },
  { name: 'English', level: 'Fluent', fluency: 90 },
  { name: 'French', level: 'Elementary', fluency: 40 },
  { name: 'Italian', level: 'Beginner', fluency: 20 },
]

export type SkillCategory = {
  title: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: ['Java', 'C++', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    title: 'Web',
    skills: ['React.js', 'Node.js', 'Express', 'Tailwind CSS v4', 'Vite', 'Motion', 'HTML/CSS'],
  },
  {
    title: 'Data & Tools',
    skills: ['MySQL', 'SQLite', 'Firebase Firestore', 'Altera Quartus II', 'Digital Circuit Simulation'],
  },
  {
    title: 'Hardware',
    skills: ['74-Series ICs', 'Combinational & Sequential Logic', 'FSM Design'],
  },
]

export const contact = {
  email: 'jad.kashmar@gmail.com',
  phone: '+961 81828105',
  // TODO(jad): paste your real LinkedIn profile URL here
  linkedin: 'https://www.linkedin.com/in/your-profile-here',
  location: 'Byblos / Jbeil area, Lebanon',
}
