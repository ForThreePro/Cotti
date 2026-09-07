import os from 'os'
import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix }) => {
  let loadMsg = await conn.reply(m.chat, `🌸 𓆩 𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢 𝗠𝗘𝗡𝗨 𓆪 🌸\n\n💕 *Marie dice: Espere un momentito...*\n> Cargando magia de COTTI BOTS...`, m)

  let taguser = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.sender

  let img = { url: 'https://files.evogb.win/ySkXCm.jpg' }

  let uptime = process.uptime() * 1000
  let _uptime = clockString(uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalcmd = Object.values(global.plugins).filter(p => p.help &&!p.disabled).length
  let start = performance.now()
  let end = performance.now()
  let ping = (end - start).toFixed(2)

  let owner = '56931300864'
  let ownerTag = `@${owner}`
  let numBot = conn.user.jid.split('@')[0]

  let help = Object.values(global.plugins).filter(p => p.help &&!p.disabled)
  let groups = {}
  for (let plugin of help) {
    let category = plugin.tags? plugin.tags[0] : 'otros'
    if (!groups[category]) groups[category] = []
    if (Array.isArray(plugin.help)) groups[category].push(...plugin.help)
    else groups[category].push(plugin.help)
  }

  // ICONOS FEMENINOS
  const icons = {
    search: '🔍', download: '⬇️', game: '🎮', rpg: '⚔️', config: '⚙️',
    group: '👥', owner: '👑', info: 'ℹ️', fun: '😂', anime: '🌸',
    sticker: '🧩', tools: '🛠️', nsfw: '🔞', audio: '🎵', prem: '💖',
    shop: '🛒', edit: '🎨', database: '💾', main: '🏠', otros: '📁'
  }

  // NOMBRES BONITOS - SI AGREGAS UNA CATEGORIA NUEVA SE PONE SOLA EN MAYUSCULAS
  const categoryNames = {
    search: 'BUSQUEDA',
    download: 'DESCARGAS',
    game: 'JUEGOS',
    rpg: 'RPG',
    config: 'CONFIGURACION',
    group: 'GRUPOS',
    owner: 'PROPIETARIO',
    info: 'INFORMACION',
    fun: 'DIVERSION',
    anime: 'ANIME',
    sticker: 'STICKERS',
    tools: 'HERRAMIENTAS',
    nsfw: 'NSFW',
    audio: 'AUDIO',
    prem: 'PREMIUM',
    shop: 'TIENDA',
    edit: 'EDICION',
    database: 'BASE DE DATOS',
    main: 'PRINCIPAL',
    otros: 'OTROS'
  }

  let menu = `🌸 𓆩 ***COTTI BOTS x Marie*** 𓆪 🌸\n\n`
  menu += `💕 ⤷ 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 ﹒ 3.0 ：✿ 。\n`
  menu += `✨ ꒰ estado: *EN LINEA* • ${_uptime} ꒱\n\n`
  menu += `🌷 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗩𝗜𝗣 ׅ 𝆬 ָ֢ ෆ\n`
  menu += `🌸 ࣪ ꕀ @${taguser.split('@')[0]}. ˚. ᵎᵎ\n`
  menu += `> *Hola preciosa, bienvenida al sistema* 💖\n\n`
  menu += `──💗 *INFORMACION DEL BOT* ╏ ✨\n`
  menu += `👤 *Usuarios*: ${totalreg} | 📜 *Comandos*: ${totalcmd}\n`
  menu += `👑 *Owner*: ${ownerTag}\n`
  menu += `📲 *Numero*: +${numBot}\n\n`
  menu += `💖 : 𝖲𝖨𝖲𝖳𝖤𝖬𝖠 ﹙ 🌸 ﹚\n`
  menu += `> 💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}gb\n`
  menu += `🗓️ *${new Date().toLocaleDateString('es', {weekday: 'long', timeZone: 'America/Lima'})}* ─ ${new Date().toLocaleDateString('es', {timeZone: 'America/Lima'})} ─ ${new Date().toLocaleTimeString('es', {timeZone: 'America/Lima'})}\n\n`
  menu += `⚡ *ping*: ${ping}ms\n`
  menu += `🌙 *modo:* public\n`
  menu += `> 💕 𝖴𝗌𝖺 ${usedPrefix} 𝖺𝗇𝗍𝖾𝗌 𝖽𝖾 𝖼𝖺𝖽𝖺 𝖼𝗈𝗆𝖺𝗇𝖽𝗈\n`

  // DETECTA CATEGORIAS NUEVAS AUTOMATICO
  for (let category in groups) {
    let icon = icons[category] || '🌸'
    let catName = categoryNames[category] || category.toUpperCase() // Si no existe el nombre, lo pone en MAYUS
    menu += `🌸───── 𓆩 \`\`${catName}\`\` 𓆪 ─────🌸\n`
    for (let cmd of groups[category]) {
      menu += `${icon} ✧ ${usedPrefix}${cmd}\n`
    }
    menu += `🌸─────────────────🌸\n\n`
  }

  menu += `━━━━━━━━━━\n`
  menu += `🌸 ***COTTI BOTS x Marie*** 🌸\n`
  menu += `👑 *Owner*: ${ownerTag}\n`
  menu += `📲 *Contacto*: +${numBot}\n`
  menu += `✨ *Version*: 3.0\n`
  menu += `💖 *Power*: Nivel Marie\n`
  menu += `> "Con una sonrisa todo es mejor" 💕\n`
  menu += `━━━━━━━━━━`

  await conn.sendMessage(m.chat, {
    image: img,
    caption: menu,
    mentions: [taguser, owner]
  }, { quoted: m })
}

handler.help = ['menu', 'help', 'menú']
handler.tags = ['info']
handler.command = /^(menu|help|menú)$/i

export default handler

function clockString(ms) {
  let h = isNaN(ms)? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms)? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms)? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join('h ') + 'm'
}