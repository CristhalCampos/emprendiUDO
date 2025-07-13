'use client'

import Link from 'next/link'
import { use } from 'react'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ServicePage({ params }) {
  const { id } = use(params)
  const [service, setService] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchService = async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          emprendimiento (
            id,
            name,
            instagram,
            emprendedor:profiles (
              phone_number
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Servicio no encontrado')
      } else {
        setService(data)
      }
    }

    fetchService()
  }, [id])

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  if (!service) {
    return <p className="p-6 text-center text-gray-500">Cargando servicio...</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-3xl mx-auto"
    >
      {/* Imagen */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="aspect-video mb-6"
      >
        <img
          src={service.image_url || '/placeholder.jpg'}
          alt={service.name}
          className="rounded border object-cover w-full h-full"
        />
      </motion.div>

      {/* Info principal */}
      <h1 className="text-3xl font-bold mt-2 text-[#002147] font-poppins">{service.name}</h1>
      <p className="text-lg text-gray-700 mt-2">${service.price}</p>
      <p className="text-gray-600 mt-4 whitespace-pre-line">{service.description}</p>

      {/* Info del emprendimiento */}
      {service.emprendimiento && (
        <div className="mt-6 border-t pt-4 text-sm font-openSans">
          <p className="font-medium text-gray-800">
            Emprendimiento: {service.emprendimiento.name}
          </p>

          {service.emprendimiento.emprendedor?.phone_number && (
            <p className="mt-1">
              <a
                href={`https://wa.me/${service.emprendimiento.emprendedor.phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline flex gap-2"
              >
                <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5" />
                <span>Contactar por WhatsApp</span>
              </a>
            </p>
          )}

          {service.emprendimiento.instagram && (
            <p className="mt-1">
              <a
                href={`https://instagram.com/${service.emprendimiento.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 underline flex gap-2"
              >
                <img src="/instagram.png" alt="Instagram" className="w-5 h-5" />
                <span>Ver en Instagram</span>
              </a>
            </p>
          )}
        </div>
      )}

      <Link href="/services" className="inline-block mt-6 text-blue-600 underline">
        ← Volver a servicios
      </Link>
    </motion.div>
  )
}