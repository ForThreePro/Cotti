let catalogoImg = { url: 'https://files.evogb.win/UHUtT3.jpg' }

export async function before(m, { conn }) {
  if (!m.isGroup) return
  if (!m.messageStubType) return

  let chat = global.db.data.chats[m.chat]
  if (!chat) {
    global.db.data.chats[m.chat] = {}
    chat = global.db.data.chats[m.chat]
  }
  if (!chat.detect) return

  console.log('DETECT:', m.messageStubType, m.messageStubParameters, m.sender)

  let who = m.sender
  let target = m.messageStubParameters?.[0] || ''

  try {
    // 21 = CAMBIO NOMBRE
    if (m.messageStubType == 21) {
      await conn.sendMessage(m.chat, {
        image: catalogoImg,
        caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`NOMBRE\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Cambiaron el nombre!*
👑 *Por:* @${who.split('@')[0]}
📝 *Nuevo:* *${target}*

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
        mentions: [who]
      })
    }

    // 22 = CAMBIO FOTO
    if (m.messageStubType == 22) {
      await conn.sendMessage(m.chat, {
        image: catalogoImg,
        caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`FOTO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Nueva foto!*
👑 *Por:* @${who.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
        mentions: [who]
      })
    }

    // 23 = RESET LINK
    if (m.messageStubType == 23) {
      let code = await conn.groupInviteCode(m.chat).catch(() => 'No pude obtenerlo')
      await conn.sendMessage(m.chat, {
        image: catalogoImg,
        caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`LINK\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Link reseteado!*
👑 *Por:* @${who.split('@')[0]}
🔗 *Link:* https://chat.whatsapp.com/${code}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
        mentions: [who]
      })
    }

    // 25 = GRUPO ABIERTO/CERRADO, 26 = RESTRICCION, 29 = INFO EDIT
    if ([25, 26, 29].includes(m.messageStubType)) {
      let accion = ''
      if (m.messageStubType == 25) accion = target == 'on'? '🔒 Grupo cerrado (solo admins)' : '🔓 Grupo abierto (todos)'
      if (m.messageStubType == 26) accion = target == 'on'? '🔒 Solo admins pueden editar info' : '🔓 Todos pueden editar info'
      if (m.messageStubType == 29) accion = target == 'on'? '🔒 Solo admins pueden editar info' : '🔓 Todos pueden editar info'

      await conn.sendMessage(m.chat, {
        image: catalogoImg,
        caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`AJUSTES\`\` —˙𖦹.💖꒷

🌸 *Marie dice:* ${accion}
👑 *Por:* @${who.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
        mentions: [who]
      })
    }

    // DESCRIPCION - En algunos bots es 24, en otros viene como 27 con 2 params
    if (m.messageStubType == 24 || m.messageStubType == 27) {
      // Si es descripción, target tiene texto largo
      if (target && target.length > 15) {
        await conn.sendMessage(m.chat, {
          image: catalogoImg,
          caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`DESCRIPCION\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Descripción cambiada!*
👑 *Por:* @${who.split('@')[0]}
📝 *Nueva:* ${target.slice(0, 300)}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
          mentions: [who]
        })
        return
      }
    }

    // PROMOTE - 29, 32, 27 (depende de la versión)
    // DEMOTE - 28
    // Forma correcta de detectar admin
    if (m.messageStubType == 29 || m.messageStubType == 28 || m.messageStubType == 27 || m.messageStubType == 32) {
      // Si el parámetro es un jid, es admin
      if (target && target.includes('@s.whatsapp.net')) {
        let esPromote = m.messageStubType == 29 || m.messageStubType == 27 || m.messageStubType == 32
        // Algunos baileys usan 28 para demote, 29 para promote
        if (m.messageStubParameters?.[1] === 'demote' || m.messageStubType == 28) esPromote = false
        if (m.messageStubParameters?.[1] === 'promote' || m.messageStubType == 27 || m.messageStubType == 32) esPromote = true

        if (esPromote) {
          await conn.sendMessage(m.chat, {
            image: catalogoImg,
            caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`ADMIN DADO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Nuevo admin!*
👑 *Dado por:* @${who.split('@')[0]}
🎖️ *Para:* @${target.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
            mentions: [who, target]
          })
        } else {
          await conn.sendMessage(m.chat, {
            image: catalogoImg,
            caption: `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`ADMIN QUITADO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Le quitaron admin!* 😿
👑 *Por:* @${who.split('@')[0]}
💔 *A:* @${target.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`,
            mentions: [who, target]
          })
        }
      }
    }

  } catch (e) {
    console.log('Error detect:', e)
  }
}