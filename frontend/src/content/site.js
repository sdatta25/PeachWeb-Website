// All site copy and data lives here, so content edits never touch layout code.
// Everything below comes from the previous version of the site. Anything we could not
// source is marked PLACEHOLDER and listed in docs/redesign-audit.md.

export const EMAIL = 'peachwebdevelopment@gmail.com'
export const LOCATION = 'Alpharetta & north Atlanta, GA'

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/peachwebdev/' },
  { label: 'Instagram', href: 'https://www.instagram.com/peachweb.dev/' },
]

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Team', href: '#team' },
]

// Live sites built by the founders. Screenshots are captured from the live URLs
// (public/work/*). `type` is the client type; `line` is the one-line description.
export const projects = [
  {
    slug: 'sfe-foundry',
    name: 'SFE Foundry',
    url: 'https://sfefoundry.vercel.app',
    type: 'Student league',
    line: 'Club site and member portal for a student-led innovation league.',
    builder: 'Souren',
  },
  {
    slug: 'alpharetta-robotics',
    name: 'Alpharetta Robotics',
    url: 'https://alpharettarobotics.vercel.app',
    type: 'School team',
    line: 'Team site for the Alpharetta High School robotics program, built to bring in members and sponsors.',
    builder: 'Adwait',
  },
  {
    slug: 'finance-for-movement',
    name: 'Finance For Movement',
    url: 'https://financeformovement.org',
    type: 'Nonprofit',
    line: 'Site for a youth-led 501(c)(3) running financial literacy workshops in Gwinnett County.',
    builder: 'Souren',
  },
  {
    slug: 'sabrine-math',
    name: 'Sabrine Math',
    url: 'https://sabrinemath.vercel.app',
    type: 'Content creator',
    line: 'Site for content creator Sabrine Mezali, with a book to sell and free resources to share.',
    builder: 'Souren',
  },
  {
    slug: 'stem-simplified',
    name: 'STEM Simplified',
    url: 'https://thestemsimplified.vercel.app',
    type: 'Education initiative',
    line: 'Home for a STEM education initiative and its explainer videos.',
    builder: 'Adwait',
  },
  {
    slug: 'ahs-chess',
    name: 'AHS Chess Club',
    url: 'https://ahschessclub.vercel.app',
    type: 'School club',
    line: 'High school chess club site with meeting times and resources.',
    builder: 'Adwait',
  },
]

export const services = [
  {
    name: 'Website',
    summary:
      "A site designed around your business rather than a template with your logo dropped in. It covers what customers actually look for: what you offer, where you are, when you're open, and how to reach you.",
    includes: [
      'Pages for your services or menu, your story, and contact details',
      'Hours, location, and photos where people expect them',
      'Laid out for phones first, then tablets and desktops',
      'Launched by us, with a walkthrough for you',
    ],
  },
  {
    name: 'AI chatbot',
    summary:
      'An assistant on your site that answers common questions from your own information at any hour, and takes down contact details from people who want a follow-up.',
    includes: [
      'Set up with your hours, services, and common questions',
      'Points visitors to the right page or contact form',
      'Peachy, in the corner of this page, is one we built for ourselves',
    ],
  },
  {
    name: 'Care plan',
    summary:
      'We handle updates and fixes after the site goes live, and show you how to make simple edits yourself.',
    includes: [
      'Updates and fixes after launch',
      'A walkthrough so you can edit the basics',
      'Room to add a menu page, an events calendar, or a chatbot later without starting over',
    ],
  },
]

export const steps = [
  {
    name: 'Discovery call',
    text: 'You tell us what your business does and who you want to reach. We ask about the pages and features you need.',
  },
  {
    name: 'First draft',
    text: 'We send back a plan with pages, features, and a timeline, then design and build a first version.',
  },
  {
    name: 'Feedback',
    text: 'We share progress as we go, so you react to real pages rather than a description of them.',
  },
  {
    name: 'Launch',
    text: 'We test on phones and desktops and put the site live.',
  },
  {
    name: 'Handoff',
    text: 'We walk you through the site and show you how to make simple edits. Support continues after launch.',
  },
]

export const founders = [
  {
    name: 'Souren Datta',
    role: 'Co-founder',
    photo: '/founders/souren.jpg',
    linkedin: 'https://www.linkedin.com/in/sourendatta/',
    bio: 'Started building sites for nonprofits and school groups and got hooked on the moment one goes live, when people can finally find an organization that was invisible the week before. Co-founded PeachWeb so the small businesses around Atlanta could have that too: a site they are proud to hand someone, without agency prices.',
    work: ['PeachWeb', 'Finance For Movement', 'SFE Foundry', 'AHS YEFA', 'Sabrine Mezali (content creator)'],
  },
  {
    name: 'Adwait Dhaneshwar',
    role: 'Co-founder',
    photo: '/founders/adwait.jpg',
    linkedin: 'https://www.linkedin.com/in/adwaitdhaneshwar/',
    bio: 'Fell for web development building pages for school organizations, where a clear, well-made site changed how many people actually showed up. Co-founded PeachWeb to bring that same lift to local Atlanta businesses still getting by on an outdated page, or none at all.',
    work: ['STEM Simplified', 'AHS Robotics', 'AHS Chess Club'],
  },
]

// The only price the previous site published was "Requests start under $500".
// PLACEHOLDER: `price: null` renders "Quoted after a call" in production and a visible
// placeholder flag in development. Fill in real numbers when you have them.
export const pricing = [
  {
    name: 'Website',
    price: 'From under $500', // published on the previous site
    note: 'Most small-business sites',
    includes: ['Custom design and build', 'Phone-first layout', 'Launch and walkthrough'],
  },
  {
    name: 'Website + AI chatbot',
    price: null, // PLACEHOLDER
    note: 'For businesses fielding the same questions every day',
    includes: ['Everything in Website', 'Chatbot trained on your information', 'Lead capture to your inbox'],
  },
  {
    name: 'Care plan',
    price: null, // PLACEHOLDER
    note: 'After launch',
    includes: ['Updates and fixes', 'Help with edits', 'Additions as you grow'],
  },
]

// Quote estimator. The output ranges are the budget brackets the previous request form
// offered. PLACEHOLDER: how answers map onto a bracket is our guess; adjust `score` below.
export const estimator = {
  brackets: ['Under $500', '$500–$1,500', '$1,500–$5,000', '$5,000+'],
  types: ['Restaurant or café', 'Shop or retail', 'Service provider', 'Nonprofit or community group', 'Something else'],
  pages: [
    { label: '1–3 pages', hint: 'Home, about, contact', score: 0 },
    { label: '4–7 pages', hint: 'Plus services, menu, gallery', score: 1 },
    { label: '8+ pages', hint: 'Several services or locations', score: 2 },
  ],
  extras: [
    { id: 'chatbot', label: 'AI chatbot', hint: 'Answers questions around the clock', score: 1 },
    { id: 'booking', label: 'Online booking', hint: 'Appointments or reservations', score: 0.5 },
    { id: 'store', label: 'Online ordering or store', hint: 'Sell products or take orders', score: 1 },
    { id: 'care', label: 'Care plan', hint: 'Updates after launch', score: 0 },
  ],
}

export const faqs = [
  {
    q: 'How much does a website cost?',
    a: "Most projects start under $500. We quote once we understand what you need, and we'll tell you plainly what fits in your budget. The estimator above gives you a rough range.",
  },
  {
    q: 'What is the free mockup?',
    // PLACEHOLDER: confirm what the mockup includes.
    a: "A first design of your homepage, made from what you tell us about your business, so you can see the direction before you commit to anything.",
  },
  {
    q: 'How long does it take?',
    a: 'It depends on the size of the site. After the discovery call we send you a plan with the pages, the features, and a timeline, so you know before we start.',
  },
  {
    q: 'Who will I be working with?',
    a: "The two of us. There's no account manager in between: whoever is on your planning call is designing and writing your site, so feedback doesn't get lost in a handoff.",
  },
  {
    q: 'Can I update the site myself?',
    a: "Yes. We show you how to make simple edits yourself, and we're around after launch for updates and fixes.",
  },
  {
    q: 'What does an AI chatbot actually do?',
    a: 'It answers common questions from your own information (hours, services, pricing, directions) at any hour, points people to the right page, and takes down contact details from anyone who wants a follow-up.',
  },
  {
    q: 'Have you built sites for businesses like mine?',
    a: "Our live work so far is for nonprofits, school organizations, and a content creator, and every one of those sites is linked above. We started PeachWeb to do the same work for local businesses around Atlanta.",
  },
]
