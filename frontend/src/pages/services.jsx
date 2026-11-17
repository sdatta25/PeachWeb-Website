import { mount } from './mount'
import SiteLayout from '../components/SiteLayout'
import PageHeader from '../components/PageHeader'
import Services from '../components/Services'
import Engineering from '../components/Engineering'
import CtaBand from '../components/CtaBand'

mount(() => (
  <SiteLayout>
    {open => (
      <>
        <PageHeader label="Services" title="Websites, chatbots, and the systems that connect them.">
          <p>
            We design the pages and engineer what sits behind them: the forms, the server, the email, and the
            chatbot. One team, start to finish.
          </p>
        </PageHeader>
        <Services />
        <Engineering />
        <CtaBand onMockup={open} />
      </>
    )}
  </SiteLayout>
))
