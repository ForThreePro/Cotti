import fs from 'fs'
let db = './database/shop.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat // <- AQUI DETECTA EL GRUPO

    // Si el grupo no existe, lo crea. Cada grupo separado
    if (!shop[chat]) shop[chat] = {combos:"", pago:"", stock:""}
    let data = shop[chat]

    switch(command) {
        // ========== VER COMBOS ==========
        case 'combos':
        case 'c':
            if (!data.combos) return m.reply('❌ No hay combos registrados aún')
            m.reply(`🧰 *LISTA DE COMBOS DISPONIBLES* 🧰\n\n${data.combos}\n\n*Para comprar:* Escribe ${usedPrefix}pagos`)
        break

        // ========== VER PAGOS ==========
        case 'pago':
        case 'pagos':
        case 'p':
            if (!data.pago) return m.reply('❌ No hay métodos de pago registrados')
            m.reply(`💳 *MÉTODOS DE PAGO ACEPTADOS* 💳\n\n${data.pago}\n\n_Realiza el pago y envía tu comprobante al admin_`)
        break

        // ========== VER STOCK ==========
        case 'stock':
        case 's':
            if (!data.stock) return m.reply('❌ No hay stock registrado')
            m.reply(`📦 *STOCK DISPONIBLE* 📦\n\n${data.stock}`)
        break
    }
}

handler.help = ['combos','pago','stock']
handler.tags = ['shop']
handler.command = /^(combos|c|pago|pagos|p|stock|s)$/i
handler.group = true // <- LIBRE PARA TODOS

export default handler