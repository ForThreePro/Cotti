import fetch from 'node-fetch'

// FUNCION PARA REACCIONES COMPATIBLE
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { args, conn }) => {
  try {
    if (!args[0]) {
      return conn.reply(
        m.chat,
        `🐱 *COTTI BOTS - DESCARGADOR* 🌸

Marie dice: Usa.facebook <link de facebook>
Ejemplo:.facebook https://www.facebook.com/watch?v=123`,
        m
      )
    }

    if (!args[0].match(/facebook\.com|fb\.watch/)) {
      await react(conn, m, '😿')
      return m.reply('🐱 *COTTI BOTS* \n❌ Ese enlace no es de Facebook~')
    }

    await react(conn, m, '🎀')
    await m.reply('🎀 *COTTI BOTS* \n⏳ Marie está procesando tu video... 🐾')

    const api = `https://yosoyyo-api-ofc.onrender.com/api/facebook?url=${encodeURIComponent(args[0])}&apiKey=yosoyyo_sk_2nbk5m69`
    const res = await fetch(api)
    const json = await res.json()

    const data = json.result || json.data || json

    const info = data.info || {}
    const author = data.author || {}
    const media = data.media || {}

    const videoUrl = media.video_hd || media.video_sd

    if (!videoUrl) {
      await react(conn, m, '😿')
      return conn.reply(
        m.chat,
        '🐱 *COTTI BOTS* \n❌ No pude obtener el enlace de descarga del video~',
        m
      )
    }

    const titulo = info.title || 'Video de Facebook'
    const duracion = info.duration? `\n⏱️ DURACIÓN: ${info.duration}` : ''
    const autorTxt = author.username? `\n👤 AUTOR: ${author.username}` : ''

    let txt = `╭─「 COTTI BOTS x MARIE 🌸 」
│
│ 📝 TÍTULO: ${titulo}${duracion}${autorTxt}
│
╰───────────────────────
💖 Descargando para ti...`

    await conn.sendFile(
      m.chat,
      videoUrl,
      'COTTI_BOTS_Marie.mp4',
      txt,
      m
    )

    await react(conn, m, '💖')

  } catch (error) {
    console.log('Facebook API Error:', error.message)
    await react(conn, m, '😿')
    await m.reply(`🐱 *COTTI BOTS* \n❌ Error: ${error.message}\nSoporte: +56 9 3130 0864`)
  }
}

handler.command = ['facebook', 'fb']
handler.tags = ['descargas']
handler.help = ['facebook <link>']
handler.limit = true

export default handler