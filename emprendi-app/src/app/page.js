'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'
import ServiceList from '../components/ServiceList'
import EntrepreneurCarousel from '../components/EntrepreneurCarousel'

export default function Home() {
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [presentationSlides, setPresentationSlides] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: emprendedores } = await supabase
          .from('emprendimientos')
          .select('id, name, logo_url')
          .order('created_at', { ascending: false })
          .limit(10)

        const { data: productos } = await supabase
          .from('products')
          .select('id, name')
          .order('created_at', { ascending: false })
          .limit(3)

        const productosConPresentaciones = await Promise.all(
          (productos || []).map(async (producto) => {
            const { data: presentaciones } = await supabase
              .from('product_presentations')
              .select('label, price, image_url')
              .eq('product_id', producto.id)

            return {
              ...producto,
              presentations: presentaciones || [],
            }
          })
        )

        // Inicializar índice por producto
        const slides = {}
        productosConPresentaciones.forEach((p) => {
          slides[p.id] = 0
        })

        const { data: servicios } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

        setEntrepreneurs(emprendedores || [])
        setProducts(productosConPresentaciones || [])
        setServices(servicios || [])
        setPresentationSlides(slides)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }

    fetchData()
  }, [])

  const nextPresentation = (productId, max) => {
    setPresentationSlides((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % max,
    }))
  }

  const prevPresentation = (productId, max) => {
    setPresentationSlides((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + max) % max,
    }))
  }

  return (
    <div>
      {/* Intro para compradores */}
      <section className="py-10 px-6 bg-[#002147f1] grid grid-cols-1 md:grid-cols-[1fr_35%] gap-4">
        <div className="flex flex-col justify-center text-center col-span-full md:col-span-2">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-4">
            Apoya el talento de la UDO
          </h2>
          <p className="text-lg font-openSans text-[#F5F5F7] mb-6">
            Descubre productos y servicios ofrecidos por estudiantes emprendedores.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-[#F5B400] text-[#002147] px-6 py-2 rounded font-semibold hover:bg-[#e5a800] transition uppercase text-sm"
            >
              Ver Productos
            </Link>
            <Link
              href="/services"
              className="bg-[#F5F5F7] text-[#002147] px-6 py-2 rounded font-semibold hover:bg-gray-400 transition uppercase text-sm"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Emprendimientos */}
      {entrepreneurs.length > 0 && (
        <section className="py-10 px-6 max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-semibold font-poppins text-[#002147] mb-6">
            Emprendimientos Destacados
          </h3>
          <EntrepreneurCarousel entrepreneurs={entrepreneurs} />
        </section>
      )}

      {/* Productos */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-semibold font-poppins text-center text-[#002147] mb-8">
          Productos Disponibles
        </h3>
        <div className="grid md:grid-cols-3 justify-items-center gap-6 max-w-6xl mx-auto">
          {products.length > 0 ? (
            products.map((p) => {
              const index = presentationSlides[p.id] || 0
              const pres = p.presentations[index]

              return (
                <div key={p.id} className="bg-[#f9f9f9] shadow rounded-lg p-4 w-full">
                  <div className="relative flex justify-center items-center">
                    {p.presentations.length > 1 && (
                      <button
                        onClick={() => prevPresentation(p.id, p.presentations.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#002147] text-white px-2 py-1 rounded-full hover:bg-[#e5a800] transition"
                      >
                        ‹
                      </button>
                    )}
                    <img
                      src={pres?.image_url || '/placeholder.jpg'}
                      alt={p.name}
                      className="rounded h-48 w-full object-cover"
                    />
                    {p.presentations.length > 1 && (
                      <button
                        onClick={() => nextPresentation(p.id, p.presentations.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#002147] text-white px-2 py-1 rounded-full hover:bg-[#e5a800] transition"
                      >
                        ›
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <h4 className="font-semibold text-lg text-[#1F2937] mt-4">{p.name}</h4>
                    <Link
                      href={`/products/${p.id}`}
                      className="mt-2 inline-block text-sm bg-[#F5B400] text-[#002147] py-1 px-3 rounded hover:bg-yellow-500 transition"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center col-span-3 text-gray-500">No hay productos disponibles aún.</p>
          )}
        </div>
        <div className="text-center mt-6">
          <Link href="/products" className="text-[#002147] underline font-semibold">
            Ver todos los productos
          </Link>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 px-6 bg-[#F5F5F7]">
        <h3 className="text-3xl font-semibold font-poppins text-center text-[#002147] mb-8">
          Servicios Ofrecidos
        </h3>
        {services.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="grid md:grid-cols-3 justify-items-center gap-6 max-w-6xl mx-auto">
              <ServiceList services={services} />
            </div>
            <Link href="/services" className="text-[#002147] underline font-semibold">
              Ver todos los servicios
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay servicios disponibles aún.</p>
        )}
      </section>

      {/* CTA final */}
      <section className="bg-white py-20 px-6 text-center">
        <h3 className="text-3xl font-semibold font-poppins text-[#002147] mb-4">
          ¿Tienes un emprendimiento?
        </h3>
        <p className="text-lg text-gray-700 mb-6 font-openSans">
          Súmate a la comunidad de emprendedores de la UDO y da a conocer tu talento.
        </p>
        <Link
          href="/register"
          className="bg-[#F5B400] text-[#002147] px-6 py-3 rounded font-bold hover:bg-[#e5a800] transition uppercase text-sm"
        >
          Publica tu emprendimiento
        </Link>
      </section>
    </div>
  )
}