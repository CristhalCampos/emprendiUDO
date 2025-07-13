'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'
import { motion } from 'framer-motion'
import ServiceList from '../components/ServiceList'
import ProductList from '../components/ProductList'
import EntrepreneurCarousel from '../components/EntrepreneurCarousel'

export default function Home() {
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])

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
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      {/* Intro para compradores */}
      <section className="py-10 px-6 bg-[#002147] grid grid-cols-1 md:grid-cols-[1fr_35%] gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center text-center col-span-full md:col-span-2"
        >
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
        </motion.div>
      </section>

      {/* Emprendimientos */}
      {entrepreneurs.length > 0 && (
        <motion.section
          className="py-10 px-6 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-semibold font-poppins text-[#002147] mb-6">
            Emprendimientos Destacados
          </h3>
          <EntrepreneurCarousel entrepreneurs={entrepreneurs} />
        </motion.section>
      )}

      {/* Productos */}
      <motion.section
        className="py-10 px-6 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-3xl font-semibold font-poppins text-center text-[#002147] mb-8">
          Productos Disponibles
        </h3>
        {products.length > 0 ? (
          <motion.div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductList key={p.id} product={p} />
              ))}
            </div>
            <Link
              href="/products"
              className="text-[#002147] underline font-semibold mt-4"
            >
              Ver todos los productos
            </Link>
          </motion.div>
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No hay productos disponibles aún.
          </p>
        )}
      </motion.section>

      {/* Servicios */}
      <motion.section
        className="py-10 px-6 bg-[#F5F5F7]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-3xl font-semibold font-poppins text-center text-[#002147] mb-8">
          Servicios Ofrecidos
        </h3>
        {services.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="grid md:grid-cols-3 justify-items-center gap-6 max-w-6xl mx-auto">
              <ServiceList services={services} />
            </div>
            <Link href="/services" className="text-[#002147] underline font-semibold mt-4">
              Ver todos los servicios
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay servicios disponibles aún.</p>
        )}
      </motion.section>

      {/* CTA final */}
      <motion.section
        className="bg-white py-20 px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
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
      </motion.section>
    </div>
  )
}