'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const links = [
    { href: '/products', label: 'Productos' },
    { href: '/services', label: 'Servicios' },
    { href: '/faq', label: 'Preguntas Frecuentes' },
  ]

  return (
    <header className="bg-[#002147] text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-poppins">
          <img src="/logo.png" alt="Logo EmprendiUDO" className="h-14" />
        </Link>

        {/* Botón hamburguesa en mobile */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Menú"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú Desktop */}
        <ul className="hidden md:flex gap-6 items-center font-openSans text-base">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:text-[#F5B400] transition-colors">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/register"
              className="bg-[#F5B400] text-[#002147] px-4 py-2 rounded font-semibold hover:bg-[#e5a800] transition uppercase text-sm"
            >
              Registrar
            </Link>
          </li>
        </ul>
      </nav>

      {/* Menú Mobile */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-4 font-openSans text-base bg-[#002147]">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={closeMenu} className="block py-1">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/register"
              onClick={closeMenu}
              className="block text-center bg-[#F5B400] text-[#002147] px-4 py-2 rounded font-semibold uppercase text-sm"
            >
              Registrar
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}