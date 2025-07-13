'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Page() {
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const adminUID = process.env.NEXT_PUBLIC_ADMIN_UID

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || user.id !== adminUID) {
        router.push('/') // Redirige si no es admin
        return
      }

      try {
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')

        if (prodError) throw new Error(prodError.message)

        const { data: servData, error: servError } = await supabase
          .from('services')
          .select('*')

        if (servError) throw new Error(servError.message)

        setProducts(prodData || [])
        setServices(servData || [])
      } catch (err) {
        console.error('Error cargando datos:', err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAndFetch()
  }, [])

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando emprendimientos...</p>
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#002147] font-poppins">Panel del Administrador</h1>

      {/* Productos */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Productos registrados</h2>
        {products.length > 0 ? (
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#002147]">{p.name}</p>
                </div>
                <a
                  href={`/products/${p.id}`}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Ver detalles
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay productos registrados.</p>
        )}
      </section>

      {/* Servicios */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Servicios registrados</h2>
        {services.length > 0 ? (
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#002147]">{s.name}</p>
                </div>
                <a
                  href={`/services/${s.id}`}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Ver detalles
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay servicios registrados.</p>
        )}
      </section>

      {/* Cerrar sesión */}
      <div className="mt-10">
        <button
          onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}