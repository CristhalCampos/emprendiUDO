'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { use } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

export default function ProductPage({ params }) {
  const { id } = use(params)

  const [product, setProduct] = useState(null)
  const [presentations, setPresentations] = useState([])
  const [entrepreneur, setEntrepreneur] = useState(null)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: prod, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (prodError || !prod) throw new Error(prodError?.message || 'Producto no encontrado')

        setProduct(prod)

        const { data: pres, error: presError } = await supabase
          .from('product_presentations')
          .select('id, label, price, image_url')
          .eq('product_id', id)

        if (presError) throw new Error(presError.message)

        setPresentations(pres || [])

        const { data: emp, error: empError } = await supabase
          .from('emprendimientos')
          .select(`
            id,
            name,
            instagram,
            emprendedor:profiles (
              phone_number
            )
          `)
          .eq('id', prod.emprendimiento_id)
          .single()

        if (empError) throw new Error(empError.message)

        setEntrepreneur(emp)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchData()
  }, [id])

  const prevImage = () => {
    setCurrentIndex((i) => (i === 0 ? presentations.length - 1 : i - 1))
  }

  const nextImage = () => {
    setCurrentIndex((i) => (i === presentations.length - 1 ? 0 : i + 1))
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>
  }

  if (!product) {
    return <p className="p-4 text-center text-gray-500">Cargando...</p>
  }

  const current = presentations[currentIndex] || {}

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Galería */}
      <div className="relative aspect-video mb-4 bg-gray-100 flex items-center justify-center rounded border overflow-hidden">
        {presentations.length > 0 ? (
          <>
            <motion.img
              key={current.image_url}
              src={current.image_url || '/placeholder.jpg'}
              alt={`${product.name} presentación ${currentIndex + 1}`}
              className="object-cover w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            {presentations.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
                >
                  ›
                </button>
              </>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
              {current.label || 'Sin etiqueta'} | ${current.price || '-'}
            </div>
          </>
        ) : (
          <img src="/placeholder.jpg" alt="Sin imagen" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Información producto */}
      <motion.h1
        className="text-3xl font-bold mt-2 text-[#002147] font-poppins"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {product.name}
      </motion.h1>
      <p className="text-gray-600 mt-4 whitespace-pre-line">{product.description}</p>

      {/* Información emprendimiento */}
      {entrepreneur && (
        <motion.div
          className="mt-6 border-t pt-4 text-sm font-openSans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-medium text-gray-800">
            Emprendimiento: {entrepreneur.name}
          </p>

          {entrepreneur.emprendedor?.phone_number && (
            <p className="mt-1">
              <a
                href={`https://wa.me/${entrepreneur.emprendedor.phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline flex gap-2 items-center"
              >
                <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5" />
                <span>Contactar por WhatsApp</span>
              </a>
            </p>
          )}

          {entrepreneur.instagram && (
            <p className="mt-1">
              <a
                href={`https://instagram.com/${entrepreneur.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 underline flex gap-2 items-center"
              >
                <img src="/instagram.png" alt="Instagram" className="w-5 h-5" />
                <span>Ver en Instagram</span>
              </a>
            </p>
          )}
        </motion.div>
      )}

      <Link href="/products" className="inline-block mt-6 text-blue-600 underline">
        ← Volver a productos
      </Link>
    </motion.div>
  )
}