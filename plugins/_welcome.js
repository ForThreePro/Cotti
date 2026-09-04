import { WAMessageStubType } from '@whiskeysockets/baileys'
import axios from 'axios'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `🐱 𓆩 ***COTTI BOTS OFICIAL*** 𓆪 🐱\n\n🌸 *Marie dice: Solo admins pueden usar este comando*`, m)
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, `💖 𓆩 ***BIENVENIDA*** 𓆪 💖\n\n🟢 *Marie activó bienvenida con audios*`, m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, `💖 𓆩 ***BIENVENIDA*** 𓆪 💖\n\n🔴 *Marie desactivó la bienvenida*`, m)
  } else {
    await conn.reply(m.chat, `🐱 𓆩 ***COTTI BOTS OFICIAL*** 𓆪 🐱\n\n📌 *Uso:* ${m.prefix}bienvenida on/off\n🌸 *Temática:* Marie`, m)
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['config']
handler.command = /^(bienvenida|welcome|bye)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return!0
    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat ||!chat.bienvenida) return!0

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return!0

    // IMAGEN FALLBACK DE MARIE
    const imgFallback = 'https://files.catbox.moe/dsgmid.jpg'
    let ppBuffer

    try {
      let ppUrl = await conn.profilePictureUrl(userJid, 'image')
      ppBuffer = (await axios.get(ppUrl, { responseType: 'arraybuffer' })).data
    } catch {
      // Si no tiene foto, usa la de Marie
      ppBuffer = (await axios.get(imgFallback, { responseType: 'arraybuffer' })).data
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Sin descripción'
    const membersCount = groupMetadata.participants.length

    let txt = '', audio = null

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        audio = chat.audiowelcome
        txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`💖 𓆩 ***NUEVO GATITO*** 𓆪 💖\n\n🐱 *${userTag}* llegó a *${groupName}*\n🌸 *Miembro N°:* ${membersCount}\nMarie te recibe con cariño~`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        audio = chat.audiobye
        txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`😿 𓆩 ***SE FUE*** 𓆪 😿\n\n💤 *${userTag}* salió de *${groupName}*\n📉 *Quedamos:* ${membersCount}`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        audio = chat.audiokick
        txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🙀 𓆩 ***EXPULSADO*** 𓆪 🙀\n\n🥊 *${userTag}* fue expulsado de *${groupName}*`
        break
    }

    if (txt) {
      await conn.sendMessage(m.chat, {
        image: ppBuffer, // ahora siempre manda buffer
        caption: txt,
        mentions: [userJid]
      })

      if (audio) {
        if (Buffer.isBuffer(audio)) {
          await conn.sendMessage(m.chat, { audio: audio, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
        } else if (typeof audio === 'string' && audio.startsWith('http')) {
          await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
        }
      }
    }
  } catch (e) {
    console.error("Error en Bienvenida Audio:", e)
  }
  return!0
}

export default handler