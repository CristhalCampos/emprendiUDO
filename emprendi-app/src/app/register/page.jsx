'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BasicInfoForm from '../../components/register/BasicInfoForm'
import ProductForm from '../../components/register/ProductForm'
import ServiceForm from '../../components/register/ServiceForm'
import SubmitWhatsAppButton from '../../components/register/SubmitWhatsAppButton'

export default function Page() {
  const [WhatsApp, setWhatsApp] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: 'productos',
    contact: '',
    instagram: '',
    description: '',
    logo: null,
    products: [],
    services: [],
  })

  useEffect(() => {
    const fetchWhatsApp = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', process.env.NEXT_PUBLIC_ADMIN_UID)
        .single()
      if (!error) setWhatsApp(data?.phone_number || '')
    }
    fetchWhatsApp()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Registrar emprendimiento</h1>

      <p className="mb-4 text-gray-700">
        Para registrar tu emprendimiento, llena los datos a continuación como guía y luego haz clic en el botón para contactarnos por WhatsApp.
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <BasicInfoForm formData={formData} setFormData={setFormData} />
        {formData.type === 'productos' && (
          <ProductForm formData={formData} setFormData={setFormData} />
        )}
        {formData.type === 'servicios' && (
          <ServiceForm formData={formData} setFormData={setFormData} />
        )}
        <SubmitWhatsAppButton formData={formData} WhatsApp={WhatsApp} />
      </form>
    </div>
  )
}