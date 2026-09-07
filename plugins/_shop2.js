import fs from 'fs'
let db = './database/shop.json'

// Crear BD si no existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat // <- DETECTA EL GRUPO

    // CADA GRUPO TIENE SU PROPIA TIENDA
    if (!shop[chat]) shop[chat] = {combos:"", pago:"", stock:""}
    let data = shop[chat]

    switch(command) {
        // ========== VER COMBOS ==========
        case 'combos':
            if (!data.combos) return m.reply('❌ No hay combos registrados aún')
            m.reply(`🧰 *LISTA DE COMBOS* 🧰\n\n${data.combos}`)
        break

        // ========== VER PAGOS ==========
        case 'pago':
        case 'pagos': // <- acepta los 2
            if (!data.pago) return m.reply('❌ No hay métodos de pago registrados')
            m.reply(`💳 *MÉTODOS DE PAGO* 💳\n\n${data.pago}`)
        break

        // ========== VER STOCK ==========
        case 'stock':
            if (!data.stock) return m.reply('❌ No hay stock registrado')
            m.reply(`📦 *STOCK DISPONIBLE* 📦\n\n${data.stock}`)
        break
    }
}

handler.help = ['combos','pago','stock']
handler.tags = ['shop']
handler.command = /^(combos|pago|pagos|stock)$/i
handler.group = true // <- LIBRE PARA TODOS

export default handler