'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function EntrepreneurCarousel({ entrepreneurs }) {
  const scrollRef = useRef(null)

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  if (entrepreneurs.length === 1) {
    const single = entrepreneurs[0]
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        className="w-full max-w-5xl mx-auto flex justify-center items-center py-4"
      >
        <div className="w-full bg-gray-100 rounded shadow p-4 flex flex-col items-center">
          <img
            src={single.logo_url || '/placeholder.jpg'}
            alt={single.name}
            className="max-h-40 object-contain mb-4"
          />
          <h4 className="text-lg font-semibold text-[#002147]">{single.name}</h4>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {entrepreneurs.length > 2 && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#002147] text-white p-2 rounded-full z-10 hover:bg-[#e5a800] transition"
          aria-label="Anterior"
        >
          ‹
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-6"
      >
        {entrepreneurs.map((e) => (
          <motion.div
            key={e.id}
            className="min-w-[200px] flex-shrink-0 bg-gray-100 rounded shadow p-4 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: false }}
          >
            <img
              src={e.logo_url || '/placeholder.jpg'}
              alt={e.name}
              className="max-h-28 object-contain mb-2"
            />
            <h4 className="text-center text-sm font-semibold text-[#002147]">
              {e.name}
            </h4>
          </motion.div>
        ))}
      </div>

      {entrepreneurs.length > 2 && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#002147] text-white p-2 rounded-full z-10 hover:bg-[#e5a800] transition"
          aria-label="Siguiente"
        >
          ›
        </button>
      )}
    </div>
  )
}