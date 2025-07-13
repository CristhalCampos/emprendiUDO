'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ProductList({ product }) {
  const pres = product.presentations[0] || {}

  return (
    <motion.div
      className="bg-[#f9f9f9] shadow rounded-lg p-4 w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
    >
      <div className="flex justify-center items-center">
        <img
          src={pres.image_url || '/placeholder.jpg'}
          alt={product.name}
          className="rounded h-44 w-full object-cover"
        />
      </div>
      <div className="flex flex-col items-center">
        <h4 className="font-semibold text-lg text-[#1F2937] mt-4">{product.name}</h4>
        <Link
          href={`/products/${product.id}`}
          className="mt-2 inline-block text-sm bg-[#F5B400] text-[#002147] py-1 px-3 rounded hover:bg-yellow-500 transition"
        >
          Ver más
        </Link>
      </div>
    </motion.div>
  )
}