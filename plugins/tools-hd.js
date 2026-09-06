import axios from 'axios'
import FormData from 'form-data'

const api = { url: 'https://api.stellarwa.xyz', key: 'proyectsV2' }

// Guardar buffer temporal para el botón
global.hdDocTemp = global.hdDocTemp || new Map()

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

      // PASO 1: HACER 2K
      let hd2k = await upscaleImage(uploadedUrl, 2)
      await conn.sendMessage(m.chat, {
        image: hd2k,
        caption: `✅ Ya lo convertí en *HD 2K*\n\nEstoy procesando a *4K*... espera un momento`
      }, { quoted: m })

      // PASO 2: HACER 4K
      let hd4k = await upscaleImage(uploadedUrl, 4)

      // Guardar el 4k para el botón de documento
      const key = m.key.id
      global.hdDocTemp.set(key, { buffer: hd4k, time: Date.now() })
      setTimeout(() => global.hdDocTemp.delete(key), 600000) // 10 min

      // PASO 3: MANDAR 4K CON BOTON
      const buttons = [
        { buttonId: `.gdoc_${key}`, buttonText: { displayText: '📄 Obtener Documento' }, type: 1 }
      ]
      await conn.sendMessage(m.chat, {
        image: hd4k,
        caption: `✨ *HD 4K LISTO*\n\nCalidad: Ultra HD\nSi quieres descargarlo en buena calidad dale al botón`,
        footer: 'Bot HD',
        buttons: buttons,
        headerType: 4
      }, { quoted: m })

      await m.react('✅')

    } catch (err) {
      await m.react('❌')
      await m.reply(`Error: ${err.message || err}`)
    }
}

// HANDLER PARA EL BOTON DE DOCUMENTO
handler.before = async (m, { conn }) => {
  if (!m.text?.startsWith('.gdoc_')) return
  let key = m.text.split('_')[1]
  const data = global.hdDocTemp.get(key)
  if (!data) return m.reply(`❌ El archivo expiró. Usa.hd de nuevo`)

  await m.react('📄')
  await conn.sendMessage(m.chat, {
    document: data.buffer,
    fileName: `hd-4k.png`,
    mimetype: 'image/png',
    caption: `Documento HD 4K`
  }, { quoted: m })
  await m.react('✅')
  global.hdDocTemp.delete(key)
}

handler.help = ['hd - Convierte a 2K y luego a 4K automaticamente']
handler.tags = ['tools', 'ai']
handler.command = /^(hd)$/i
export default handler