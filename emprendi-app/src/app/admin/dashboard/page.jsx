'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
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
        router.push('/') // redirige si no es admin
        return
      }

      const { data: productos } = await supabase
        .from('products')
        .select('id, name, created_at, emprendimiento ( name )')
        .order('created_at', { ascending: false })

      const { data: servicios } = await supabase
        .from('services')
        .select('id, name, created_at, emprendimiento ( name )')
        .order('created_at', { ascending: false })

      setProducts(productos || [])
      setServices(servicios || [])
      setLoading(false)
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
                  <p className="text-sm text-gray-600">
                    Emprendimiento: {p.emprendimiento?.name || 'Desconocido'}
                  </p>
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
                  <p className="text-sm text-gray-600">
                    Emprendimiento: {s.emprendimiento?.name || 'Desconocido'}
                  </p>
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
    </div>
  )
}