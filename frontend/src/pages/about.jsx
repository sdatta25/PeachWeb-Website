import { mount } from './mount'
import SiteLayout from '../components/SiteLayout'
import PageHeader from '../components/PageHeader'
import Team from '../components/Team'
import Process from '../components/Process'
import CtaBand from '../components/CtaBand'

mount(() => (
  <SiteLayout>
    {open => (
      <>
        <PageHeader label="About" title="Two developers. No account managers.">
          <p>
            Whoever is on your planning call is designing and building your site, so nothing gets lost in a
            handoff.
          </p>
        </PageHeader>
        <Team />
        <Process />
        <CtaBand onMockup={open} />
      </>
    )}
  </SiteLayout>
))
