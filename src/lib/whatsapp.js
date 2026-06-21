// Builds a wa.me deep link with a pre-filled message. Uses the configured
// WhatsApp number if set, otherwise falls back to the general contact phone.
export function getWhatsAppLink(contactInfo, message) {
  const number = (contactInfo.whatsapp || contactInfo.phone || '').replace(/\D/g, '')
  const text = message || `Hi shubhasparshanepal! I'd like to inquire about your event planning services.`
  return `https://wa.me/977${number}?text=${encodeURIComponent(text)}`
}
