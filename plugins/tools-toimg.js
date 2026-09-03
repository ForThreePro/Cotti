import { webp2mp4 } from '../lib/webp2mp4.js'
import { ffmpeg, toAudio } from '../lib/converter.js'

let handler = async (m, { conn, command }) => {

  // TOVID
  if (['tovid', 'tovideo'].includes(command)) {
    if (!m.quoted) return conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱\n\n*━━━━━━━━━━*\n*⚠️ ERROR*\n\n*➤* Responde a un *sticker animado*\n*➤* Ejemplo: Responde al sticker + *tovid*\n\n*━━━━━━━━━━*`, m)
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱\n\n*━━━━━━━━━━*\n*⚠️ FORMATO NO VÁLIDO*\n\n*➤* Solo acepto *stickers animados* .webp\n\n*━━━━━━━━━━*`, m)
    try {
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
      let media = await m.quoted.download()
      let out = await webp2mp4(media)
      await conn.sendFile(m.chat, out, 'marie.mp4', `🐱 𓆩 𝗖𝗢𝗡𝗩𝗘𝗥𝗦𝗜𝗢𝗡 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗗𝗔 𓆪 🐱

.⃟𖥔 ݁. 𖦹˙— \`\`COTTI BOTS\`\` —˙𖦹.💖꒷

──🌸 *DATOS* ╏ 💚
💚 ➛ *Tu sticker animado ya es video*
💚 ➛ *Bot:* COTTI BOTS x Marie 🌸

━━━━━━━━━━━`, m)
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return conn.reply(m.chat, `😿 *Marie dice: No se pudo convertir*`, m)
    }
  }

  // TOMP3
  if (['tomp3', 'toaudio'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱\n\n*━━━━━━━━━━*\n*⚠️ ERROR DE USO*\n\n*➤* Responde a un *video* o *nota de voz*\n*➤* Ejemplo: Responde al video + *tomp3*\n\n*━━━━━━━━━━*`, m)
    try {
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
      let media = await q.download?.()
      let audio = await toAudio(media, 'mp4')
      await conn.sendFile(m.chat, audio.data, 'marie.mp3', `🐱 𓆩 𝗔𝗨𝗗𝗜𝗢 𝗘𝗫𝗧𝗥𝗔𝗜𝗗𝗢 𓆪 🐱

.⃟𖥔 ݁. 𖦹˙— \`\`COTTI BOTS\`\` —˙𖦹.💖꒷

──🌸 *DATOS* ╏ 💚
💚 ➛ *Tu video/audio ya es mp3*
💚 ➛ *Bot:* COTTI BOTS x Marie 🌸

━━━━━━━━━━━`, m, null, { mimetype: 'audio/mp4' })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return conn.reply(m.chat, `😿 *Marie dice: No se pudo convertir*`, m)
    }
  }

  // TOIMG
  if (['toimg', 'stickerimg', 'simg'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let isSticker = q.mtype === 'stickerMessage' || (q.mimetype || '').includes('webp')
    if (!isSticker) return m.reply(`🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱\n\n*━━━━━━━━━━*\n*⚠️ ERROR DE USO*\n\n*➤* Responde a un *sticker*\n*➤* Ejemplo: Responde al sticker + *toimg*\n\n*━━━━━━━━━━*`)
    try {
      await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } })
      let media = await q.download()
      await conn.sendMessage(m.chat, { image: media, caption: `🐱 𓆩 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢 𓆪 🐱

.⃟𖥔 ݁. 𖦹˙— \`\`COTTI BOTS\`\` —˙𖦹.💖꒷

──🌸 *DATOS* ╏ 💚
💚 ➛ *Tu sticker ya es imagen JPG*
💚 ➛ *Bot:* COTTI BOTS x Marie 🌸

━━━━━━━━━━━` }, { quoted: m })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      m.reply(`😿 *Marie dice: No pude convertir el sticker*`)
    }
  }
}

handler.help = ['tovid', 'tomp3', 'toimg']
handler.tags = ['tools']
handler.command = ['tovid', 'tovideo', 'tomp3', 'toaudio', 'toimg', 'stickerimg', 'simg']
export default handler