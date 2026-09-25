import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNumber = '56931300864@s.whatsapp.net'

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (m.sender !== ownerNumber) {
        await react('❌')
        return conn.sendMessage(m.chat, { 
            text: `💞 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 🎀 𓆪 💞

⤷ ┇ 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 ﹒ ACCESO DENEGADO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DENEGADO\`\` 🔴 —˙𖦹.꒷
💞 Solo mi dueña puede usar esto pe

── *📊 INFO* ╏ 🎀
🔒 ➛ Comando: *.kickall*
👑 ➛ Solo: +56 9 3130 0864

━━━━━━━━━━━`, mentions: [m.sender] }, { quoted: m })
    }

    if (!m.isGroup) return m.reply('💞 Solo en grupos pe')

    try {
        await react('💞')
        let groupMetadata = await conn.groupMetadata(m.chat)
        let botId = conn.user.jid
        let botLid = conn.user.lid || ''

        // BLINDAJE EXTRA: EL BOT NUNCA SE VA
        let toKick = groupMetadata.participants
            .map(p => p.id)
            .filter(id => {
                if (id === botId) return false // JID del bot
                if (id === botLid) return false // LID del bot (nuevo WhatsApp)
                if (id === ownerNumber) return false // Tú
                if (id.includes('51927174369')) return false // Por si acaso tu LID
                return true
            })

        if (!toKick.length) {
            await react('😴')
            return m.reply('💞 No hay nadie para sacar pe, solo estamos tú y yo 🎀')
        }

        await conn.sendMessage(m.chat, { 
            text: `💞 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 🎀 𓆪 💞

⤷ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ KICKALL INICIADO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PURGA\`\` 🔴 —˙𖦹.꒷
💞 Sacando a todos menos a la jefa pe

── *📊 INFO* ╏ 🎀
🔴 ➛ Total: *${toKick.length}*
👑 ➛ Se quedan: *Tú y el bot*
💞 ➛ El bot: *NO se sale*

━━━━━━━━━━━`, mentions: [m.sender] }, { quoted: m })

        for (let id of toKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [id], 'remove')
                await new Promise(r => setTimeout(r, 800))
            } catch {}
        }

        await react('🔥')
        await conn.sendMessage(m.chat, { 
            text: `💞 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 🎀 𓆪 💞

⤷ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ COMPLETADO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`LIMPIO\`\` 🟢 —˙𖦹.꒷
💞 Listo pe, solo quedamos nosotras

── *📊 RESULTADO* ╏ 🎀
🗑️ ➛ Eliminados: *${toKick.length}*
👑 ➛ Quedan: *Tú y yo (bot)*

━━━━━━━━━━━
🎀 *COTTI BOT - 💞 EDITION* 💞
━━━━━━━━━━━` 
        })

    } catch (e) {
        return m.reply(`❌ ${e.message}\n💞 El bot debe ser admin pe`)
    }
}

handler.help = ['kickall']
handler.tags = ['owner']
handler.command = ['kickall', 'sacartodos', 'kicktodos']
handler.group = true
handler.botAdmin = true

export default handler