import fs from 'fs'
let db = './database/shop.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat

    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    switch(command) {
        // ========== VER COMBOS ==========
        case 'combos':
            if (Object.keys(data.combos).length == 0) return m.reply('❌ No hay combos registrados aún')
            let txtC = `🧰 *LISTA DE COMBOS DISPONIBLES* 🧰\n\n`
            for (let [k,v] of Object.entries(data.combos)) {
                txtC += `💎 *${k.toUpperCase()}*\n💰 Precio: S/ ${v.precio}\n📝 ${v.desc}\n\n`
            }
            txtC += `*Para comprar:* Escribe ${usedPrefix}pagos para ver métodos`
            m.reply(txtC)
        break

        // ========== VER PAGOS ==========
        case 'pagos':
            if (Object.keys(data.pago).length == 0) return m.reply('❌ No hay métodos de pago registrados')
            let txtP = `💳 *MÉTODOS DE PAGO ACEPTADOS* 💳\n\n`
            for (let [k,v] of Object.entries(data.pago)) {
                txtP += `💎 *${k.toUpperCase()}*\n📲 ${v}\n\n`
            }
            txtP += `_Realiza el pago y envía tu comprobante al admin_`
            m.reply(txtP)
        break

        // ========== VER STOCK ==========
        case 'stock':
            if (Object.keys(data.stock).length == 0) return m.reply('❌ No hay stock registrado')
            let txtS = `📦 *STOCK DISPONIBLE* 📦\n\n`
            for (let [k,v] of Object.entries(data.stock)) {
                txtS += `💎 *${k.toUpperCase()}*\n📊 Cantidad: ${v}\n\n`
            }
            m.reply(txtS)
        break
    }
}

handler.help = ['combos','pagos','stock']
handler.tags = ['shop'] // <- Para que salga en.menu
handler.command = /^(combos|pagos|stock)$/i
handler.group = true // <- LIBRE PARA TODOS

export default handler