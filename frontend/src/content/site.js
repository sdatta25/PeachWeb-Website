// All site copy and data lives here, so content edits never touch layout code.
// Everything below comes from the previous version of the site. Anything we could not
// source is marked PLACEHOLDER and listed in docs/redesign-audit.md.

export const EMAIL = 'peachwebdevelopment@gmail.com'
export const LOCATION = 'Alpharetta & north Atlanta, GA'

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/peachwebdev/' },
  { label: 'Instagram', href: 'https://www.instagram.com/peachweb.dev/' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1MNbFZgaRN/?mibextid=wwXIfr' },
]

// One entry per page (see vite.config.js for the page list). Home is reached through the logo.
export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Use cases', href: '/use-cases' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const USE_CASES_PDF = '/peachweb-use-cases.pdf'

// What a site looks like for each kind of business. `flow` is the path a customer's request
// takes, left to right. `example` points at a live site of ours only where one really exists.
// This list also feeds the downloadable PDF (scripts/make-use-cases-pdf.mjs).
export const useCases = [
  {
    id: 'restaurant',
    name: 'Restaurants and cafés',
    problem: 'People check the menu and hours on their phone before they decide where to eat. If they cannot find either in a few seconds, they pick somewhere else.',
    build: [
      'Menu, hours, and location on the first screen, laid out for phones',
      'A catering or large-order request form that asks for the date, headcount, and budget',
      'A chatbot that answers "are you open?", "do you have vegan options?", and "do you cater?" from your own information',
    ],
    flow: ['Customer fills in the order form', 'Our server checks and records it', 'You get an email with tap-to-call and reply buttons', 'The customer gets a confirmation'],
  },
  {
    id: 'service',
    name: 'Service businesses',
    who: 'Plumbers, dentists, salons, tutors, contractors',
    problem: 'Most leads arrive while you are on a job. A missed call usually goes to the next business on the list.',
    build: [
      'A request form that collects the job details you would otherwise ask for on the phone',
      'A quote estimator, so visitors see a price range before they contact you',
      'Online booking requests for appointments',
      'A chatbot that answers common questions after hours and takes down contact details',
    ],
    flow: ['Visitor gets a rough quote', 'They send their details', 'The lead lands in your inbox, budget included', 'You reply or call back in one tap'],
  },
  {
    id: 'retail',
    name: 'Shops and retail',
    problem: 'Customers want to know what you carry and whether you are open before they make the trip.',
    build: [
      'A product or collection showcase with photos that load fast on a phone',
      'Hours, directions, and parking where people expect them',
      'Online ordering or a store, when you are ready to sell online',
    ],
    flow: ['Customer browses on their phone', 'They place an order or ask a question', 'You are notified right away', 'They get a confirmation'],
  },
  {
    id: 'creator',
    name: 'Authors and creators',
    problem: 'Your audience lives on platforms you do not control. A site of your own gives them one place to buy from you and one link to share.',
    build: [
      'A home for your work, with a clear path to buy',
      'A resource library for free material',
      'Links out to your channels, and one link back to you',
    ],
    flow: ['A follower clicks your link', 'They land on your own site', 'They buy, download, or subscribe'],
    example: 'sabrine-math',
  },
  {
    id: 'membership',
    name: 'Membership groups and teams',
    problem: 'Schedules, sign-ups, and announcements end up scattered across group chats and shared documents.',
    build: [
      'A public site that brings in members and sponsors',
      'A members area for the things only members should see',
      'Meeting times, events, and resources in one place',
    ],
    flow: ['A prospect finds the public site', 'They apply or sign up', 'Members sign in for the rest'],
    example: 'sfe-foundry',
  },
  {
    id: 'community',
    name: 'Community organizations',
    problem: 'Supporters need to see what you do, when it happens, and how to take part, without calling to ask.',
    build: [
      'Programs and events, kept current',
      'Volunteer and sign-up forms that reach the right person',
      'A clear way to get in touch or contribute',
    ],
    flow: ['A supporter reads about a program', 'They sign up', 'Your team is notified', 'They get a confirmation'],
    example: 'finance-for-movement',
  },
]

// What this site itself runs on. Every item here is something we built and operate for
// PeachWeb, so each claim can be checked by using the site.
export const stack = [
  {
    name: 'Front end',
    tools: 'React, Vite, Tailwind CSS',
    text: 'Pages are built as components, sized for phones first, and shipped as small static files so they load quickly.',
  },
  {
    name: 'Server and API',
    tools: 'Node.js, Express',
    text: 'Forms post to our own API. It validates each request, records it, and decides what happens next.',
  },
  {
    name: 'Email pipeline',
    tools: 'Serverless mail relay',
    text: 'Every request triggers two emails: a notification to the business and a confirmation to the customer. If the notification cannot be sent, the visitor is told, so a lead is never lost silently.',
  },
  {
    name: 'AI chatbot',
    tools: 'Google Gemini API',
    text: 'Peachy answers from a written brief about the business, with fallback models and a rate limit so it stays up and stays on topic.',
  },
  {
    name: 'Hosting and domains',
    tools: 'Vercel, Render, DNS, HTTPS',
    text: 'We set up hosting, the domain, DNS records, and certificates, and deploy automatically on every change.',
  },
  {
    name: 'Search and monitoring',
    tools: 'Search Console, structured data, uptime checks',
    text: 'Sitemaps, structured data, and Search Console so Google can read the site, plus an uptime monitor that emails us if the server goes down.',
  },
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
    bio: 'I’m Souren Datta, co-founder of PeachWeb. I became interested in website design after I started making websites for nonprofits and school clubs, and I loved shipping them so the people behind each one could put the site to work and benefit from it. I’ve built sites for Finance For Movement, SFE Foundry, AHS YEFA, and content creator Sabrine Mezali. When you work with PeachWeb, you work directly with me and Adwait. We answer our own emails, and we won’t hand your project to someone else.',
    work: ['PeachWeb', 'Finance For Movement', 'SFE Foundry', 'AHS YEFA', 'Sabrine Mezali (content creator)'],
  },
  {
    name: 'Adwait Dhaneshwar',
    role: 'Co-founder',
    photo: '/founders/adwait.jpg',
    linkedin: 'https://www.linkedin.com/in/adwaitdhaneshwar/',
    bio: 'I’m Adwait Dhaneshwar, co-founder of PeachWeb. I’m a student in Alpharetta, and I build websites that help local businesses and organizations look credible and get found. I’ve built sites for STEM Simplified, AHS Robotics, and AHS Chess Club, and I run STEM Simplified, a free study resource library I started for students. When you work with PeachWeb, you work directly with me and Souren. We answer our own emails, and we won’t hand your project to someone else.',
    work: ['PeachWeb', 'STEM Simplified', 'AHS Robotics', 'AHS Chess Club'],
  },
]

// Project prices run from $500 to $2,000.
// PLACEHOLDER: `price: null` renders "Quoted after a call" in production and a visible
// placeholder flag in development. Fill in real numbers when you have them.
export const pricing = [
  {
    name: 'Website',
    price: 'From $500',
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

// Quote estimator. The four brackets split the $500 to $2,000 project range evenly.
// PLACEHOLDER: how answers map onto a bracket is our guess; adjust `score` below.
export const estimator = {
  brackets: ['$500–$800', '$800–$1,200', '$1,200–$1,600', '$1,600–$2,000'],
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
    a: "Projects run from $500 to $2,000, depending on how many pages you need and which extras you add. We quote once we understand what you need, and we'll tell you plainly what fits in your budget. The quote estimator on the Pricing page gives you a rough range.",
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
    a: "Every site we have shipped is live and linked on the Work page: a membership site with a member portal, a team site built to bring in sponsors, a site that sells a book, and more. The engineering is the same for a local business. See the Use cases page for how it applies to yours.",
  },
]
