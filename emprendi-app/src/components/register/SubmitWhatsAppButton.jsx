export default function SubmitWhatsAppButton({ formData, WhatsApp }) {
  const generarMensaje = () => {
    let mensaje = `Hola, quiero registrar mi emprendimiento en emprendiUDO.\n\n`
    mensaje += `📌 Nombre del emprendimiento: ${formData.name}\n`
    mensaje += `📦 Tipo: ${formData.type}\n`
    mensaje += `📱 WhatsApp: ${formData.contact}\n`
    if (formData.instagram) mensaje += `📸 Instagram: ${formData.instagram}\n`
    mensaje += `📝 Descripción:\n${formData.description}\n`

    if (formData.type === 'productos') {
      mensaje += `\n🛍️ Productos:\n`
      formData.products.forEach((p, i) => {
        mensaje += `\n${i + 1}. ${p.name}\n`
        if (p.description) mensaje += `Descripción: ${p.description}\n`
        p.presentations?.forEach((pres) => {
          mensaje += `  - ${pres.name}: $${pres.price}\n`
        })
      })
    }

    if (formData.type === 'servicios') {
      mensaje += `\n💼 Servicios:\n`
      formData.services.forEach((s, i) => {
        mensaje += `\n${i + 1}. ${s.name}\nDescripción: ${s.description}\nPrecio: $${s.price}\n`
      })
    }

    return `https://wa.me/${WhatsApp}?text=${encodeURIComponent(mensaje)}`
  }

  return (
    <a
      href={generarMensaje()}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-6 text-center bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 transition"
    >
      Contactar por WhatsApp para registrar emprendimiento
    </a>
  )
}