let handler = async (m, { conn }) => {
    try {
        await m.react('🔗')
        let link = await conn.groupInviteCode(m.chat)

        let texto = `🐱 𓆩 𝗟𝗜𝗡𝗞 𝗗𝗘𝗟 𝗚𝗥𝗨𝗣𝗢 𓆪 🐱

.⃟𖥔 ݁. 𖦹˙— \`\`INVITACION\`\` —˙𖦹.💖꒷

──🌸 *𝗟𝗜𝗡𝗞* ╏ 💚
https://chat.whatsapp.com/${link}

──🌸 *𝗡𝗢𝗧𝗔* ╏ 🌸
💖 *Solo admins pueden resetear el link*
💖 *Marie dice: No lo compartas con desconocidos*

━━━━━━━━━━━
*Powered by*: ***COTTI BOTS x Marie*** 🌸`

        await conn.reply(m.chat, texto, m)
    } catch (e) {
        await m.react('❌')
        m.reply(`😿 *Marie dice: Error, no pude obtener el link. ¿Soy admin?*`)
    }
}

handler.help = ['link']
handler.tags = ['grupos']
handler.command = ['link', 'linkgroup', 'grouplink']
handler.group = true
handler.admin = true

export default handler