let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!mentionedJid) return m.reply(`🐱 𓆩 ***COTTI BOTS OFICIAL*** 𓆪 🐱

🌸 *Marie dice: Así me usas*

*Uso:*
.mute @user → Para mutear
.unmute @user → Para desmutear

> *Etiqueta a una persona o responde a un mensaje*`)

    let isUserAdmin = participants.find(p => p.id === mentionedJid)?.admin
    if (isUserAdmin) return m.reply(`💖 *Marie dice: No puedes mutear a un administrador.*`)
    if (mentionedJid === conn.user.jid) return m.reply(`💖 *Marie dice: No puedo mutearme a mí misma.*`)

    if (command === "mute") {
        if (mutedUsers.has(mentionedJid)) return m.reply(`😿 *Marie dice: Este usuario ya está muteado*`)
        mutedUsers.add(mentionedJid)
        await m.react('🔇')
        conn.reply(m.chat, `🐱 𓆩 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗠𝗨𝗧𝗘𝗔𝗗𝗢 𓆪 🐱

🔇 *Usuario:* @${mentionedJid.split('@')[0]}
👑 *Por:* @${m.sender.split('@')[0]}

> *Marie silenciará sus mensajes automaticamente* 🌸`, m, { mentions: [mentionedJid, m.sender] })
    } else if (command === "unmute") {
        if (!mutedUsers.has(mentionedJid)) return m.reply(`😼 *Marie dice: Este usuario no está muteado*`)
        mutedUsers.delete(mentionedJid)
        await m.react('🔊')
        conn.reply(m.chat, `🐱 𓆩 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗗𝗘𝗦𝗠𝗨𝗧𝗘𝗔𝗗𝗢 𓆪 🐱

🔊 *Usuario:* @${mentionedJid.split('@')[0]}
👑 *Por:* @${m.sender.split('@')[0]}

> *Ya puede volver a maullar* 💖`, m, { mentions: [mentionedJid, m.sender] })
    }
}

handler.before = async (m, { conn }) => {
    // Si el remitente del mensaje está en la lista de muteados, eliminamos el mensaje
    if (mutedUsers.has(m.sender)) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key })
        } catch (e) {
            console.error(e)
        }
    }
}

handler.help = ['mute @user', 'unmute @user']
handler.tags = ['grupos']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler