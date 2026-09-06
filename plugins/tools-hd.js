import axios from 'axios'
import FormData from 'form-data'

const api = {
    url: 'https://api.stellarwa.xyz',
    key: 'proyectsV2'
}

// Guardar la imagen temporal por 5 min
global.hdTemp = global.hdTemp || new Map()

function generateUniqueFilename(mime) {
  const ext = mime.split('/')[1] || 'jpg'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${id}.${ext}`
}

async function uploadToUguu(buffer, mime) {
  const body = new FormData()
  body.append('files[]', buffer, generateUniqueFilename(mime))
  const res = await axios.post('https://uguu.se/upload.php', body, {
    headers: body.getHeaders(),
    timeout: 30000
  })
  const url = res.data?.files?.[0]?.url
  if (!url) throw 'No se pudo subir a Uguu'
  return url
}

async function upscaleImage(url, scale = 2) {
  const apiUrl = `${api.url}/tools/upscale?url=${encodeURIComponent(url)}&scale=${scale}&key=${api.key}`
  const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 90000 })
  if (!res.data) throw 'Stellar HD no devolvió imagen'
  return Buffer.from(res.data)
}

// COMANDO PRINCIPAL: SOLO MUESTRA BOTONES
let handler = async (m, { conn }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''

    if (!mime) return m.reply(`Responde a una imagen con:.hd`)
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Solo se acepta imagen JPG/PNG`)
    }

    await m.react('📸')
    const buffer = await q.download()

    // Guardamos la imagen con el ID del mensaje
    const key = m.key.id
    global.hdTemp.set(key, { buffer, mime, time: Date.now() })

    // Borrar de la memoria en 5 min
    setTimeout(() => global.hdTemp.delete(key), 300000)

    const buttons = [
      { buttonId: `.hd2_${key}`, buttonText: { displayText: '✨ Obtener 2K' }, type: 1 },
      { buttonId: `.hd4_${key}`, buttonText: { displayText: '🚀 Obtener 4K' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `*MEJORA DE CALIDAD HD*\n\nElige la calidad que quieres:\n*2K*: Mejora x2. Rápido\n*4K*: Mejora x4. Tarda más`,
      footer: 'Bot HD by Stellar',
      buttons: buttons,
      headerType: 4
    }, { quoted: m })
}

// HANDLER PARA LOS BOTONES
handler.before = async (m, { conn }) => {
  if (!m.text) return
  if (!m.text.startsWith('.hd2_') &&!m.text.startsWith('.hd4_')) return

  let [cmd, key] = m.text.split('_')
  let scale = cmd === '.hd2'? 2 : 4

  const data = global.hdTemp.get(key)
  if (!data) return m.reply(`❌ La imagen expiró. Vuelve a usar.hd`)

  try {
    await m.react('⏳')
    const uploadedUrl = await uploadToUguu(data.buffer, data.mime)
    const hdBuffer = await upscaleImage(uploadedUrl, scale)

    await conn.sendMessage(m.chat, {
      image: hdBuffer,
      caption: `*Resultado HD ${scale}x*\nKey: proyectsV2`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      document: hdBuffer,
      fileName: `hd-${scale}x.png`,
      mimetype: 'image/png',
      caption: `Documento HD ${scale}x`
    }, { quoted: m })

    await m.react('✅')
    global.hdTemp.delete(key) // borrar después de usar

  } catch (err) {
    await m.react('❌')
    await m.reply(`Error: ${err.message || err}`)
  }
}

handler.help = ['hd']
handler.tags = ['tools', 'ai']
handler.command = /^(hd)$/i
export default handler