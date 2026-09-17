import moment from 'moment-timezone'
moment.locale('es')

export async function before(m, { conn }) {
  if (!m.isGroup) return
  if (!m.messageStubType) return
  let chat = global.db.data.chats[m.chat]
  if (!chat ||!chat.detect) return

  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  try {
    // CAMBIO DE NOMBRE - 21
    if (m.messageStubType == 21) {
      let txt = `🍕 𓆩 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𓆪 🍕

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓 ﹒ NOMBRE ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIADO\`\` 📝 —˙𖦹.꒷

── *👤 ACCION* ╏ 🍕
👑 ➛ Por: @${m.sender.split('@')[0]}
📝 ➛ Nuevo: *${m.messageStubParameters[0]}*

━━━━━━━━━━━
🍕 *GARFIELD BOT* 🍕
━━━━━━━━━━━`
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] })
    }

    // CAMBIO DE FOTO - 22
    if (m.messageStubType == 22) {
      let txt = `🍕 𓆩 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𓆪 🍕

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓 ﹒ FOTO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIADA\`\` 🖼️ —˙𖦹.꒷

── *👤 ACCION* ╏ 🍕
👑 ➛ Por: @${m.sender.split('@')[0]}
🖼️ ➛ La foto del grupo fue cambiada

━━━━━━━━━━━
🍕 *GARFIELD BOT* 🍕
━━━━━━━━━━━`
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] })
    }

    // RESET LINK - 23
    if (m.messageStubType == 23) {
      let code = await conn.groupInviteCode(m.chat).catch(() => 'Error')
      let txt = `🍕 𓆩 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𓆪 🍕

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓 ﹒ LINK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESETEADO\`\` 🔗 —˙𖦹.꒷

── *👤 ACCION* ╏ 🍕
👑 ➛ Por: @${m.sender.split('@')[0]}
🔗 ➛ Nuevo: https://chat.whatsapp.com/${code}

━━━━━━━━━━━
🍕 *GARFIELD BOT* 🍕
━━━━━━━━━━━`
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] })
    }

    // DESCRIPCION - 24
    if (m.messageStubType == 24) {
      let txt = `🍕 𓆩 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𓆪 🍕

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓 ﹒ DESCRIPCION ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`CAMBIADA\`\` 📄 —˙𖦹.꒷

── *👤 ACCION* ╏ 🍕
👑 ➛ Por: @${m.sender.split('@')[0]}
📝 ➛ Nueva: ${m.messageStubParameters[0] || 'Vacía'}

━━━━━━━━━━━
🍕 *GARFIELD BOT* 🍕
━━━━━━━━━━━`
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] })
    }

    // ADMIN DADO - 27 y 32
    if ([27, 32].includes(m.messageStubType)) {
      let txt = `🍕 𓆩 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𓆪 🍕

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓 ﹒ ADMIN ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DADO\`\` 👑 —˙𖦹.꒷

── *👤 ACCION* ╏ 🍕
👑 ➛ Por: @${m.sender.split('@')[0]}
🎖️ ➛ Nuevo admin: @${m.messageStubParameters[0].split('@')[0]}

━━━━━━━━━━━
🍕 *GARFIELD BOT* 🍕
━━━━━━━━━━━`
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender, m.messageStubParameters[0]] })
    }

    // ADMIN QUITADO - 28
    if (m.messageStubType == 28) {
      let txt = `🍕 𓆩 𝗚𝗔𝗥𝗙𝗜𝗘𝗟𝗗 𝗕𝗢𝗧 𓆪 🍕

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓 ﹒ ADMIN ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`QUITADO\`\` 💔 —˙𖦹.꒷

── *👤 ACCION* ╏ 🍕
👑 ➛ Por: @${m.sender.split('@')[0]}
💔 ➛ Ex-admin: @${m.messageStubParameters[0].split('@')[0]}

━━━━━━━━━━━
🍕 *GARFIELD BOT* 🍕
━━━━━━━━━━━`
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender, m.messageStubParameters[0]] })
    }

  } catch (e) {
    console.log(e)
  }
}