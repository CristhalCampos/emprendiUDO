'use client'

import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Page() {
  const [services, setServices] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, image_url')
        .order('created_at', { ascending: false })

      if (error) {
        setError('Error al cargar servicios')
      } else {
        setServices(data)
      }
    }

    fetchServices()
  }, [])

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>
  }

  if (services.length === 0) {
    return <p className="p-6 text-center text-gray-500">No hay servicios disponibles</p>
  }

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-[#002147] font-poppins">
        Servicios ofrecidos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link
              href={`/services/${s.id}`}
              className="border rounded shadow hover:shadow-lg bg-white overflow-hidden block"
            >
              <div className="aspect-video">
                <img
                  src={s.image_url || '/placeholder.jpg'}
                  alt={s.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#1F2937]">{s.name}</h2>
                <p className="text-sm text-gray-600">${s.price}</p>
                <p className="text-xs text-blue-600 mt-2 underline">Ver detalles</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}