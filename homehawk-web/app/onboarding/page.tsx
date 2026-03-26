'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const STATES = ['MN', 'WI'] as const

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    address_line1: '', city: '', state: 'MN' as string, zip: '',
    property_name: '', emergency_name: '', emergency_phone: '',
    interior_authorized: false, interior_consent: false,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('properties').insert({
      user_id: user.id,
      property_name: form.property_name || 'My Lake Home',
      address_line1: form.address_line1,
      city: form.city,
      state: form.state,
      zip: form.zip,
      emergency_contact_name: form.emergency_name,
      emergency_contact_phone: form.emergency_phone,
      interior_authorized: form.interior_authorized && form.interior_consent,
    })
    if (!error) {
      await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id)
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A2D] focus:border-transparent outline-none'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-[#1B3A2D]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-[#1B3A2D] mb-1">
          {step === 1 && 'Property Address'}
          {step === 2 && 'Emergency Contact'}
          {step === 3 && 'Interior Access'}
        </h1>
        <p className="text-gray-500 mb-6 text-sm">Step {step} of 3</p>

        {step === 1 && (
          <div className="space-y-4">
            <input className={inputClass} placeholder="Property name (optional)" value={form.property_name} onChange={(e) => update('property_name', e.target.value)} />
            <input className={inputClass} placeholder="Street address *" value={form.address_line1} onChange={(e) => update('address_line1', e.target.value)} required />
            <div className="grid grid-cols-3 gap-3">
              <input className={inputClass} placeholder="City *" value={form.city} onChange={(e) => update('city', e.target.value)} required />
              <select className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)}>
                {STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <input className={inputClass} placeholder="ZIP *" value={form.zip} onChange={(e) => update('zip', e.target.value)} required />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Who should we contact in case of emergency?</p>
            <input className={inputClass} placeholder="Contact name *" value={form.emergency_name} onChange={(e) => update('emergency_name', e.target.value)} required />
            <input className={inputClass} placeholder="Phone number *" value={form.emergency_phone} onChange={(e) => update('emergency_phone', e.target.value)} required />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Do you authorize HomeHawk to enter the interior of your property during check-ins?</p>
            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" className="mt-1" checked={form.interior_authorized} onChange={(e) => update('interior_authorized', e.target.checked)} />
              <span className="text-sm">Yes, I authorize interior access during scheduled visits</span>
            </label>
            {form.interior_authorized && (
              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 border-[#D4A24E]">
                <input type="checkbox" className="mt-1" checked={form.interior_consent} onChange={(e) => update('interior_consent', e.target.checked)} />
                <span className="text-sm">I understand that HomeHawk will document the condition of interior spaces with photos as part of the check-in report</span>
              </label>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-[#1B3A2D]">Back</button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="px-6 py-3 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: '#1B3A2D' }}>Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 text-sm font-medium text-white rounded-lg disabled:opacity-50" style={{ backgroundColor: '#1B3A2D' }}>
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
