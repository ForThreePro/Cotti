import fs from 'fs'
let db = './database/shop.json'

// Crear BD si no existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat

    // CADA GRUPO TIENE SU PROPIA TIENDA
    if (!shop[chat]) shop[chat] = {combos:"", pago:"", stock:""}
    let data = shop[chat]

    const guardar = () => fs.writeFileSync(db, JSON.stringify(shop, null, 2))

    switch(command) {
        // ========== COMBOS ==========
        case 'setcombos':
            let textoCombo = args.join(' ')
            if (!textoCombo) return m.reply(`📦 *USO:* ${usedPrefix}setcombos tu texto aquí`)
            data.combos = textoCombo // <- GUARDA TODO EL TEXTO
            guardar()
            m.reply(`✅ *COMBOS ACTUALIZADOS*\n\n${textoCombo}`)
        break

        // ========== PAGOS ==========
        case 'setpago':
        case 'setpagos': // <- alias por si escriben con s
            let textoPago = args.join(' ')
            if (!textoPago) return m.reply(`💳 *USO:* ${usedPrefix}setpago tu texto aquí`)
            data.pago = textoPago // <- GUARDA TODO EL TEXTO
            guardar()
            m.reply(`✅ *MÉTODOS DE PAGO ACTUALIZADOS*\n\n${textoPago}`)
        break

        // ========== STOCK ==========
        case 'setstock':
            let textoStock = args.join(' ')
            if (!textoStock) return m.reply(`📊 *USO:* ${usedPrefix}setstock tu texto aquí`)
            data.stock = textoStock // <- GUARDA TODO EL TEXTO
            guardar()
            m.reply(`✅ *STOCK ACTUALIZADO*\n\n${textoStock}`)
        break
    }
}

handler.help = ['setcombos','setpago','setstock']
handler.tags = ['shop']
handler.command = /^(setcombos|setpago|setpagos|setstock)$/i
handler.admin = true // <- SOLO ADMINS
handler.group = true

export default handler