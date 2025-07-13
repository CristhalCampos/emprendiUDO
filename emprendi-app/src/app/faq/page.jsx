'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'

const faqs = [
  {
    question: '¿Cómo puedo comprar un producto o solicitar un servicio?',
    answer:
      'Cuando encuentres algo que te interese, haz clic en el botón “Contactar” y serás redirigido al WhatsApp del emprendedor. Allí confirmarás disponibilidad y coordinarás pago y entrega.',
  },
  {
    question: '¿Cómo sé si un producto está disponible?',
    answer:
      'Debes escribir directamente al emprendedor por WhatsApp para confirmar si el producto o servicio sigue disponible.',
  },
  {
    question: '¿Dónde se entregan los productos o se prestan los servicios?',
    answer:
      'Normalmente se coordinan entregas dentro de los espacios de la Universidad de Oriente. Acordarás detalles directamente con el emprendedor.',
  },
  {
    question: '¿Qué formas de pago se aceptan?',
    answer:
      'Los emprendedores aceptan diversos métodos como pago móvil o efectivo. Ellos te darán los datos por WhatsApp.',
  },
  {
    question: '¿Qué tipo de productos y servicios puedo encontrar?',
    answer:
      'Puedes encontrar repostería, arte, accesorios, clases particulares, alquiler de equipos, impresiones, y mucho más.',
  },
  {
    question: '¿Cómo puedo registrar mi emprendimiento?',
    answer:
      'Haz clic en el botón "Registrar" en el menú principal para enviar los datos de tu emprendimiento.',
  },
]

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#002147] mb-8 font-poppins">
        Preguntas Frecuentes
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className="rounded-lg shadow-md bg-[#F5F5F7]">
                <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-left text-[#002147] hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-[#F5B400] font-semibold font-openSans">
                  <span>{faq.question}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-[#F5B400] transition-transform`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel as={motion.div}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pt-0 pb-5 text-sm text-gray-700 font-openSans"
                >
                  {faq.answer}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}