import { mount } from './mount'
import SiteLayout from '../components/SiteLayout'
import PageHeader from '../components/PageHeader'
import Work from '../components/Work'
import CtaBand from '../components/CtaBand'

mount(() => (
  <SiteLayout>
    {open => (
      <>
        <PageHeader label="Work" title="Live sites, built start to finish by the two of us.">
          <p>Every project here is in production. Open them on your phone before you decide whether we're a fit.</p>
        </PageHeader>
        <Work full />
        <CtaBand onMockup={open} />
      </>
    )}
  </SiteLayout>
))
