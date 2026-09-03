let handler = async (m, { conn, args, command, usedPrefix }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  let type = command.replace('set', '').replace('del', '')
  let text = args.join(' ')

  // SET
  if (command.startsWith('set')) {
    if (!text) return m.reply(`🐱 𓆩 ***COTTI BOTS OFICIAL*** 𓆪 🐱\n\n🌸 *Marie dice: Configura tu mensaje*\n\n📌 *Uso:* ${usedPrefix}${command} <texto>\n\n*Variables:*\n@user = Menciona al user\n@group = Nombre del grupo\n@desc = Descripción del grupo`)

    chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`] = text
    await m.reply(`🐱 𓆩 *MENSAJE GUARDADO* 𓆪 🐱\n\n💖 *Marie guardó el ${type} personalizado*\n\n*Vista previa:*\n${text}`)
  }

  // DEL
  if (command.startsWith('del')) {
    if (!chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`]) {
      return m.reply(`😿 *Marie dice: No hay un ${type} personalizado configurado*`)
    }
    delete chat[`custom${type.charAt(0).toUpperCase() + type.slice(1)}`]
    await m.reply(`🐱 𓆩 *MENSAJE ELIMINADO* 𓆪 🐱\n\n❌ *Marie eliminó el ${type} personalizado*\nVolverá al mensaje por defecto`)
  }
}

handler.help = ['setwelcome', 'setbye', 'setkick', 'delwelcome', 'delbye', 'delkick']
handler.tags = ['config']
handler.command = /^(setwelcome|setbye|setkick|delwelcome|delbye|delkick)$/i
handler.group = true
handler.admin = true

export default handler