import { mount } from './mount'
import SiteLayout from '../components/SiteLayout'
import PageHeader from '../components/PageHeader'
import UseCases, { PdfButton } from '../components/UseCases'
import CtaBand from '../components/CtaBand'

mount(() => (
  <SiteLayout>
    {open => (
      <>
        <PageHeader label="Use cases" title="What a site does for a business like yours.">
          <p>
            Six kinds of business, the problem each one has online, what we build for it, and how a customer's
            request gets from the page to your inbox.
          </p>
          <p><PdfButton className="btn-line" /></p>
        </PageHeader>
        <UseCases />
        <CtaBand onMockup={open} />
      </>
    )}
  </SiteLayout>
))
