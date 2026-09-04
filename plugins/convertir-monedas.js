import axios from 'axios'

let handler = async (m, { conn, args, text }) => {
  let user = m.sender
  let nombre = await conn.getName(user)
  let imgDefault = 'https://files.evogb.win/ySkXCm.jpg'

  const monedas = {
    peru: 'PEN',
    argentina: 'ARS',
    mexico: 'MXN',
    uruguayo: 'UYU',
    paraguay: 'PYG',
    colombia: 'COP',
    bolivia: 'BOB',
    chile: 'CLP'
  }

  const nombres = {
    PEN: 'Sol Peruano',
    ARS: 'Peso Argentino',
    MXN: 'Peso Mexicano',
    UYU: 'Peso Uruguayo',
    PYG: 'Guaraní Paraguayo',
    COP: 'Peso Colombiano',
    BOB: 'Boliviano',
    CLP: 'Peso Chileno'
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

    let menu = `🐱 𓆩 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥 𝗚𝗢𝗚𝗟𝗘 𓆪 🐱\n\n`
    menu += `.⃟𖥔 ݁. 𖦹˙— \`\`COTTI BOTS x MARIE\`\` —˙𖦹.💖꒷\n\n`
    menu += `──🌸 *¿COMO SE USA?* ╏ 💚\n\n`
    menu += `💚 ➛ *.convertir <cantidad> <pais1> <pais2>*\n`
    menu += `💚 ➛ *.convertir <cantidad> <pais1> / <pais2>*\n`
    menu += `💚 ➛ *.convertir <cantidad> <pais> todo*\n\n`
    menu += `──🌸 *EJEMPLOS* ╏ 💚\n`
    menu += `💚 ➛ *.convertir 100 Peru Chile*\n`
    menu += `💚 ➛ *.convertir 100 Peru / Chile*\n`
    menu += `💚 ➛ *.convertir 1500 Argentina Mexico*\n`
    menu += `💚 ➛ *.convertir 1 Peru todo*\n\n`
    menu += `──🌸 *PAISES DISPONIBLES* ╏ 💚\n`
    menu += `💚 ➛ Peru = PEN\n`
    menu += `💚 ➛ Argentina = ARS\n`
    menu += `💚 ➛ Mexico = MXN\n`
    menu += `💚 ➛ Uruguayo = UYU\n`
    menu += `💚 ➛ Paraguay = PYG\n`
    menu += `💚 ➛ Colombia = COP\n`
    menu += `💚 ➛ Bolivia = BOB\n`
    menu += `💚 ➛ Chile = CLP\n`
    menu += `━━━━━━━━━━━\n*Powered by*: ***COTTI BOTS x Marie*** 🌸`

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

    let texto = `🐱 𓆩 𝗖𝗢𝗡𝗩𝗘𝗥𝗦𝗜𝗢𝗡 𝗗𝗘 ${nombre.toUpperCase()} 𓆪 🐱\n\n`

    if (a === 'todo') {
      texto += `──🌸 *${cantidad} ${monedaDe} - ${nombres[monedaDe]}* ╏ 💚\n\n`
      for (let mon in monedas) {
        let monCod = monedas[mon]
        if (monCod!== monedaDe) {
          let res = (cantidad * tasas[monCod.toLowerCase()]).toFixed(2)
          texto += `💚 ➛ ${res} ${monCod} - ${nombres[monCod]}\n`
        }
      }
      if (monedaDe === 'PEN') {
        const { data: dolar } = await axios.get('https://dolarapi.com/v1/dolares/blue')
        let usd_a_pen = tasas['usd']
        let pen_a_usd = 1/usd_a_pen
        let ars_blue = pen_a_usd * dolar.venta
        let resBlue = (cantidad * ars_blue).toFixed(2)
        texto += `\n🔵 ➛ ${resBlue} ARS - Peso Arg BLUE\n`
      }
    } else if (a === 'blue' && monedaDe === 'PEN') {
      const { data: dolar } = await axios.get('https://dolarapi.com/v1/dolares/blue')
      let usd_a_pen = tasas['usd']
      let pen_a_usd = 1/usd_a_pen
      let ars_blue = pen_a_usd * dolar.venta
      let resultado = (cantidad * ars_blue).toFixed(2)
      texto += `💚 ➛ *${cantidad} ${monedaDe}* = *${resultado} ARS BLUE*\n`
    } else {
      let monedaA = monedas[a]
      if (!monedaA) return m.reply(`❌ País destino no válido`)
      let tasa = tasas[monedaA.toLowerCase()]
      let resultado = (cantidad * tasa).toFixed(2)
      texto += `💚 ➛ *${cantidad} ${monedaDe}* = *${resultado} ${monedaA}*\n`
      texto += `Tasa: 1 ${monedaDe} = ${tasa} ${monedaA}\n`
    }

    texto += `\n*Actualizado:* ${new Date().toLocaleString('es-PE')}`
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