'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data?.user) {
      alert('Credenciales incorrectas')
      setLoading(false)
      return
    }

    const adminUID = process.env.NEXT_PUBLIC_ADMIN_UID

    // Validar si el usuario es el admin
    if (data.user.id !== adminUID) {
      await supabase.auth.signOut()
      alert('No tienes permisos para acceder como administrador')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-semibold font-poppins text-[#002147] mb-4">Iniciar sesión como admin</h2>

      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded shadow-md flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Correo del administrador</label>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#002147] text-white px-6 py-2 rounded font-semibold hover:bg-[#1a1a40] transition uppercase text-sm disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}