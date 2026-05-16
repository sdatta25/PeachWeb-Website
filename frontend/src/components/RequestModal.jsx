import { useState } from 'react'

const API_URL = 'http://localhost:3002'

const orgTypes = [
  'Local Business',
  'Restaurant',
  'Retail Shop',
  'Service Provider',
  'Nonprofit',
  'Community Organization',
  'School',
  'Other',
]

const budgetOptions = [
  'Under $500',
  '$500–$1,500',
  '$1,500–$5,000',
  '$5,000+',
  'Not sure yet',
]

export default function RequestModal({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    orgType: '',
    services: [],
    budget: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleServiceToggle = (service) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter your name.'); return }
    if (!form.description.trim()) { setError('Please describe your project.'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          orgType: form.orgType,
          description: form.description,
          budget: form.budget,
          services: form.services,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed.')
      setSubmittedData({ email: form.email })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-lg border text-sm transition-colors outline-none focus:ring-2'
  const inputStyle = { borderColor: '#E5E7EB', fontSize: '14px' }
  const focusStyle = { borderColor: '#FF8C61' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-start justify-between rounded-t-2xl z-10" style={{ borderColor: '#FFE4D6' }}>
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: '#1C1C1C' }}>Request a Website</h2>
            <p className="text-sm mt-0.5 font-semibold" style={{ color: '#FF8C61', fontFamily: 'Georgia, serif' }}>PeachWeb</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="px-8 py-12 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-5"
              style={{ backgroundColor: '#FFE4D6' }}
            >
              ✅
            </div>
            <h3 className="text-2xl font-extrabold mb-3" style={{ color: '#1C1C1C' }}>
              Request Submitted!
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Thanks for contacting PeachWeb! We'll review your request and get back to you within 1–2 business days.
              {submittedData?.email && ' Check your email for a confirmation.'}
            </p>
            {!submittedData?.email && (
              <p
                className="text-sm px-4 py-3 rounded-lg mb-6"
                style={{ backgroundColor: '#FFF5F0', color: '#E8571A' }}
              >
                💡 Tip: Next time, add your email to receive an instant confirmation.
              </p>
            )}
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#FF8C61' }}
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>
                Full Name <span style={{ color: '#FF8C61' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>
                Email{' '}
                <span className="font-normal text-xs" style={{ color: '#9CA3AF' }}>
                  (We'll send your confirmation here)
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@yourbusiness.com"
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>Organization / Business Name</label>
              <input
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                placeholder="Your Business Name"
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Org Type */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>Organization Type</label>
              <select
                name="orgType"
                value={form.orgType}
                onChange={handleChange}
                className={inputClass}
                style={{ ...inputStyle, backgroundColor: 'white' }}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              >
                <option value="">Select type...</option>
                {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1C1C1C' }}>
                What services do you need?
              </label>
              <div className="flex flex-wrap gap-3">
                {['Website', 'AI Chatbot', 'Both'].map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.services.includes(s)}
                      onChange={() => handleServiceToggle(s)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#FF8C61' }}
                    />
                    <span className="text-sm font-medium" style={{ color: '#374151' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>Budget Range</label>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className={inputClass}
                style={{ ...inputStyle, backgroundColor: 'white' }}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              >
                <option value="">Select budget...</option>
                {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1C1C1C' }}>
                Tell us about your project <span style={{ color: '#FF8C61' }}>*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your business and what you're looking for..."
                className={inputClass}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#FF8C61'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#FF8C61' }}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Request →'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
