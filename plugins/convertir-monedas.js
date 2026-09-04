import axios from 'axios'

let handler = async (m, { conn, args, text }) => {
  let user = m.sender
  let nombre = await conn.getName(user)
  let imgDefault = 'https://files.evogb.win/ySkXCm.jpg'

  const monedas = {
    peru: 'PEN', argentina: 'ARS', mexico: 'MXN',
    uruguayo: 'UYU', paraguay: 'PYG',
    colombia: 'COP', bolivia: 'BOB', chile: 'CLP'
  }

  const nombres = {
    PEN: 'Sol Peruano', ARS: 'Peso Argentino', MXN: 'Peso Mexicano',
    UYU: 'Peso Uruguayo', PYG: 'Guaraní Paraguayo',
    COP: 'Peso Colombiano', BOB: 'Boliviano', CLP: 'Peso Chileno'
  }

  const banderas = {
    PEN: '🇵🇪', ARS: '🇦🇷', MXN: '🇲🇽', UYU: '🇺🇾',
    PYG: '🇵🇾', COP: '🇨🇴', BOB: '🇧🇴', CLP: '🇨🇱'
  }

  async function getFoto() {
    try {
      let pp = await conn.profilePictureUrl(user, 'image')
      if (typeof pp!== 'string') throw new Error('No string')
      return pp
    } catch {
      return imgDefault
    }
  }

  if (!args[0]) {
    let ppUrl = await getFoto()
    let buffer = (await axios.get(ppUrl, {responseType: 'arraybuffer'})).data

    let menu = `🐱 𓆩 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥 𝗠𝗨𝗟𝗧𝗜𝗗𝗜𝗩𝗜𝗦𝗔𝗦 𓆪 🐱\n\n`
    menu += `╭─💖─ \`\`COTTI BOTS x MARIE\`\` ─💖─╮\n`
    menu += `│\n`
    menu += `│ 💚 *¿COMO USARLO?*\n`
    menu += `│ ➛ \`.convertir 100 Peru Chile\`\n`
    menu += `│ ➛ \`.convertir 100 Peru / Chile\`\n`
    menu += `│ ➛ \`.convertir 1 Peru todo\`\n`
    menu += `│ ➛ \`.convertir 1 Peru blue\`\n`
    menu += `│\n`
    menu += `│ 🌎 *PAISES DISPONIBLES*\n`
    menu += `│ 🇵🇪 Peru | 🇦🇷 Argentina | 🇲🇽 Mexico\n`
    menu += `│ 🇺🇾 Uruguayo | 🇵🇾 Paraguay\n`
    menu += `│ 🇨🇴 Colombia | 🇧🇴 Bolivia | 🇨🇱 Chile\n`
    menu += `│\n`
    menu += `╰─✨ Tasas oficiales de Google ✨─╯\n`
    menu += `\n━━━━━━━━━━━\n*Powered by*: ***COTTI BOTS x Marie*** 🌸`

    return await conn.sendMessage(m.chat, { image: buffer, caption: menu }, { quoted: m })
  }

  let cantidad, de, a
  if (text.includes('/')) {
    let partes = text.split('/').map(v => v.trim())
    let izq = partes[0].trim().split(' ')
    cantidad = parseFloat(izq[0])
    de = izq.slice(1).join(' ').toLowerCase()
    a = partes[1].toLowerCase()
  } else {
    cantidad = parseFloat(args[0])
    de = args[1]? args[1].toLowerCase() : ''
    a = args[2]? args[2].toLowerCase() : ''
  }

  if (!monedas[de]) return m.reply(`❌ País origen no válido\nPaíses: Peru, Argentina, Mexico, Uruguayo, Paraguay, Colombia, Bolivia, Chile`)
  if (isNaN(cantidad)) return m.reply(`❌ Pon una cantidad válida`)

  let monedaDe = monedas[de]

  try {
    await m.react('⏳')
    let ppUrl = await getFoto()
    let buffer = (await axios.get(ppUrl, {responseType: 'arraybuffer'})).data

    const urlOficial = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${monedaDe.toLowerCase()}.json`
    const { data: dataOficial } = await axios.get(urlOficial)
    let tasas = dataOficial[monedaDe.toLowerCase()]

    let texto = `🐱 𓆩 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢 𝗗𝗘 ${nombre.toUpperCase()} 𓆪 🐱\n\n`
    texto += `╭─💰─ \`\`COTTI BOTS x MARIE\`\` ─💰─╮\n`

    if (a === 'todo') {
      texto += `│\n`
      texto += `│ 🌸 *CONVIRTIENDO:* ${banderas[monedaDe]} ${cantidad.toLocaleString()} ${monedaDe}\n`
      texto += `│ ${nombres[monedaDe]}\n`
      texto += `│\n`
      texto += `│ ────────── *RESULTADOS* ──────────\n`
      for (let mon in monedas) {
        let monCod = monedas[mon]
        if (monCod!== monedaDe) {
          let res = (cantidad * tasas[monCod.toLowerCase()])
          texto += `│ ${banderas[monCod]} *${res.toLocaleString(undefined,{maximumFractionDigits: 2})} ${monCod}*\n`
          texto += `│ ${nombres[monCod]}\n`
        }
      }
      if (monedaDe === 'PEN') {
        const { data: dolar } = await axios.get('https://dolarapi.com/v1/dolares/blue')
        let usd_a_pen = tasas['usd']
        let pen_a_usd = 1/usd_a_pen
        let ars_blue = pen_a_usd * dolar.venta
        let resBlue = (cantidad * ars_blue)
        texto += `│ 🇦🇷 *${resBlue.toLocaleString(undefined,{maximumFractionDigits: 2})} ARS* \`\`BLUE\`\`\n`
        texto += `│ Peso Argentino Blue\n`
      }

    } else if (a === 'blue' && monedaDe === 'PEN') {
      const { data: dolar } = await axios.get('https://dolarapi.com/v1/dolares/blue')
      let usd_a_pen = tasas['usd']
      let pen_a_usd = 1/usd_a_pen
      let ars_blue = pen_a_usd * dolar.venta
      let resultado = (cantidad * ars_blue)
      texto += `│\n`
      texto += `│ 🌸 *DE:* ${banderas[monedaDe]} ${cantidad.toLocaleString()} ${monedaDe}\n`
      texto += `│ 🌸 *A:* 🇦🇷 ${resultado.toLocaleString(undefined,{maximumFractionDigits: 2})} ARS BLUE\n`
      texto += `│\n`
      texto += `│ 💵 Tasa Blue: 1 USD = ${dolar.venta} ARS\n`

    } else {
      let monedaA = monedas[a]
      if (!monedaA) return m.reply(`❌ País destino no válido`)
      let tasa = tasas[monedaA.toLowerCase()]
      let resultado = (cantidad * tasa)
      texto += `│\n`
      texto += `│ 🌸 *DE:* ${banderas[monedaDe]} ${cantidad.toLocaleString()} ${monedaDe}\n`
      texto += `│ ${nombres[monedaDe]}\n`
      texto += `│\n`
      texto += `│ ⬇️ *A:* ${banderas[monedaA]} ${resultado.toLocaleString(undefined,{maximumFractionDigits: 2})} ${monedaA}\n`
      texto += `│ ${nombres[monedaA]}\n`
      texto += `│\n`
      texto += `│ 📊 Tasa: 1 ${monedaDe} = ${tasa} ${monedaA}\n`
    }

    texto += `│\n`
    texto += `╰─🕐 Actualizado: ${new Date().toLocaleString('es-PE')} ─╯\n`
    texto += `\n━━━━━━━━━━━\n*Powered by*: ***COTTI BOTS x Marie*** 🌸`

    await conn.sendMessage(m.chat, { image: buffer, caption: texto }, { quoted: m })
    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.command = ['convertir', 'conv', 'cambio']
export default handler