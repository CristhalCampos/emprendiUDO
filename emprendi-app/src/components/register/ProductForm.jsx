export default function ProductForm({ formData, setFormData }) {
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

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', description: '', presentations: [] }],
    })
  }

  return (
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
              <p>Adjuntar en whatsapp después de enviar los datos del emprendimiento</p>
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
  )
}