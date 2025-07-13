'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ServiceList({ services }) {
  return (
    <>
      {services.map((s) => (
        <motion.div
          key={s.id}
          className="bg-white shadow rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          <h4 className="font-bold text-lg text-[#002147] mb-1">{s.name}</h4>
          <p className="text-sm text-gray-600 mb-2">${s.price}</p>
          <p className="text-sm text-gray-700">
            {s.description?.length > 80 ? `${s.description.slice(0, 80)}...` : s.description}
          </p>
          <Link
            href={`/services/${s.id}`}
            className="mt-3 inline-block text-sm bg-[#002147] text-white py-1 px-3 rounded hover:bg-[#1a1a40] transition"
          >
            Ver más
          </Link>
        </motion.div>
      ))}
    </>
  )
}