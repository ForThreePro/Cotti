import axios from 'axios'
import FormData from 'form-data'

const api = {
    url: 'https://api.stellarwa.xyz',
    key: 'proyectsV2'
}

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

let handler = async (m, { conn, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''

    if (!mime) return m.reply(`Responde a una imagen con:\n*.hd* para 2K\n*.hdf* para 4K`)
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Solo se acepta imagen JPG/PNG`)
    }

    // Detectar comando
    let scale = command === 'hdf'? 4 : 2
    let quality = scale === 4? '4K' : '2K'

    try {
      await m.react('⏳')

      const buffer = await q.download()
      const uploadedUrl = await uploadToUguu(buffer, mime)
      const hdBuffer = await upscaleImage(uploadedUrl, scale)

      // Enviar imagen HD
      await conn.sendMessage(m.chat, {
        image: hdBuffer,
        caption: `*Resultado HD ${quality}*\nMejora x${scale}\nKey: proyectsV2`
      }, { quoted: m })

      // Enviar también como documento
      await conn.sendMessage(m.chat, {
        document: hdBuffer,
        fileName: `hd-${quality}.png`,
        mimetype: 'image/png',
        caption: `Documento HD ${quality}`
      }, { quoted: m })

      await m.react('✅')

    } catch (err) {
      await m.react('❌')
      await m.reply(`Error: ${err.message || err}\n\nNota: 4K tarda mas y pesa mas. Si falla usa 2K`)
    }
}

handler.help = [
  'hd - Mejora imagen a 2K/Full HD',
  'hdf - Mejora imagen a 4K/Ultra HD'
]
handler.tags = ['tools', 'ai']
handler.command = /^(hd|hdf)$/i
export default handler