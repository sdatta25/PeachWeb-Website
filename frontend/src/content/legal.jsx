// Legal copy: the Privacy Policy (/privacy) and Terms of Service (/terms).
//
// This was written from an audit of what the site and its backend actually do. Do not add a
// practice here that the site does not have, and update this file when the site changes (for
// example if analytics, a new form provider or another third-party service is added).
//
// TODO(PLACEHOLDER): every <Placeholder> below is a value the owners must confirm before this goes
// live. Search this file for "TODO" to find them all. Once they are confirmed, set
// SHOW_PLACEHOLDERS to false: that removes the visible [PLACEHOLDER: ...] markers from the pages.
import { EMAIL } from './site'

// TODO: change this date whenever either document changes.
export const LAST_UPDATED = 'November 5, 2026'

// TODO(PLACEHOLDER): set to false after the retention periods and the response time are confirmed.
export const SHOW_PLACEHOLDERS = true

function Placeholder({ children }) {
  if (!SHOW_PLACEHOLDERS) return <>{children}</>
  return (
    <mark className="rounded bg-peach px-1.5 py-0.5 font-semibold text-dark">[PLACEHOLDER: {children}]</mark>
  )
}

const Mail = () => <a href={`mailto:${EMAIL}`} className="link text-dark [overflow-wrap:anywhere]">{EMAIL}</a>
const Privacy = () => <a href="/privacy" className="link text-dark">Privacy Policy</a>

// ---------------------------------------------------------------------------------------------
// PRIVACY POLICY
// ---------------------------------------------------------------------------------------------
export const privacy = {
  slug: 'privacy',
  title: 'Privacy Policy',
  description:
    'What PeachWeb collects through its website, contact and quote forms, and AI chat assistant, why we collect it, who we share it with, and how to ask us to see, correct, or delete it.',
  intro: 'This policy explains, in plain language, what information the PeachWeb website collects and what we do with it.',
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      body: (
        <>
          <p>
            PeachWeb is a student-run web design studio in Alpharetta, Georgia. We design and build websites and
            AI chatbots for local businesses and nonprofits.
          </p>
          <p>Questions about this policy or your information? Email us at <Mail />.</p>
        </>
      ),
    },
    {
      id: 'what-we-collect',
      title: 'What we collect',
      body: (
        <>
          <p>We collect what you choose to send us, plus the technical information your browser sends by default.</p>
          <p><strong>If you request a free mockup,</strong> we collect your name and email address and a description
            of your business. If you choose to share them, we also collect your phone number, business name, type of
            business, and current website, and whether you are interested in an AI chatbot.</p>
          <p><strong>If you use the quote estimator and ask for a call,</strong> we collect your answers (type of
            business, number of pages, extras, and the price range they produce) along with your name and email
            address, and your phone number, business name, and notes if you add them. Nothing from the estimator is
            sent to us until you submit your details.</p>
          <p><strong>If you email us,</strong> we keep what you send.</p>
          <p><strong>If you use the chat assistant,</strong> your messages are sent to us and to Google to generate
            a reply. See “Messages typed into the chat assistant” below.</p>
          <p><strong>Technical data.</strong> Like any website, the servers that deliver our pages receive your IP
            address, your browser and device type, and the pages and files your browser asks for. We do not run
            analytics or tracking tools on the site. Our hosting providers may keep this information in their
            standard server logs.</p>
          <p>When a page loads, your browser also sends a short request to our backend server (hosted on Render) to
            wake it up, so it is ready if you send a form or a chat message. That request contains no form or chat
            content, but, as with any web request, the server can see your IP address.</p>
          <p>We do not collect payment information through the site.</p>
        </>
      ),
    },
    {
      id: 'why-we-collect-it',
      title: 'Why we collect it',
      body: (
        <>
          <p>We use your information to:</p>
          <ul>
            <li>reply to your inquiry and send you a confirmation email,</li>
            <li>prepare mockups, quotes, and proposals,</li>
            <li>provide our services if you become a client, and</li>
            <li>keep the site and chat assistant working, and improve them.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'who-we-share-it-with',
      title: 'Who we share it with',
      body: (
        <>
          <p>
            We share information only with the service providers we need to run the site and our forms. They
            process it to provide their service to us, under their own terms and privacy policies:
          </p>
          <ul>
            <li><strong>Vercel</strong> hosts this website and runs the small function that relays our emails.</li>
            <li><strong>Render</strong> hosts the backend server that receives form submissions and chat messages.</li>
            <li><strong>Google</strong> provides the Gmail account where inquiries arrive and confirmation emails are
              sent from, and the Gemini service that writes the chat assistant’s replies.</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </>
      ),
    },
    {
      id: 'chat-assistant',
      title: 'Messages typed into the chat assistant',
      body: (
        <>
          <p>
            The assistant in the corner of the site (“Peachy”) is an AI. When you send a message, the message and
            the earlier messages in the same conversation are sent to our backend server, and from there to
            Google’s Gemini service, which writes the reply.
          </p>
          <p>
            We do not save chat conversations, and we do not link them to your name or email. To limit how many
            messages one visitor can send per minute, the server briefly keeps your IP address in memory only.
          </p>
          <p>
            Google handles the messages under its own terms and privacy policy, which may allow it to keep and
            review them. Please do not type sensitive personal information into the chat.
          </p>
        </>
      ),
    },
    {
      id: 'how-long-we-keep-it',
      title: 'How long we keep it',
      body: (
        <>
          {/* TODO(PLACEHOLDER): confirm both retention periods with the owners. Nothing in the code deletes
              data automatically today, so whoever handles the inbox needs to follow whatever is chosen here. */}
          {/* TODO(PLACEHOLDER): this does not cover an inquiry that was answered but did not become a project.
              Decide how long that is kept and add it. */}
          <ul>
            <li>Inquiries that go unanswered: <Placeholder>30 days</Placeholder>.</li>
            <li>Clients: for the length of the project plus <Placeholder>2 years</Placeholder>.</li>
          </ul>
          <p>After that, we delete the information.</p>
        </>
      ),
    },
    {
      id: 'cookies-and-analytics',
      title: 'Cookies and analytics',
      body: (
        <>
          <p>
            The site does not set cookies, and it does not use analytics, advertising, or tracking tools.
          </p>
          <p>
            It stores one small item in your browser’s session storage so the opening animation plays once per
            visit. That item stays on your device, is never sent to us, and is cleared when you close the tab.
          </p>
          <p>
            The site’s fonts and images are served from the site itself, not from other companies. Our hosting
            providers may keep standard server logs, as described above.
          </p>
        </>
      ),
    },
    {
      id: 'your-choices',
      title: 'Your choices',
      body: (
        <>
          <p>
            You can ask us to show you the information we hold about you, correct it, or delete it. Email <Mail />{' '}
            from the address you used to contact us so we can find it.
          </p>
          {/* TODO(PLACEHOLDER): confirm the response time for access, correction and deletion requests. */}
          <p>We will respond within <Placeholder>30</Placeholder> days.</p>
        </>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      body: (
        <p>
          The site is for business owners and is not directed to children under 13. We do not knowingly collect
          information from children under 13. If you think a child has sent us information, please email <Mail />.
        </p>
      ),
    },
    {
      id: 'security',
      title: 'Security',
      body: (
        <p>
          We take reasonable measures to protect your information, including encrypted (HTTPS) connections between
          your browser and our servers. No method of sending or storing information is completely secure, so we
          cannot guarantee it.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      body: (
        <p>
          When we change this policy, we will post the new version on this page and update the “Last updated” date
          at the top.
        </p>
      ),
    },
  ],
}

// ---------------------------------------------------------------------------------------------
// TERMS OF SERVICE
// ---------------------------------------------------------------------------------------------
export const terms = {
  slug: 'terms',
  title: 'Terms of Service',
  description:
    'The terms for using the PeachWeb website. Client projects are covered by a separate written Website Project Agreement.',
  intro: 'These terms cover your use of the PeachWeb website. They do not cover client projects, which have their own agreement.',
  sections: [
    {
      id: 'acceptance',
      title: 'Accepting these terms',
      body: (
        <p>
          By using this website, you agree to these Terms of Service and to our <Privacy />. If you do not agree,
          please do not use the site.
        </p>
      ),
    },
    {
      id: 'what-the-site-is',
      title: 'What this site is',
      body: (
        <>
          <p>This website gives information about PeachWeb’s services.</p>
          <p>
            Anything on it that talks about price or scope, including the quote estimator, pricing ranges, and
            replies from the chat assistant, is informational. It is not a binding offer until you and PeachWeb sign
            a written agreement. The chat assistant is an AI, so its answers can be wrong.
          </p>
        </>
      ),
    },
    {
      id: 'separate-agreement',
      title: 'Services are under a separate agreement',
      body: (
        <>
          <p>
            Website and chatbot projects are provided under a separate signed Website Project Agreement. These Terms
            only cover your use of this website.
          </p>
          <p>If these Terms and a signed agreement conflict, the signed agreement controls.</p>
        </>
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      body: (
        <>
          <p>When you use the site, you agree not to:</p>
          <ul>
            <li>use it for anything unlawful,</li>
            <li>try to disrupt, overload, or probe the site or its servers for weaknesses,</li>
            <li>use automated tools to scrape or copy it, or</li>
            <li>submit someone else’s information without their permission.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property',
      body: (
        <>
          <p>The content, design, and code of this website belong to PeachWeb.</p>
          {/* TODO(PLACEHOLDER): confirm that every portfolio screenshot and client name on the site is shown with
              the client's permission. This sentence states it as fact. */}
          <p>
            Portfolio screenshots and client names appear with permission. Work we build for a client belongs to
            that client, as set out in their agreement.
          </p>
        </>
      ),
    },
    {
      id: 'third-party-links',
      title: 'Third-party links and tools',
      body: (
        <p>
          The site links to other websites, such as our social profiles and sites we have built. We do not control
          them and are not responsible for their content or practices. The site also uses outside services to run,
          which are named in our <Privacy />.
        </p>
      ),
    },
    {
      id: 'no-guarantees',
      title: 'No guarantees',
      body: (
        <>
          <p>
            We do not promise any particular search ranking, traffic, leads, or revenue from our work or from
            anything on this site.
          </p>
          <p>The site is provided “as is,” without warranties of any kind.</p>
        </>
      ),
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of liability',
      body: (
        <p>
          To the extent the law allows, PeachWeb is not liable for indirect, incidental, or consequential damages
          that result from your use of this website. Liability for client projects is covered by the signed
          agreement for that project.
        </p>
      ),
    },
    {
      id: 'governing-law',
      title: 'Governing law',
      body: <p>These Terms are governed by the laws of the State of Georgia, USA.</p>,
    },
    {
      id: 'changes-and-contact',
      title: 'Changes and contact',
      body: (
        <>
          <p>
            We may update these Terms. The new version will be posted on this page with a new “Last updated” date
            at the top, and using the site after that means you accept the changes.
          </p>
          <p>Questions? Email <Mail />.</p>
        </>
      ),
    },
  ],
}
