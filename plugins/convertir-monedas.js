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

  // TASAS BASE GOOGLE QUE ME DISTE
  const tasasBase = {
    PEN_CLP: 279.20,
    PEN_MXN: 5.04,
    PEN_ARS: 449.85,
    PEN_PYG: 1772.21,
    PEN_UYU: 12.01,
    PEN_BOB: 3.62,
    PEN_COP: 940.06
  }

  async function getFoto() {
    try {
      let pp = await conn.profilePictureUrl(user, 'image')
      return typeof pp === 'string'? pp : imgDefault
    } catch {
      return imgDefault
    }
  }

  if (!args[0]) {
    let ppUrl = await getFoto()
    let buffer = (await axios.get(ppUrl, {responseType: 'arraybuffer'})).data

    let menu = `🐱 𓆩 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥 𝗚𝗢𝗢𝗚𝗟𝗘 𓆪 🐱\n\n`
    menu += `╭─💖─ \`\`COTTI BOTS x MARIE\`\` ─💖─╮\n`
    menu += `│\n`
    menu += `│ 💚 *USO:*\n`
    menu += `│ ➛ \`.convertir 100 Peru Chile\`\n`
    menu += `│ ➛ \`.convertir 100 Peru / Argentina\`\n`
    menu += `│ ➛ \`.convertir 1 Peru todo\`\n`
    menu += `│\n`
    menu += `│ 🌎 *PAISES:* 🇵🇪 🇦🇷 🇲🇽 🇺🇾 🇵🇾 🇨🇴 🇧🇴 🇨🇱\n`
    menu += `│\n`
    menu += `│ ⚠️ *IMPORTANTE*\n`
    menu += `│ Esto es precio base Google\n`
    menu += `│ Comisión de apps ya varia\n`
    menu += `│ depende el banco etc\n`
    menu += `│\n`
    menu += `╰─✨ Tasas fijas actualizables ✨─╯\n`
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

  if (!monedas[de]) return m.reply(`❌ País origen no válido`)
  if (isNaN(cantidad)) return m.reply(`❌ Pon una cantidad válida`)

  let monedaDe = monedas[de]

  try {
    await m.react('⏳')
    let ppUrl = await getFoto()
    let buffer = (await axios.get(ppUrl, {responseType: 'arraybuffer'})).data

    let texto = `🐱 𓆩 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢 𝗗𝗘 ${nombre.toUpperCase()} 𓆪 🐱\n\n`
    texto += `╭─💜─ \`\`COTTI BOTS x MARIE\`\` ─💜─╮\n`

    if (a === 'todo') {
      texto += `│\n│ 🌸 *CONVIRTIENDO:* ${banderas[monedaDe]} ${cantidad.toLocaleString()} ${monedaDe}\n│ ${nombres[monedaDe]}\n│\n│ ────────── *RESULTADOS* ──────────\n`

      for (let mon in monedas) {
        let monCod = monedas[mon]
        if (monCod!== monedaDe) {
          let key = `${monedaDe}_${monCod}`
          let keyInversa = `${monCod}_${monedaDe}`
          let tasa = tasasBase[key] || (1 / tasasBase[keyInversa])
          let res = cantidad * tasa
          texto += `│ ${banderas[monCod]} *${res.toLocaleString(undefined,{maximumFractionDigits: 2})} ${monCod}*\n│ ${nombres[monCod]}\n`
        }
      }

    } else {
      let monedaA = monedas[a]
      if (!monedaA) return m.reply(`❌ País destino no válido`)

      let key = `${monedaDe}_${monedaA}`
      let keyInversa = `${monedaA}_${monedaDe}`
      let tasa = tasasBase[key] || (1 / tasasBase[keyInversa])
      let resultado = cantidad * tasa

      texto += `│\n│ 🌸 *DE:* ${banderas[monedaDe]} ${cantidad.toLocaleString()} ${monedaDe}\n│ ${nombres[monedaDe]}\n│\n`
      texto += `│ ⬇️ *A:* ${banderas[monedaA]} ${resultado.toLocaleString(undefined,{maximumFractionDigits: 2})} ${monedaA}\n`
      texto += `│ ${nombres[monedaA]}\n│\n│ 📊 Tasa: 1 ${monedaDe} = ${tasa} ${monedaA}\n`
    }

    texto += `│\n│ ⚠️ *NOTA:* Precio base Google\n`
    texto += `│ Comisión de apps/bancos varia\n`
    texto += `│\n╰─🕐 Actualizado manual ─╯\n`
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