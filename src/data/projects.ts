export type ProjectCategory = 'software' | 'hardware'

export type GalleryImage = {
  src: string
  caption: string
}

export type Project = {
  slug: string
  title: string
  category: ProjectCategory
  stackSummary: string
  stack: string[]
  description: string
  // Drop a screenshot at /public/projects/<slug>.png (or .jpg) to replace the placeholder.
  // Recommended size: 1200x750 (16:10), under 400kb.
  image: string
  // Optional: an autoplaying GIF shown directly on the card (in place of `image`) as a
  // "live" preview. Drop it at /public/projects/<slug>/preview.gif.
  previewGif?: string
  // Optional: a full screenshot gallery shown in the click-through project modal.
  // Drop images at /public/projects/<slug>/screenshot-NN.png.
  gallery?: GalleryImage[]
  // Optional: a written report/paper (e.g. a lab report PDF) linked from the card and modal.
  // Drop it at /public/projects/<slug>/report.pdf.
  reportUrl?: string
  // TODO(jad): replace with your real deployed URL, or remove the field if not applicable.
  liveUrl: string | null
  // TODO(jad): replace with your real GitHub repo URL, or remove the field if not applicable.
  githubUrl: string | null
}

export const projects: Project[] = [
  {
    slug: 'sector-seven',
    title: 'Sector Seven',
    category: 'software',
    stackSummary: 'Formula 1 Telemetry & Data Hub',
    stack: ['JavaScript', 'React', 'Node.js', 'OpenF1 API'],
    description:
      'Built a real-time data hub streaming live F1 timing feeds via Server-Sent Events (SSE) by connecting to official WebSocket/SignalR streams. Integrated public APIs (OpenF1, Jolpica-F1) with a localized SQLite backend caching system to optimize performance and prevent rate-limiting downtime. Designed custom animated UI components to display interactive race schedules, historical data, and championship tables.',
    image: '/projects/sector-seven.png',
    previewGif: '/projects/sector-seven/preview.gif',
    gallery: [
      { src: '/projects/sector-seven/screenshot-01.png', caption: 'Home, live race status' },
      { src: '/projects/sector-seven/screenshot-02.png', caption: 'Home, hero' },
      { src: '/projects/sector-seven/screenshot-03.png', caption: 'Home, hero animation' },
      { src: '/projects/sector-seven/screenshot-04.png', caption: 'Home, quick actions' },
      { src: '/projects/sector-seven/screenshot-05.png', caption: 'Home, hero detail' },
      { src: '/projects/sector-seven/screenshot-06.png', caption: 'Home, session ticker' },
      { src: '/projects/sector-seven/screenshot-07.png', caption: 'Live status & race calendar preview' },
      { src: '/projects/sector-seven/screenshot-08.png', caption: 'Race calendar preview' },
      { src: '/projects/sector-seven/screenshot-09.png', caption: 'Driver standings' },
      { src: '/projects/sector-seven/screenshot-10.png', caption: 'Driver standings, full grid' },
      { src: '/projects/sector-seven/screenshot-11.png', caption: 'Standings detail' },
      { src: '/projects/sector-seven/screenshot-12.png', caption: 'Live timing, race leaderboard' },
      { src: '/projects/sector-seven/screenshot-13.png', caption: 'Live timing, sector splits' },
      { src: '/projects/sector-seven/screenshot-14.png', caption: 'Live timing detail' },
      { src: '/projects/sector-seven/screenshot-15.png', caption: '2026 season schedule' },
      { src: '/projects/sector-seven/screenshot-16.png', caption: 'Season schedule, full grid' },
      { src: '/projects/sector-seven/screenshot-17.png', caption: 'Race weekend, session breakdown' },
      { src: '/projects/sector-seven/screenshot-18.png', caption: 'Race weekend detail' },
      { src: '/projects/sector-seven/screenshot-19.png', caption: 'Session results' },
      { src: '/projects/sector-seven/screenshot-20.png', caption: 'Session results, full classification' },
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/jadkashmar/SectorSeven',
  },
  {
    slug: 'world-cup-2026',
    title: 'World Cup 2026 Live',
    category: 'software',
    stackSummary: 'Tournament Tracker',
    stack: ['TypeScript', 'React 19', 'Express', 'SVG'],
    description:
      'Full-stack tournament application featuring an interactive single-elimination knockout bracket with custom SVG connectors and automated winner propagation. Integrated the football-data.org API with an in-memory caching tier in Express to handle high-traffic requests and complex match states like extra time and penalty shootouts.',
    image: '/projects/world-cup-2026.png',
    previewGif: '/projects/world-cup-2026/preview.gif',
    gallery: [
      { src: '/projects/world-cup-2026/screenshot-01.png', caption: 'Matches, live status & stage filters' },
      { src: '/projects/world-cup-2026/screenshot-02.png', caption: 'Matches, full tournament schedule' },
      { src: '/projects/world-cup-2026/screenshot-03.png', caption: 'Stats, top goalscorers leaderboard' },
      { src: '/projects/world-cup-2026/screenshot-04.png', caption: 'Team detail, squad by position' },
      { src: '/projects/world-cup-2026/screenshot-05.png', caption: 'Bracket, knockout tree with penalty results' },
    ],
    liveUrl: 'https://world-cup-2026-live-304889800310.europe-west2.run.app/',
    githubUrl: null,
  },
  {
    slug: 'scarecr7w-clothing',
    title: 'SCARECR7W Clothing',
    category: 'software',
    stackSummary: 'Full-Stack E-Commerce Platform',
    stack: ['TypeScript', 'React 19', 'Node.js', 'SQLite', 'Firebase'],
    description:
      'End-to-end e-commerce platform with a secure checkout pipeline and real-time catalog search. Dual-tier persistence architecture using SQLite for fast local reads and Firebase Firestore for background sync, ensuring zero data loss. Administrative CMS with Role-Based Access Control (RBAC) and full-stack crash diagnostics via Sentry.',
    image: '/projects/scarecr7w-clothing.png',
    previewGif: '/projects/scarecr7w-clothing/preview.gif',
    gallery: [
      { src: '/projects/scarecr7w-clothing/screenshot-01.png', caption: 'Homepage, vault hero' },
      { src: '/projects/scarecr7w-clothing/screenshot-02.png', caption: 'Product detail, Crow Midnight tee' },
      { src: '/projects/scarecr7w-clothing/screenshot-03.png', caption: 'Sign in, vault access' },
      { src: '/projects/scarecr7w-clothing/screenshot-04.png', caption: 'Sign up, create account' },
      { src: '/projects/scarecr7w-clothing/screenshot-05.png', caption: 'Cart, scarecrow bag' },
      { src: '/projects/scarecr7w-clothing/screenshot-06.png', caption: 'Checkout, shipping & COD' },
      { src: '/projects/scarecr7w-clothing/screenshot-07.png', caption: 'Syndicate broadcasts & lore' },
      { src: '/projects/scarecr7w-clothing/screenshot-08.png', caption: 'Catalog, filtered tees listing' },
      { src: '/projects/scarecr7w-clothing/screenshot-09.png', caption: 'Directory navigation drawer' },
    ],
    liveUrl: 'https://scarecrow-clothing-304889800310.europe-west2.run.app/',
    githubUrl: null,
  },
  {
    slug: 'dormir',
    title: 'Dormir',
    category: 'software',
    stackSummary: 'Student Accommodation Platform',
    stack: ['Java', 'Spring Data JPA', 'SQL'],
    description:
      'Full-stack housing platform for Lebanese students to discover, compare, and manage university dormitories near major campuses (LAU, NDU, AUB, USJ). Profile-based filtering by university, max distance, and amenities (Wi-Fi, laundry, parking), plus a favorite-saving feature. Admin dashboard with full CRUD for listings.',
    image: '/projects/dormir.png',
    previewGif: '/projects/dormir/preview.gif',
    gallery: [
      { src: '/projects/dormir/screenshot-01.jpg', caption: 'Browse, all dorms' },
      { src: '/projects/dormir/screenshot-02.jpg', caption: 'Profile match recommendation' },
      { src: '/projects/dormir/screenshot-03.jpg', caption: 'Admin dashboard, dorm management CRUD' },
      { src: '/projects/dormir/screenshot-04.jpg', caption: 'Dorm detail, room types & amenities' },
    ],
    liveUrl: null,
    githubUrl: null,
  },
  {
    slug: 'smart-classroom-attendance',
    title: 'Smart Classroom Attendance System',
    category: 'hardware',
    stackSummary: 'FSM-Driven Occupancy System',
    stack: ['Quartus II', '74-Series ICs'],
    description:
      'Automated room occupancy system built around a Mealy-type FSM, a 5-bit synchronous up/down counter (tracking 0-29 students), and a BCD countdown session timer. Optimized hardware footprint using JK flip-flops and native Q\' output pins to reduce chip count. Validated via K-map derivations, Quartus II simulation, and physical breadboard prototyping.',
    image: '/projects/smart-classroom-attendance.png',
    reportUrl: '/projects/smart-classroom-attendance/report.pdf',
    liveUrl: null,
    githubUrl: null,
  },
]
