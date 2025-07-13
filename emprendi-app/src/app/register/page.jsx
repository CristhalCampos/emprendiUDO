'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Page() {
  const [WhatsApp, setWhatsApp] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    type: 'productos',
    contact: '',
    instagram: '',
    description: '',
    logo: null,
    products: [],
    services: [],
  })

  useEffect(() => {
    const fetchWhatsApp = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', process.env.NEXT_PUBLIC_ADMIN_UID)
        .single()

      if (error) {
        console.error('Error fetching WhatsApp:', error)
      } else {
        setWhatsApp(data?.phone_number || '')
      }
    }

    fetchWhatsApp()
  }, [])

  const handleLogoChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] })
  }

  const handleProductChange = (index, key, value) => {
    const updated = [...formData.products]
    updated[index][key] = value
    setFormData({ ...formData, products: updated })
  }

  const handlePresentationChange = (pIndex, presIndex, key, value) => {
    const updated = [...formData.products]
    updated[pIndex].presentations[presIndex][key] = value
    setFormData({ ...formData, products: updated })
  }

  const addPresentation = (pIndex) => {
    const updated = [...formData.products]
    updated[pIndex].presentations.push({ name: '', price: '', image: null })
    setFormData({ ...formData, products: updated })
  }

  const handlePresentationImageChange = (pIndex, presIndex, file) => {
    const updated = [...formData.products]
    updated[pIndex].presentations[presIndex].image = file
    setFormData({ ...formData, products: updated })
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { name: '', description: '', presentations: [] },
      ],
    })
  }

  const handleServiceChange = (index, key, value) => {
    const updated = [...formData.services]
    updated[index][key] = value
    setFormData({ ...formData, services: updated })
  }

  const handleServiceImageChange = (index, file) => {
    const updated = [...formData.services]
    updated[index].image = file
    setFormData({ ...formData, services: updated })
  }

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: '', description: '', price: '', image: null }],
    })
  }

  const generarMensajeWhatsapp = () => {
    let mensaje = `Hola, quiero registrar mi emprendimiento en emprendiUDO.\n\n`
    mensaje += `📌 Nombre del emprendimiento: ${formData.name}\n`
    mensaje += `📦 Tipo: ${formData.type}\n`
    mensaje += `📱 WhatsApp: ${formData.contact}\n`
    if (formData.instagram) mensaje += `📸 Instagram: ${formData.instagram}\n`
    mensaje += `📝 Descripción:\n${formData.description}\n`

    if (formData.type === 'productos' && formData.products.length > 0) {
      mensaje += `\n🛍️ Productos:\n`
      formData.products.forEach((p, i) => {
        mensaje += `\n${i + 1}. ${p.name}\n`
        if (p.description) mensaje += `Descripción: ${p.description}\n`
        if (p.presentations?.length > 0) {
          mensaje += `Presentaciones:\n`
          p.presentations.forEach((pres, j) => {
            mensaje += `  - ${pres.name || 'Cantidad desconocida'}: $${pres.price || 0}\n`
          })
        }
      })
    }

    if (formData.type === 'servicios' && formData.services.length > 0) {
      mensaje += `\n💼 Servicios:\n`
      formData.services.forEach((s, i) => {
        mensaje += `\n${i + 1}. ${s.name}\n`
        if (s.description) mensaje += `Descripción: ${s.description}\n`
        mensaje += `Precio: $${s.price || 0}\n`
      })
    }

    const encoded = encodeURIComponent(mensaje)
    return `https://wa.me/${WhatsApp}?text=${encoded}`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Registrar emprendimiento</h1>

      <p className="mb-4 text-gray-700">
        Para registrar tu emprendimiento, llena los datos a continuación como guía, y luego haz clic en el botón para contactarnos por WhatsApp.
      </p>

      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="Nombre del emprendimiento"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="productos">Productos</option>
          <option value="servicios">Servicios</option>
        </select>

        <input
          type="text"
          placeholder="Número de WhatsApp"
          required
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Instagram (opcional)"
          value={formData.instagram}
          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Descripción del emprendimiento"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium">Logo del emprendimiento</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="w-full border p-2 rounded"
        />

        {formData.type === 'productos' && (
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">Productos</h2>
            {formData.products.map((product, i) => (
              <div key={i} className="p-4 border rounded mb-6 bg-gray-50">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={product.name}
                  onChange={(e) => handleProductChange(i, 'name', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <textarea
                  placeholder="Descripción"
                  value={product.description}
                  onChange={(e) => handleProductChange(i, 'description', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />

                <h4 className="font-medium mt-2">Presentaciones</h4>
                {product.presentations.map((pres, j) => (
                  <div key={j} className="flex flex-col gap-2 mt-2 border p-2 rounded bg-white">
                    <input
                      type="text"
                      placeholder="Cantidad"
                      value={pres.name}
                      onChange={(e) => handlePresentationChange(i, j, 'name', e.target.value)}
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Precio"
                      value={pres.price}
                      onChange={(e) => handlePresentationChange(i, j, 'price', e.target.value)}
                      className="border p-2 rounded"
                    />
                    <label className="text-sm">Imagen presentación</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handlePresentationImageChange(i, j, e.target.files[0])
                      }
                      className="border p-2 rounded"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPresentation(i)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  + Agregar presentación
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Agregar producto
            </button>
          </div>
        )}

        {formData.type === 'servicios' && (
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">Servicios</h2>
            {formData.services.map((srv, i) => (
              <div key={i} className="p-4 border rounded mb-4 bg-gray-50">
                <input
                  type="text"
                  placeholder="Nombre del servicio"
                  value={srv.name}
                  onChange={(e) => handleServiceChange(i, 'name', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <textarea
                  placeholder="Descripción"
                  value={srv.description}
                  onChange={(e) => handleServiceChange(i, 'description', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio"
                  value={srv.price}
                  onChange={(e) => handleServiceChange(i, 'price', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <label className="text-sm">Imagen del servicio</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleServiceImageChange(i, e.target.files[0])}
                  className="border p-2 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Agregar servicio
            </button>
          </div>
        )}

        <a
          href={generarMensajeWhatsapp()}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-6 text-center bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 transition"
        >
          Contactar por WhatsApp para registrar emprendimiento
        </a>
      </form>
    </div>
  )
}