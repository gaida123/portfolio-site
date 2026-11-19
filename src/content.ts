// All site text lives here. Facts come from resume.md; edit this file, not the components.

export const site = {
  name: 'Gaida Amzar',
  firstName: 'Gaida',
  email: 'mgamzar@gmail.com',
  // Rotates in the header status slot (top-right). Keep phrases short — one line.
  locationLines: [
    'In Vancouver, Canada right now...',
    'Shipping a side project...',
    'Craving Bali beaches and nasi campur...',
    'In a late-night music session...',
    'Hitting the gym...',
    'Writing well-documented APIs...',
  ],
  github: 'https://github.com/gaida123',
  linkedin: 'https://linkedin.com/in/gaida-amzar',
}

export const nav = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/work', label: 'Work' },
  { path: '/projects', label: 'Projects' },
  { path: '/community', label: 'Community' },
]

export type CtaTone = 'projects' | 'work' | 'community' | 'about'
export type PageCta = { to: string; label: string; tone: CtaTone }

const CTA_PROJECTS: PageCta = { to: '/projects', label: 'See my projects', tone: 'projects' }
const CTA_WORK: PageCta = { to: '/work', label: 'View my experience', tone: 'work' }
const CTA_COMMUNITY: PageCta = { to: '/community', label: 'Explore community', tone: 'community' }
const CTA_ABOUT: PageCta = { to: '/about', label: 'Get to know me', tone: 'about' }

/** Order: projects, work, community — but replace the current page's slot with About. */
export function pageCtas(current: 'about' | 'projects' | 'work' | 'community'): PageCta[] {
  const row = [CTA_PROJECTS, CTA_WORK, CTA_COMMUNITY] as PageCta[]
  if (current === 'about') return row
  return row.map((c) => (c.tone === current ? CTA_ABOUT : c))
}

export const prompts = {
  menu: 'Menu',
  close: 'Close',
  move: 'Move',
  open: 'Open',
  back: 'Back',
  email: `Email ${site.firstName}`,
}

export const search = {
  placeholder: 'Search',
  open: 'Open search',
  close: 'Close',
  suggested: 'Suggested',
  results: 'Top results',
  none: 'No results for',
  tryInstead: 'Try one of these:',
  hintMove: 'Move',
  hintOpen: 'Open',
  pageDetail: 'Go to page',
  // Shown before anything is typed. Each must match a title in the search index exactly.
  suggestions: ['Etika', 'Work', 'About', `Email ${site.firstName}`],
  // Extra words that should find an entry (key = the entry's title).
  aliases: {
    Home: 'explore reading start',
    About: 'bio skills tech stack languages contact resume',
    Work: 'experience jobs awards career',
    Projects: 'hackathons portfolio builds',
    Community: 'clubs teams involvement',
    'Gado-Gado Indonesian Student Association of UBC': 'GISAU',
    'UBC Science Undergraduate Society': 'SUS Hack The Coast',
  } as Record<string, string>,
  kinds: {
    page: 'Page',
    project: 'Project',
    work: 'Work',
    award: 'Award',
    community: 'Community',
    skill: 'Skill',
    link: 'Link',
    reading: 'Reading',
  },
}

export type Reading = {
  source: string
  title: string
  href: string
}

export const home = {
  explore: 'Explore',
  hero: { title: ['GET TO', 'KNOW ME!'] },
  work: ['WORK', 'EXPERIENCE'],
  projects: ['PROJECTS'],
  community: ['COMMUNITY'],
  readingLabel: 'Now reading',
  // Text-only cards. To update: swap source, title, href.
  reading: [
    {
      source: 'Claude',
      title: 'Introducing Claude Whiteboards, Sheets, and Data',
      href: 'https://claude.com/resources/articles/sheets-whiteboards-data',
    },
    {
      source: 'CNBC',
      title: 'How AI is redefining Wall Street jobs',
      href: 'https://www.cnbc.com/2026/10/02/ai-redefining-wall-street-jobs.html',
    },
    {
      source: 'CNBC Make It',
      title: 'How to diversify your portfolio amid AI-bubble fears',
      href: 'https://www.cnbc.com/make-it/2026/11/18/how-to-diversify-your-portfolio-amid-ai-bubble-fears.html',
    },
    {
      source: 'BBC',
      title: "Trying Tourette's device was the best day of my life",
      href: 'https://www.bbc.com/news/articles/cmp3g3e5q4zxo',
    },
  ] satisfies Reading[] as Reading[],
}

// In body text, **double asterisks** mark the highlighted (bold, bright) words.

export const about = {
  label: 'About',
  subtitle: 'A developer who builds web platforms, e-commerce systems and tools that real people use.',
  name: site.name,
  photoAlt: `Portrait of ${site.name}`,
  facts: [
    { label: 'Now', value: 'Computer Science @ UBC' },
    { label: 'Based', value: 'Vancouver, BC' },
    { label: 'Languages', value: 'Java, Python, TypeScript, JavaScript, PHP, SQL, HTML/CSS, R' },
  ],
  elsewhereLabel: 'Elsewhere',
  elsewhere: [
    { label: 'GitHub', href: site.github },
    { label: 'LinkedIn', href: site.linkedin },
    { label: 'Instagram', href: 'https://instagram.com/gaida.amz' }, // from the Figma draft; not in resume.md
    { label: 'Email', href: `mailto:${site.email}` },
  ],
  stackLabel: 'Tech stack',
  stack: [
    { group: 'Frontend', tools: [{ name: 'React' }, { name: 'React Native' }, { name: 'Next.js' }, { name: 'TypeScript' }] },
    { group: 'Backend', tools: [{ name: 'Firebase' }, { name: 'Node.js' }, { name: 'Express' }, { name: 'PostgreSQL' }] },
    { group: 'Tools & DevOps', tools: [{ name: 'Git & GitHub' }, { name: 'Docker' }] },
    // From the Figma draft; resume.md lists no design tools.
    { group: 'Design & Workflow', tools: [{ name: 'Figma' }, { name: 'Notion' }] },
  ] as { group: string; tools: { name: string }[] }[],
}

export const work = {
  label: 'Work experience',
  jobs: [
    {
      company: 'Didik Elektronik',
      role: 'Web Developer (Freelance)',
      dates: 'Dec 2024 – Aug 2025',
      place: 'Remote from Bali',
      logo: '/assets/logo-didik.webp',
      summary:
        'Built a **full-stack e-commerce platform** with multi-courier shipping, and set up CI/CD that cut deploys from **5 minutes to 30 seconds**.',
    },
    {
      company: 'PT. Asia Garment Internasional',
      role: 'Full-Stack Web Developer',
      dates: 'Aug 2024 – Jul 2025',
      place: 'Bali',
      logo: '/assets/logo-sarong.webp', // Sarong Wholesale, the company's brand
      summary:
        'Solo-built a production **B2B wholesale e-commerce platform**, and cut order errors **30%** with an ACID-compliant checkout.',
    },
  ],
  awardsLabel: 'Awards',
  awardsSubtitle: 'Hackathons, competitions and scholarships.',
  awards: [
    { title: '1st Place', detail: 'UBC BizTech Product+ 2026 · Rhume', year: '2026' },
    { title: '3rd Place', detail: 'StormHacks 2026 · Etika', year: '2026', slug: 'etika' },
    { title: 'Honorable Mention (Google Track)', detail: 'ProduHacks 2026 · PolterGuide', year: '2026', slug: 'polterguide' },
    { title: 'Outstanding International Student Award', detail: 'UBC · $10,000 for first year', year: '2025' },
  ] as { title: string; detail: string; year: string; slug?: string }[], // slug: has a detail page at /projects/<slug>
}

export type Project = {
  name: string
  meta: string
  summary: string
  tags: string
  slug?: string // has a detail page at /projects/<slug> (see projectDetails); "Read more" goes there
  image?: { src: string; width: string; height: string; left?: string } // crop inside the 360×399 panel
}

export const projects = {
  label: 'Projects',
  readMore: 'Read more',
  items: [
    {
      name: 'Etika',
      meta: 'Web / AI · 2026 · 3rd Place, StormHacks 2026',
      summary:
        'Tells new BC sole proprietors which registrations, taxes and hiring rules apply to them. Three AI agents check official sources, cite every claim and give next steps.',
      tags: 'Python · FastAPI · Next.js · TypeScript · TiDB Cloud · Gemini API · RAG',
      slug: 'etika',
      image: { src: '/assets/project-etika.webp', width: '201.78%', height: '100%', left: '-50.89%' },
    },
    {
      name: 'PolterGuide',
      meta: 'Desktop / AI · 2026 · Honorable Mention (Google Track), ProduHacks 2026',
      summary:
        'Agentic AI desktop co-pilot that navigates any UI by voice, using screenshot-based spatial reasoning. Four agents run in parallel and stream steps over WebSockets, and PDF help docs become live onboarding flows.',
      tags: 'Electron · FastAPI · WebSockets · Gemini 1.5 Flash',
      slug: 'polterguide',
      image: { src: '/assets/polterguide-dashboard.webp', width: '196.77%', height: '100%', left: '-35%' },
    },
    {
      name: 'Lockout',
      slug: 'lockout',
      meta: 'Mobile · 2026 · nwHacks 2026',
      summary:
        'Social accountability app where friends start timed focus sessions, post before-and-after proof photos and build streaks. Gemini Vision scores disputed sessions, and votes feed a real-time leaderboard.',
      tags: 'React Native · Expo · TypeScript · Firebase · Gemini 2.0 Flash Vision',
      image: { src: '/assets/lockout-session.webp', width: '100%', height: '135.34%' },
    },
    {
      // TODO: add a link if there is one.
      name: 'Rhume',
      meta: 'Product · 2026 · 1st Place, UBC BizTech Product+ 2026',
      summary:
        "An SAP Joule concept that uses wastewater flu data to move Shoppers Drug Mart medicine between regions before demand spikes. In a simulated 2023-24 flu season it cut empty-shelf days for children's fever and cold medicine by 76%.",
      tags: 'Next.js · TypeScript · Claude',
      image: { src: '/assets/project-rhume.png', width: '197%', height: '100%', left: '-8.5%' },
    },
  ] as Project[],
}

// ---------- Project detail pages (/projects/<slug>). Text is from each project's Devpost page. ----------

export type ProjectDetail = {
  tagline: string
  summary: string
  facts: { label: string; value: string }[]
  tags: string[]
  github: string
  devpost: string
  highlights: string[]
  cover: string // sidebar image
  thumb?: string // "up next" image; defaults to the cover
  media: { src: string; alt: string }[]
  // In blocks, a string is a paragraph and a list of strings is a bullet list.
  sections: { title: string; blocks: (string | string[])[] }[]
}

export const projectPage = {
  about: 'About this project',
  highlights: 'Highlights',
  github: 'GitHub',
  devpost: 'Devpost',
  next: 'See the next project',
  prev: 'Previous image',
  nextImage: 'Next image',
}

const shots = (slug: string, alts: string[]) =>
  alts.map((alt, i) => ({ src: `/assets/projects/${slug}-${i + 1}.webp`, alt }))

export const projectDetails: Record<string, ProjectDetail> = {
  etika: {
    tagline: 'Legal Team, Decoded.',
    summary:
      'Etika tells new BC sole proprietors which registrations, taxes and hiring rules apply to them. Three AI agents check official sources, cite every claim and give next steps.',
    facts: [
      { label: 'Recognition', value: '3rd Place, StormHacks 2026' },
      { label: 'Year', value: '2026' },
      { label: 'Type', value: 'Web / AI' },
      { label: 'Team', value: 'Gaida Amzar, Evan P., Alfredo Austin, Clementie Freya' },
    ],
    tags: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'TiDB Cloud', 'Gemini API', 'RAG'],
    github: 'https://github.com/gaida123/etika',
    devpost: 'https://devpost.com/software/etika',
    highlights: [
      '240 passages from 19 official BC and CRA sources',
      'Same facts, same score across 13 requirements',
      'Gemini calls cut from 8–15 to 3 per assessment',
      'Validated by 132 automated tests',
    ],
    cover: '/assets/projects/etika-2.webp',
    media: shots('etika', [
      'Etika landing page: know which rules apply to your small business',
      'Etika hero section',
      'See what may apply',
      'From questions to a plan',
      'The three specialist agents',
      'The intake questions',
    ]),
    sections: [
      {
        title: 'Why we built it',
        blocks: [
          'A friend spent a whole weekend trying to figure out if her candle business needed to register for PST. Four government sites, a Reddit thread, and a phone call later, the answer was “not yet, but close.” Compliance info isn’t missing, it’s fragmented. BizPaL lists permits that may apply, Ownr just registers a name, and an accountant only knows what you tell them. Nobody says what applies to you, why, and what to do next, and the thresholds move underneath you the whole time.',
        ],
      },
      {
        title: 'What it does',
        blocks: [
          'Etika is a compliance navigator for new Vancouver sole proprietors. You answer a few questions and confirm the facts Etika understood. Three specialist AI agents (Registration, Tax, and Employer, each with its own persona) then check your situation against official government sources. You get a readiness score, plain-English explanations with the official government source behind each one, and a Now/Next/Later plan where every item links to the real form.',
          'Mention a change in chat, like “I’m hiring next month,” and Etika proposes a fact update. Confirm it and the assessment re-runs live: the employer obligations (WorkSafeBC, CRA payroll account, minimum wage, pay statements, payroll records) move from Later to Now, and the score updates with them.',
        ],
      },
      {
        title: 'How we built it',
        blocks: [
          [
            'Backend: Python 3.11, FastAPI, Pydantic v2',
            'Database: TiDB Cloud, holding vectors and relational data in one store',
            'AI: Gemini Flash for intake parsing, agent explanations and chat; gemini-embedding-001 for retrieval',
            'Frontend: Next.js, TypeScript, Tailwind',
          ],
          'The core rule is code decides, Gemini explains. Every profile fact is stored as a value plus a confirmed flag, and an unknown fact is never treated as “no.” Skip a question and the requirement becomes “Needs your input,” not a guess. A deterministic engine matches confirmed facts against a reviewed registry of requirements, each tagged now, trigger or recommendation, with dependencies (business number before GST or payroll). Tax calculators run the real tests: PST’s rolling 12-month $10,000 small-seller line plus the no-premises condition, GST’s $30,000 threshold, and a straight-line projection of when you’ll cross each one. The score and the order of next steps come from the same code, never from the model.',
          'The knowledge base is ours. We collected official BC Registries, CRA, WorkSafeBC, BC Laws and City of Vancouver pages by hand, split them by legal section, embedded them, and stored them in TiDB with metadata for authority, jurisdiction, requirement and retrieval date. Every chunk has a review status, and only approved chunks can be retrieved. Retrieval is filtered by requirement and jurisdiction, and returns “insufficient evidence” instead of a weak match.',
          'Each agent owns one area of the registry, receives only the evidence retrieved for its requirements, and returns structured findings with citations. We then validate every citation against what was actually retrieved in that run and drop anything that wasn’t. The walk-through screen shows each agent’s progress live.',
        ],
      },
      {
        title: 'Challenges',
        blocks: [
          'The law was harder than the code. PST’s exemption depends on a rolling window, not a calendar year, so one good month can flip your status, and it also depends on whether you have established premises, which market sales make ambiguous. We flag those cases as gray areas for a professional instead of resolving them.',
          'Building the knowledge base from scratch was the other big job. The hardest part wasn’t collecting pages, it was narrowing each agent enough that it could only answer from its evidence, so Gemini never filled a gap with something that sounded right but wasn’t sourced.',
          'Three parallel agents also blew through Gemini’s rate limit fast. We rebuilt the pipeline so code prefetches all evidence up front and each agent makes exactly one call, cutting Gemini usage from 8 to 15 requests per assessment down to 3.',
        ],
      },
      {
        title: 'What we’re proud of',
        blocks: [
          'The RAG pipeline: we built the whole source-to-citation process ourselves, from scraping and reviewing official sources to chunking, embedding, and gating retrieval so an agent can only cite evidence it actually pulled in that run. Because status comes from code, the same facts always produce the same score, and the model can’t talk its way into a different answer. And the hiring moment, one sentence in chat and several legal obligations switching on live, is the best 10 seconds of the demo.',
        ],
      },
      {
        title: 'What’s next',
        blocks: [
          'Pre-filled government forms generated from the saved profile, auto-generated policy documents (privacy, refund, workplace), a renewal and deadline calendar, and expansion beyond Vancouver sole proprietors to other BC cities and business structures.',
        ],
      },
    ],
  },

  polterguide: {
    tagline: 'Zero Training. Instant Proficiency.',
    summary:
      'PolterGuide is an agentic AI co-pilot that runs as an overlay on any app. A Ghost Cursor navigates the UI for you, driven by a voice command or chat message.',
    facts: [
      { label: 'Recognition', value: 'Honorable Mention (Google Track), ProduHacks 2026' },
      { label: 'Year', value: '2026' },
      { label: 'Type', value: 'Desktop / AI' },
      { label: 'Role', value: 'Technical Lead' },
      { label: 'Team', value: 'Gaida Amzar, Emily Razali, Jefferson Abraham' },
    ],
    tags: ['React 19', 'Vite', 'Tailwind CSS', 'Electron', 'FastAPI', 'WebSockets', 'Fetch.ai uAgents', 'Google GenAI'],
    github: 'https://github.com/gaida123/polter-guide',
    devpost: 'https://devpost.com/software/polterguide',
    highlights: [
      'A Ghost Cursor that navigates the UI and executes actions in real time',
      'Uploaded PDF help docs become live onboarding flows',
      'Four agents in parallel: Knowledge, Vision, Context and Completion',
      'Sub-100ms step streaming over WebSockets',
    ],
    cover: '/assets/projects/polterguide-1.webp',
    thumb: '/assets/projects/polterguide-cover.webp',
    media: shots('polterguide', [
      'PolterGuide admin dashboard listing onboarding flows',
      'Creating a new flow by uploading a PDF',
      'Choosing an onboarding guide in the overlay',
      'The Ghost Cursor guiding a first-day setup page',
      'Chatting with the co-pilot mid-task',
      'The overlay confirming every step is complete',
    ]),
    sections: [
      {
        title: 'Why we built it',
        blocks: [
          'Modern B2B SaaS dashboards look like spaceship control panels. Companies bleed up to 30% of new users to onboarding friction. Customer Success Managers burn half their week playing human GPS on Zoom. Static PDFs get ignored. Great software shouldn’t come with homework.',
        ],
      },
      {
        title: 'What it does',
        blocks: [
          'PolterGuide is an Electron desktop app that acts as an agentic AI co-pilot, running as a transparent overlay on top of any application. It replaces manual tutorials with a Ghost Cursor: an AI-controlled cursor that physically navigates the UI and executes actions in real time, driven by a simple voice command or chat message.',
          'Administrators upload their existing help documents (PDFs) to the dashboard. That’s it. PolterGuide’s AI parses the text and instantly generates a live, deployable onboarding flow. No re-writing docs. No recording tutorials. No Zoom calls. Less reading. More doing.',
          'Users can also chat directly with the co-pilot mid-task, asking questions in plain language and getting spoken, contextual answers without ever leaving the app.',
        ],
      },
      {
        title: 'How we built it',
        blocks: [
          'The frontend is built with React 19, Vite, and Tailwind CSS v4, with Framer Motion driving the Ghost Cursor animations and the Web Speech API handling voice input. This runs inside an Electron desktop layer that renders a transparent cross-window overlay on top of any app.',
          'The backend is Python 3 and FastAPI, using WebSockets for sub-100ms real-time step streaming. PyPDF and Pillow handle document parsing, with state routed through Firebase. ElevenLabs provides spoken voice responses.',
          'The AI layer is built on the Fetch.ai uAgents framework, with four agents running in parallel. The Knowledge Agent uses dense vector embeddings to retrieve the right workflow from uploaded PDFs. The Vision Agent uses Google GenAI to parse the DOM and extract precise target coordinates to drive the Ghost Cursor. The Context Agent maintains task state across steps. The Completion Agent synthesizes the final instructions and streams them back.',
        ],
      },
      {
        title: 'Challenges',
        blocks: [
          'Bridging the asynchronous event loops of Fetch.ai’s agents with a synchronous React frontend required building a highly resilient WebSocket layer from scratch. Getting the Vision Agent to consistently map visual UI elements to exact numerical coordinates was the other major hurdle. It took heavy prompt engineering and retry logic to make cursor movements reliably accurate.',
        ],
      },
      {
        title: 'What we’re proud of',
        blocks: [
          'Watching the Ghost Cursor autonomously navigate a complex dashboard, driven entirely by a parsed PDF and a single voice command, was a genuine breakthrough moment. We also managed to make an incredibly complex multi-agent backend feel completely invisible to the end user.',
        ],
      },
      {
        title: 'What’s next',
        blocks: [
          'We’re building toward proactive intervention: letting the Vision Agent detect rage-clicking and offer help before the user even asks. Beyond that, we want to ship a lightweight embeddable SDK so any SaaS product can drop PolterGuide into their own app natively, without requiring a desktop install. We’re also expanding the live AI conversation layer so users can ask follow-up questions mid-task and get real-time spoken answers, making the co-pilot feel less like a tool and more like a teammate.',
        ],
      },
    ],
  },

  lockout: {
    // TODO: no tagline on Devpost; this line is a quote from the write-up. Replace it if you have a better one.
    tagline: 'It makes lying more effort than working.',
    summary:
      'Lockout is a social accountability app that turns focus into a shared experience: start a timed lock-in with a proof photo, finish with a second one, and let a friend verify it.',
    facts: [
      { label: 'Event', value: 'nwHacks 2026' },
      { label: 'Year', value: '2026' },
      { label: 'Type', value: 'Mobile' },
      { label: 'Team', value: 'Gaida Amzar, Keanan Wongso, Michele Cavezza, Felicia Liem' },
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'Gemini Vision'],
    github: 'https://github.com/keananwongso/projectlocked',
    devpost: 'https://devpost.com/software/lockedout-5nge0b',
    highlights: [
      'A proof photo at the start and the end of every session',
      'One friend as an accountability witness, with a yes-or-no check',
      'Challenged sessions are verified with Gemini Vision',
      'A shared feed for visibility, not for chatting or flexing',
    ],
    cover: '/assets/projects/lockout-1.webp',
    media: shots('lockout', [
      'Starting a lock-in: proof photo, category, duration and a witness',
      'A friend asked whether the session really happened',
      'The friend activity feed',
      'A challenged user proving they are locked in',
      'A session verified by AI',
      'The friends leaderboard',
    ]),
    sections: [
      {
        title: 'Inspiration',
        blocks: [
          'By natural laws, humans are wired to seek social presence and validation. But anything in excess can turn destructive.',
          'Today, that instinct is constantly exploited through doomscrolling and endless digital stimulation. The problem isn’t that students want validation, it’s that modern platforms redirect it toward distraction instead of focus and well-being.',
          'We approached this as a student well-being problem, not a productivity one. Instead of fighting this natural instinct, we asked a different question: what if social validation could be redirected toward doing the things that actually matter? That question led to Lockout.',
        ],
      },
      {
        title: 'What it does',
        blocks: [
          'Lockout is a social accountability app that turns focus into a shared experience.',
          'Users start a lock-in session by taking a quick photo as proof, adding what they’re working on, choosing a category and duration, and optionally selecting one friend as an accountability witness. A timer then runs during the session, creating a clear boundary between focus and distraction.',
          'At the end of the session, users submit a second photo as proof of consistency. The completed lock-in appears in a shared feed, not for chatting or flexing, but for visibility and validation.',
          'If a user selects an accountability friend, that friend receives a simple yes-or-no notification to verify the session. If the session is challenged, the user must provide instant proof, which is then verified using AI (through Gemini Vision) to ensure it matches their claim.',
        ],
      },
      {
        title: 'Why it matters for wellbeing',
        blocks: [
          'Lockout is not about proving productivity. It’s about reducing friction, isolation, and guilt around starting work.',
          'By reframing focus as something social but non-competitive, Lockout supports mental wellbeing by helping users act on their intentions. Instead of letting unfinished tasks linger mentally, Lockout externalizes commitment into a short, bounded session. This clears cognitive load, reduces avoidance, and replaces guilt with visible effort.',
          'In short, Lockout doesn’t optimize productivity. It helps people do the things they already know they need to do. As we like to say: Lockout doesn’t prove productivity. It makes lying more effort than working.',
        ],
      },
      {
        title: 'How we built it',
        blocks: [
          'Lockout was designed mobile-first to match how students actually work.',
          ['Frontend: React + Expo', 'Backend: Firebase', 'Language: TypeScript'],
          'Every interaction was designed to be fast and low-pressure. Our focus wasn’t feature density, but clarity, speed, and emotional comfort.',
        ],
      },
      {
        title: 'Challenges we faced',
        blocks: [
          'The hardest challenge was more philosophical than it was technical.',
          'Designing accountability without stress required us to question many common productivity patterns. Several familiar mechanics were deliberately excluded because they harm long-term wellbeing. Every feature had to answer one question: does this reduce pressure, or add to it?',
        ],
      },
      {
        title: 'What we learned',
        blocks: [
          'We learned that small, well-designed social signals can meaningfully change behavior without overwhelming users.',
          'More importantly, we learned that people don’t need more motivation tools. They need systems that make starting feel lighter and less lonely. In general, people know what they need to do. The real challenge is actually doing it.',
        ],
      },
      {
        title: 'What’s next',
        blocks: [
          'Our next step is to test Lockout in a real university setting.',
          'We plan to pilot the app with students to observe how it fits into day-to-day academic life, gather feedback on social accountability dynamics, and refine the experience around wellbeing rather than pressure.',
          'From there, our goal is to iterate based on real usage and work toward a broader campus launch. Lockout is meant to grow slowly and intentionally, shaped by how students actually use it, not by assumptions about productivity.',
        ],
      },
    ],
  },
}

export type Stop = {
  name: string
  role: string
  dates: string
  blurb: string
  photo?: string // optional; without one the cover shows the name in display type
  photoPosition?: string // CSS object-position when the crop needs a nudge
}

export const community = {
  label: 'Community',
  stops: [
    {
      name: 'UBC Launch Pad',
      role: 'Software Developer',
      dates: 'Oct 2026 — Now',
      blurb:
        "Building the **measurement probe** for an internet connectivity research platform with Dr. Nguyen Phong Hoang's lab.",
      photo: '/assets/community-launchpad.png',
      photoPosition: '0% center', // nudged 50% left from default 50%
    },
    {
      name: 'UBC Trading Group',
      role: 'Quantitative Developer',
      dates: 'Oct 2026 — Now',
      blurb:
        "Backend for **Sauder's first trading competition**: moved team scoring to PostgreSQL and closed a leak of unreleased market news.",
      photo: '/assets/community-trading.avif',
    },
    {
      name: 'UBC Science Undergraduate Society',
      role: 'Hackathon Committee, Engagement Subteam',
      dates: 'Jun — Nov 2026',
      blurb: 'Designed workshops and side events for **Hack The Coast**, a 150-person hackathon planned for Feb 2027.',
      photo: '/assets/community-sus.png',
      photoPosition: '62% center', // nudged 15% left from default 50%
    },
    {
      name: 'Gado-Gado Indonesian Student Association of UBC',
      role: 'Lead Web Developer',
      dates: 'Nov 2025 — Now',
      blurb:
        'Contributed to an **event registration platform for 300+ students**, with academic-year scoping in PostgreSQL and access locked down with **JWT + RLS**.',
      photo: '/assets/community-gisau.jpg',
    },
  ] as Stop[],
}
