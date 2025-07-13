export default function BasicInfoForm({ formData, setFormData }) {
  return (
    <>
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
      <p>Adjuntar en whatsapp después de enviar los datos del emprendimiento</p>
    </>
  )
}