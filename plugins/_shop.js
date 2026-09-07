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

        case 'delcombos':
            data.combos = "" // <- BORRA TODO
            guardar()
            m.reply(`✅ *Todos los combos fueron eliminados*`)
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

        case 'delpago':
        case 'delpagos': // <- alias
            data.pago = "" // <- BORRA TODO
            guardar()
            m.reply(`✅ *Todos los métodos de pago fueron eliminados*`)
        break

        // ========== STOCK ==========
        case 'setstock':
            let textoStock = args.join(' ')
            if (!textoStock) return m.reply(`📊 *USO:* ${usedPrefix}setstock tu texto aquí`)
            data.stock = textoStock // <- GUARDA TODO EL TEXTO
            guardar()
            m.reply(`✅ *STOCK ACTUALIZADO*\n\n${textoStock}`)
        break

        case 'delstock':
            data.stock = "" // <- BORRA TODO
            guardar()
            m.reply(`✅ *Todo el stock fue eliminado*`)
        break
    }
}

handler.help = ['setcombos','delcombos','setpago','setpagos','delpago','delpagos','setstock','delstock']
handler.tags = ['shop']
handler.command = /^(setcombos|delcombos|setpago|setpagos|delpago|delpagos|setstock|delstock)$/i
handler.admin = true // <- SOLO ADMINS
handler.group = true

export default handler