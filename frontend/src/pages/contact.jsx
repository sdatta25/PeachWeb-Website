import { mount } from './mount'
import SiteLayout from '../components/SiteLayout'
import FinalCta from '../components/FinalCta'

mount(() => (
  <SiteLayout>
    <FinalCta as="h1" />
  </SiteLayout>
))
