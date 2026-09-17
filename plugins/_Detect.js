export async function before(m, { conn }) {
  if (!m.isGroup) return
  if (!m.messageStubType) return
  let chat = global.db.data.chats[m.chat]
  if (!chat ||!chat.detect) return

  let catalogoImg = { url: 'https://files.evogb.win/UHUtT3.jpg' }

  try {
    // NOMBRE - 21
    if (m.messageStubType == 21) {
      let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`NOMBRE\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Cambiaron el nombre!*
👑 *Por:* @${m.sender.split('@')[0]}
📝 *Nuevo:* *${m.messageStubParameters[0]}*

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
      await conn.sendMessage(m.chat, { image: catalogoImg, caption: txt, mentions: [m.sender] })
    }

    // FOTO - 22
    if (m.messageStubType == 22) {
      let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`FOTO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Nueva foto del grupo!*
👑 *Por:* @${m.sender.split('@')[0]}
🖼️ *Foto cambiada*

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
      await conn.sendMessage(m.chat, { image: catalogoImg, caption: txt, mentions: [m.sender] })
    }

    // LINK - 23
    if (m.messageStubType == 23) {
      let code = await conn.groupInviteCode(m.chat).catch(() => 'Error')
      let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`LINK\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Link reseteado!*
👑 *Por:* @${m.sender.split('@')[0]}
🔗 *Nuevo:* https://chat.whatsapp.com/${code}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
      await conn.sendMessage(m.chat, { image: catalogoImg, caption: txt, mentions: [m.sender] })
    }

    // DESCRIPCION - 24
    if (m.messageStubType == 24) {
      let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`DESCRIPCION\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Descripción cambiada!*
👑 *Por:* @${m.sender.split('@')[0]}
📝 *Nueva:* ${m.messageStubParameters[0] || 'Vacía'}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
      await conn.sendMessage(m.chat, { image: catalogoImg, caption: txt, mentions: [m.sender] })
    }

    // ADMIN DADO - 27 y 32
    if ([27, 32].includes(m.messageStubType)) {
      let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`ADMIN\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Nuevo admin en el grupo!*
👑 *Dado por:* @${m.sender.split('@')[0]}
🎖️ *Nuevo admin:* @${m.messageStubParameters[0].split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
      await conn.sendMessage(m.chat, { image: catalogoImg, caption: txt, mentions: [m.sender, m.messageStubParameters[0]] })
    }

    // ADMIN QUITADO - 28
    if (m.messageStubType == 28) {
      let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`ADMIN\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Le quitaron admin!* 😿
👑 *Por:* @${m.sender.split('@')[0]}
💔 *Ex-admin:* @${m.messageStubParameters[0].split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
      await conn.sendMessage(m.chat, { image: catalogoImg, caption: txt, mentions: [m.sender, m.messageStubParameters[0]] })
    }

  } catch (e) {
    console.log(e)
  }
}