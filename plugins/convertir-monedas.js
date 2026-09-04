import axios from 'axios'

let handler = async (m, { conn, args }) => {
  let user = m.sender
  let nombre = await conn.getName(user)
  let imgDefault = 'https://files.evogb.win/ySkXCm.jpg'

  const monedas = {
    peru: 'PEN', argentina: 'ARS', mexico: 'MXN',
    uruguayo: 'UYU', uruguay: 'UYU', paraguay: 'PYG',
    colombia: 'COP', bolivia: 'BOB'
  }

  const nombres = {
    PEN: 'Sol Peruano', ARS: 'Peso Argentino', MXN: 'Peso Mexicano',
    UYU: 'Peso Uruguayo', PYG: 'Guaraní Paraguayo',
    COP: 'Peso Colombiano', BOB: 'Boliviano'
  }

  // Función para obtener foto segura
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
    menu += `💚 ➛ *.convertir <cantidad> <de> <a>*\n`
    menu += `💚 ➛ *.convertir <cantidad> <de> todo*\n`
    menu += `💚 ➛ *.convertir <cantidad> <de> blue*\n\n`
    menu += `──🌸 *EJEMPLOS* ╏ 💚\n`
    menu += `💚 ➛ *.convertir 100 Peru Argentina*\n`
    menu += `💚 ➛ *.convertir 1 Peru todo*\n`
    menu += `💚 ➛ *.convertir 1 Peru blue*\n\n`
    menu += `──🌸 *PAISES* ╏ 💚\nPeru PEN | Argentina ARS | Mexico MXN\nUruguay UYU | Paraguay PYG | Colombia COP | Bolivia BOB\n`
    menu += `━━━━━━━━━━━\n*Powered by*: ***COTTI BOTS x Marie*** 🌸`

    return await conn.sendMessage(m.chat, { image: buffer, caption: menu }, { quoted: m })
  }

  let cantidad = parseFloat(args[0])
  let de = args[1]? args[1].toLowerCase() : ''
  let a = args[2]? args[2].toLowerCase() : ''

  if (!monedas[de]) return m.reply(`❌ País no válido`)
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