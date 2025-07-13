export default function ServiceForm({ formData, setFormData }) {
  const handleServiceChange = (index, key, value) => {
    const updated = [...formData.services]
    updated[index][key] = value
    setFormData({ ...formData, services: updated })
  }

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: '', description: '', price: '', image: null }],
    })
  }

  return (
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
          <p>Adjuntar en whatsapp después de enviar los datos del emprendimiento</p>
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
  )
}