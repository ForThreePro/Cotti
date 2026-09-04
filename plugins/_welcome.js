import { WAMessageStubType } from '@whiskeysockets/baileys'
import axios from 'axios'

let handler = async (m, { conn, args, isAdmin, isOwner, usedPrefix }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `🐱 𓆩 ***COTTI BOTS OFICIAL*** 𓆪 🐱\n\n🌸 *Marie dice: Solo admins pueden usar este comando*`, m)

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let tipo = args[0]?.toLowerCase()

  if (/on/i.test(tipo)) {
    chat.bienvenida = true
    return conn.reply(m.chat, `💖 𓆩 ***BIENVENIDA*** 𓆪 💖\n\n🟢 *Marie activó bienvenida con audios*`, m)
  }
  if (/off/i.test(tipo)) {
    chat.bienvenida = false
    return conn.reply(m.chat, `💖 𓆩 ***BIENVENIDA*** 𓆪 💖\n\n🔴 *Marie desactivó la bienvenida*`, m)
  }

  if (/setwelcome/i.test(tipo)) {
    let text = args.slice(1).join(' ')
    if (!text) return m.reply(`📌 *Uso:* ${usedPrefix}bienvenida setwelcome @user bienvenido a @group`)
    chat.customWelcome = text
    return m.reply(`✅ Mensaje de bienvenida guardado`)
  }
  if (/setbye/i.test(tipo)) {
    let text = args.slice(1).join(' ')
    if (!text) return m.reply(`📌 *Uso:* ${usedPrefix}bienvenida setbye @user salió de @group`)
    chat.customBye = text
    return m.reply(`✅ Mensaje de despedida guardado`)
  }
  if (/setkick/i.test(tipo)) {
    let text = args.slice(1).join(' ')
    if (!text) return m.reply(`📌 *Uso:* ${usedPrefix}bienvenida setkick @user fue expulsado de @group`)
    chat.customKick = text
    return m.reply(`✅ Mensaje de expulsión guardado`)
  }
  if (/setaudiowelcome/i.test(tipo)) {
    if (!m.quoted ||!m.quoted.audio) return m.reply(`📌 Responde a un audio con: ${usedPrefix}bienvenida setaudiowelcome`)
    chat.audiowelcome = await m.quoted.download()
    return m.reply(`✅ Audio de bienvenida guardado`)
  }
  if (/setaudiobye/i.test(tipo)) {
    if (!m.quoted ||!m.quoted.audio) return m.reply(`📌 Responde a un audio con: ${usedPrefix}bienvenida setaudiobye`)
    chat.audiobye = await m.quoted.download()
    return m.reply(`✅ Audio de despedida guardado`)
  }
  if (/setaudiokick/i.test(tipo)) {
    if (!m.quoted ||!m.quoted.audio) return m.reply(`📌 Responde a un audio con: ${usedPrefix}bienvenida setaudiokick`)
    chat.audiokick = await m.quoted.download()
    return m.reply(`✅ Audio de expulsión guardado`)
  }

  let menu = `🐱 𓆩 ***CONFIG BIENVENIDA*** 𓆪 🐱\n\n╭─💖─ \`\`COTTI BOTS x MARIE\`\` ─💖─╮\n│ Estado: ${chat.bienvenida? '🟢 Activado' : '🔴 Desactivado'}\n╰─✨ Temática: Marie ✨─╯`
  return conn.reply(m.chat, menu, m)
}

handler.help = ['bienvenida <on/off/set>']
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

    const imgFallback = 'https://files.evogb.win/ySkXCm.jpg'
    let imageToSend = null

    // INTENTO 1: Descargar foto del usuario
    try {
      let ppUrl = await conn.profilePictureUrl(userJid, 'image')
      imageToSend = { url: ppUrl }
    } catch {
      // INTENTO 2: Si falla, usar tu imagen de Marie por URL directo
      imageToSend = { url: imgFallback }
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
        image: imageToSend, // ahora siempre es {url:...}
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
    // ULTIMO RECURSO: mandar solo texto si todo falla
    try {
      await conn.reply(m.chat, `💖 Nuevo miembro: @${m.messageStubParameters?.[0]?.split('@')[0]}`, m)
    } catch {}
  }
  return!0
}

export default handler