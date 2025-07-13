'use client'

import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'

export default function ServicePage({ params }) {
  const { id } = params
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
    return <p className="p-4 text-red-500">{error}</p>
  }

  if (!service) {
    return <p className="p-4 text-center text-gray-500">Cargando servicio...</p>
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Imagen */}
      <div className="aspect-video mb-6">
        <img
          src={service.image_url || '/placeholder.jpg'}
          alt={service.name}
          className="rounded border object-cover w-full h-full"
        />
      </div>

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
                className="text-green-600 underline"
              >
                Contactar por WhatsApp
              </a>
            </p>
          )}

          {service.emprendimiento.instagram && (
            <p className="mt-1">
              <a
                href={`https://instagram.com/${service.emprendimiento.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 underline"
              >
                Ver en Instagram
              </a>
            </p>
          )}
        </div>
      )}

      <Link href="/services" className="inline-block mt-6 text-blue-600 underline">
        ← Volver a servicios
      </Link>
    </div>
  )
}