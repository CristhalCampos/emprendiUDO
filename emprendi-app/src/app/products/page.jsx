'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Page() {
  const [products, setProducts] = useState([])
  const [presentationsByProduct, setPresentationsByProduct] = useState({})
  const [currentPresentationIndex, setCurrentPresentationIndex] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener productos
        const { data: productsData, error: productError } = await supabase
          .from('products')
          .select('id, name')
          .order('created_at', { ascending: false })

        if (productError) throw productError
        setProducts(productsData)

        // Obtener presentaciones
        const { data: presentationsData, error: presentationError } = await supabase
          .from('product_presentations')
          .select('id, product_id, label, price, image_url')
        
        if (presentationError) throw presentationError

        // Agrupar presentaciones por producto_id
        const grouped = {}
        const indices = {}
        presentationsData.forEach(pres => {
          if (!grouped[pres.product_id]) {
            grouped[pres.product_id] = []
            indices[pres.product_id] = 0
          }
          grouped[pres.product_id].push(pres)
        })

        setPresentationsByProduct(grouped)
        setCurrentPresentationIndex(indices)
      } catch (err) {
        setError(err.message || 'Error al cargar los productos')
      }
    }

    fetchData()
  }, [])

  const nextImage = (productId) => {
    setCurrentPresentationIndex(prev => {
      const max = presentationsByProduct[productId]?.length || 1
      return { ...prev, [productId]: (prev[productId] + 1) % max }
    })
  }

  const prevImage = (productId) => {
    setCurrentPresentationIndex(prev => {
      const max = presentationsByProduct[productId]?.length || 1
      return { ...prev, [productId]: (prev[productId] - 1 + max) % max }
    })
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>
  }

  if (!products.length) {
    return <p className="p-4 text-center text-gray-500">No hay productos disponibles.</p>
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#002147] font-poppins">Productos disponibles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => {
          const presentations = presentationsByProduct[product.id] || []
          const currentIndex = currentPresentationIndex[product.id] || 0
          const current = presentations[currentIndex] || {}

          return (
            <div
              key={product.id}
              className="border rounded shadow hover:shadow-lg bg-white overflow-hidden relative"
            >
              {/* Imagen + slider */}
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                {presentations.length > 0 ? (
                  <>
                    <img
                      src={current.image_url || '/placeholder.jpg'}
                      alt={`Presentación de ${product.name}`}
                      className="object-cover w-full h-full rounded"
                    />
                    {presentations.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(product.id)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
                          aria-label="Anterior"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => nextImage(product.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
                          aria-label="Siguiente"
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
                  <img
                    src="/placeholder.jpg"
                    alt="Sin imagen"
                    className="object-cover w-full h-full rounded"
                  />
                )}
              </div>

              {/* Info producto */}
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-[#1F2937]">{product.name}</h2>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-block text-sm bg-[#F5B400] text-[#002147] py-1 px-3 rounded hover:bg-yellow-500 transition"
                >
                  Ver más
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}