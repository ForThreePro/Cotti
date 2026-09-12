import axios from 'axios'
import FormData from 'form-data'

const api = { url: 'https://api.stellarwa.xyz', key: 'proyectsV2' }

function generateUniqueFilename(mime) {
  const ext = mime.split('/')[1] || 'jpg'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${id}.${ext}`
}

async function uploadToUguu(buffer, mime) {
  const body = new FormData()
  body.append('files[]', buffer, generateUniqueFilename(mime))
  const res = await axios.post('https://uguu.se/upload.php', body, { headers: body.getHeaders(), timeout: 30000 })
  const url = res.data?.files?.[0]?.url
  if (!url) throw 'No se pudo subir a Uguu'
  return url
}

async function upscaleImage(url, scale = 2) {
  const apiUrl = `${api.url}/tools/upscale?url=${encodeURIComponent(url)}&scale=${scale}&key=${api.key}`
  const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 120000 })
  if (!res.data) throw 'Stellar HD no devolvió imagen'
  return Buffer.from(res.data)
}

let handler = async (m, { conn }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply(`Responde a una imagen con:.hd`)
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Solo JPG/PNG`)

    try {
      await m.react('⏳')
      let buffer = await q.download()
      let uploadedUrl = await uploadToUguu(buffer, mime)

      await m.reply(`✅ Procesando a *HD 4K*... espera un momento`)

      // SOLO PROCESAR 4K DIRECTO
      let hd4k = await upscaleImage(uploadedUrl, 4)

      // SOLO MANDAR IMAGEN - QUITÉ EL DOCUMENTO
      await conn.sendMessage(m.chat, {
        image: hd4k,
        caption: `✨ *HD 4K LISTO*\n\nCalidad: Ultra HD x4\nKey: proyectsV2`
      }, { quoted: m })

      await m.react('✅')

    } catch (err) {
      await m.react('❌')
      await m.reply(`Error: ${err.message || err}\n\nNota: 4K pesa mucho. Si falla intenta con una imagen mas pequeña`)
    }
}

handler.help = ['hd - Convierte imagen a 4K']
handler.tags = ['tools']
handler.command = /^(hd)$/i
export default handler