let detectEventsRegistered = false

export async function before(m, { conn }) {
  if (!detectEventsRegistered) {
    detectEventsRegistered = true

    // DETECTA ADMIN - FIX REAL
    conn.ev.on('group-participants.update', async (update) => {
      try {
        let chat = global.db.data.chats[update.id]
        if (!chat?.detect) return

        let author = update.author || 'Alguien'
        for (let user of update.participants) {
          if (update.action === 'promote') {
            let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`ADMIN DADO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Nuevo admin!* 👑
👑 *Por:* @${author.split('@')[0]}
🎖️ *Para:* @${user.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
            await conn.sendMessage(update.id, { text: txt, mentions: [author, user] })
          }
          if (update.action === 'demote') {
            let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`ADMIN QUITADO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Le quitaron admin!* 😿
👑 *Por:* @${author.split('@')[0]}
💔 *A:* @${user.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
            await conn.sendMessage(update.id, { text: txt, mentions: [author, user] })
          }
        }
      } catch (e) { console.log(e) }
    })

    // DETECTA NOMBRE, FOTO, DESC, LINK
    conn.ev.on('groups.update', async (updates) => {
      try {
        for (let update of updates) {
          let chat = global.db.data.chats[update.id]
          if (!chat?.detect) continue
          let author = update.author || 'Alguien'

          if (update.subject) {
            let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`NOMBRE\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Cambiaron el nombre!*
👑 *Por:* @${author.split('@')[0]}
📝 *Nuevo:* *${update.subject}*

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
            await conn.sendMessage(update.id, { text: txt, mentions: [author].filter(a => a.includes('@')) })
          }

          if (update.desc) {
            let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`DESCRIPCION\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Descripción cambiada!*
👑 *Por:* @${author.split('@')[0]}
📝 *Nueva:* ${update.desc.slice(0, 350)}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
            await conn.sendMessage(update.id, { text: txt, mentions: [author].filter(a => a.includes('@')) })
          }

          if (update.icon) {
            let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`FOTO\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Nueva foto del grupo!* 🖼️
👑 *Por:* @${author.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
            await conn.sendMessage(update.id, { text: txt, mentions: [author].filter(a => a.includes('@')) })
          }

          if (update.inviteCode) {
            let txt = `🐱 𓆩 𝗗𝗘𝗧𝗘𝗖𝗧 𓆪

.⃟𖥔 ݁. 𖦹˙— \`\`LINK\`\` —˙𖦹.💖꒷

🌸 *Marie dice: ¡Link reseteado!*
👑 *Por:* @${author.split('@')[0]}
🔗 *Link:* https://chat.whatsapp.com/${update.inviteCode}

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`
            await conn.sendMessage(update.id, { text: txt, mentions: [author].filter(a => a.includes('@')) })
          }
        }
      } catch (e) { console.log(e) }
    })
  }
  return true
}