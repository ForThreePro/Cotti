import axios from 'axios'

let handler = async (m, { conn, args }) => {
  let cantidad = args[0]? parseFloat(args[0]) : 1
  let de = args[1]? args[1].toLowerCase() : 'peru'
  let a = args[2]? args[2].toLowerCase() : ''

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

  if (!monedas[de]) return m.reply(`❌ País no válido\nUsa: Peru, Argentina, Mexico, Uruguay, Paraguay, Colombia, Bolivia`)

  let monedaDe = monedas[de]
  let user = m.sender
  let nombre = await conn.getName(user)

  try {
    await m.react('⏳')

    // 1. Foto de perfil del usuario que pidió
    let ppUrl = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://i.imgur.com/8Km9tLL.png')

    // 2. API Oficial Google
    const urlOficial = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${monedaDe.toLowerCase()}.json`
    const { data: dataOficial } = await axios.get(urlOficial)
    let tasas = dataOficial[monedaDe.toLowerCase()]

    let texto = `🐱 𓆩 𝗖𝗢𝗡𝗩𝗘𝗥𝗦𝗜𝗢𝗡 𝗗𝗘 ${nombre.toUpperCase()} 𓆪 🐱\n\n`
    texto += `.⃟𖥔 ݁. 𖦹˙— \`\`COTTI BOTS x MARIE\`\` —˙𖦹.💖꒷\n\n`

    if (a === 'todo') {
      texto += `──🌸 *${cantidad} ${monedaDe} - ${nombres[monedaDe]}* ╏ 💚\n\n`
      for (let mon in monedas) {
        let monCod = monedas[mon]
        if (monCod!== monedaDe) {
          let res = (cantidad * tasas[monCod.toLowerCase()]).toFixed(2)
          texto += `💚 ➛ ${res} ${monCod} - ${nombres[monCod]}\n`
        }
      }
      // Agregar BLUE si es desde PEN
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
      texto += `Tasa Blue: 1 USD = ${dolar.venta} ARS\n`

    } else {
      let monedaA = monedas[a]
      if (!monedaA) return m.reply(`❌ País destino no válido`)
      let tasa = tasas[monedaA.toLowerCase()]
      let resultado = (cantidad * tasa).toFixed(2)
      texto += `💚 ➛ *${cantidad} ${monedaDe}* = *${resultado} ${monedaA}*\n`
      texto += `Tasa Oficial: 1 ${monedaDe} = ${tasa} ${monedaA}\n`
    }

    texto += `\n*Actualizado:* ${new Date().toLocaleString('es-PE')}`
    texto += `\n*Foto de:* ${ppUrl}`
    texto += `\n━━━━━━━━━━━\n*Powered by*: ***COTTI BOTS x Marie*** 🌸`

    // 3. Enviar foto del usuario sin marca de agua
    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: texto
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['convertir <cantidad> <de> <a>', 'convertir <cantidad> <de> todo']
handler.tags = ['tools']
handler.command = ['convertir', 'conv', 'cambio']

export default handler