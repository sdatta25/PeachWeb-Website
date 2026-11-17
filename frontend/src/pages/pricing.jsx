import { mount } from './mount'
import SiteLayout from '../components/SiteLayout'
import Pricing from '../components/Pricing'
import Estimate from '../components/Estimate'
import Faq from '../components/Faq'
import CtaBand from '../components/CtaBand'

mount(() => (
  <SiteLayout>
    {open => (
      <>
        <Pricing as="h1" />
        <Estimate />
        <Faq />
        <CtaBand onMockup={open} />
      </>
    )}
  </SiteLayout>
))
