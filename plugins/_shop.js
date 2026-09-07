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

    // DETECTAR ADMIN SOLO PARA SET Y DEL
    let adminCmd = ['setcombos','delcombos','setpago','delpago','setstock','delstock']
    if (adminCmd.includes(command)) {
        let isAdmin = false
        if (m.isGroup) {
            let meta = await conn.groupMetadata(chat)
            let participant = meta.participants.find(p => p.id === m.sender)
            isAdmin = participant?.admin || m.isAdmin
        }
        if (!isAdmin) return m.reply('❌ *Solo los administradores pueden usar este comando*')
    }

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

        case 'combos':
            if (!data.combos) return m.reply('❌ No hay combos registrados aún')
            m.reply(`🧰 *LISTA DE COMBOS* 🧰\n\n${data.combos}`)
        break

        // ========== PAGOS ==========
        case 'setpago':
            let textoPago = args.join(' ')
            if (!textoPago) return m.reply(`💳 *USO:* ${usedPrefix}setpago tu texto aquí`)
            data.pago = textoPago // <- GUARDA TODO EL TEXTO
            guardar()
            m.reply(`✅ *MÉTODOS DE PAGO ACTUALIZADOS*\n\n${textoPago}`)
        break

        case 'delpago':
            data.pago = "" // <- BORRA TODO
            guardar()
            m.reply(`✅ *Todos los métodos de pago fueron eliminados*`)
        break

        case 'pago':
            if (!data.pago) return m.reply('❌ No hay métodos de pago registrados')
            m.reply(`💳 *MÉTODOS DE PAGO* 💳\n\n${data.pago}`)
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

        case 'stock':
            if (!data.stock) return m.reply('❌ No hay stock registrado')
            m.reply(`📦 *STOCK DISPONIBLE* 📦\n\n${data.stock}`)
        break
    }
}

handler.help = ['setcombos','delcombos','combos','setpago','delpago','pago','setstock','delstock','stock']
handler.tags = ['shop']
handler.command = /^(setcombos|delcombos|combos|setpago|delpago|pago|setstock|delstock|stock)$/i
handler.group = true

export default handler