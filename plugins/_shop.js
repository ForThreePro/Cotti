import fs from 'fs'
let db = './database/shop.json'

// Crear BD si no existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat

    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    const guardar = () => fs.writeFileSync(db, JSON.stringify(shop, null, 2))

    switch(command) {
        // ========== COMBOS ==========
        case 'setcombos':
            if (args.length < 2) return m.reply(`📦 *USO:* ${usedPrefix}setcombos nombre|precio|descripcion\n*EJ:* ${usedPrefix}setcombos VIP|10|Bot + Grupo + Soporte 24/7`)
            let [n1, p1,...d1] = args.join(' ').split('|')
            if (!p1 ||!d1.length) return m.reply('❌ Formato incorrecto\nUsa: nombre|precio|descripcion')
            data.combos[n1.toLowerCase()] = {precio: p1.trim(), desc: d1.join('|').trim()}
            guardar()
            m.reply(`✅ *COMBO GUARDADO*\n\n📦 Nombre: ${n1}\n💰 Precio: S/ ${p1}\n📝 Descripción: ${d1.join('|')}`)
        break

        case 'delcombos':
            if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delcombos nombre`)
            let delC = args[0].toLowerCase()
            if (!data.combos[delC]) return m.reply('❌ Ese combo no existe')
            delete data.combos[delC]
            guardar()
            m.reply(`✅ *Combo "${delC}" eliminado correctamente*`)
        break

        case 'combos':
            if (Object.keys(data.combos).length == 0) return m.reply('❌ No hay combos registrados aún')
            let txtC = `🧰 *LISTA DE COMBOS* 🧰\n\n`
            for (let [k,v] of Object.entries(data.combos)) {
                txtC += `💎 *${k.toUpperCase()}*\n💰 Precio: S/ ${v.precio}\n📝 ${v.desc}\n\n`
            }
            m.reply(txtC)
        break

        // ========== PAGOS ==========
        case 'setpago':
            if (args.length < 2) return m.reply(`💳 *USO:* ${usedPrefix}setpago metodo|numero\n*EJ:* ${usedPrefix}setpago Yape|927174369`)
            let [n2, p2] = args.join(' ').split('|')
            if (!p2) return m.reply('❌ Formato incorrecto\nUsa: metodo|numero')
            data.pago[n2.toLowerCase()] = p2.trim()
            guardar()
            m.reply(`✅ *MÉTODO DE PAGO AGREGADO*\n\n💳 Método: ${n2}\n📲 Dato: ${p2}`)
        break

        case 'delpago':
            if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delpago metodo`)
            let delP = args[0].toLowerCase()
            if (!data.pago[delP]) return m.reply('❌ Ese método no existe')
            delete data.pago[delP]
            guardar()
            m.reply(`✅ *Método "${delP}" eliminado correctamente*`)
        break

        case 'pago':
            if (Object.keys(data.pago).length == 0) return m.reply('❌ No hay métodos de pago registrados')
            let txtP = `💳 *MÉTODOS DE PAGO* 💳\n\n`
            for (let [k,v] of Object.entries(data.pago)) {
                txtP += `💎 *${k.toUpperCase()}*\n📲 ${v}\n\n`
            }
            m.reply(txtP)
        break

        // ========== STOCK ==========
        case 'setstock':
            if (args.length < 2) return m.reply(`📊 *USO:* ${usedPrefix}setstock producto|cantidad\n*EJ:* ${usedPrefix}setstock Netflix|15`)
            let [n3, p3] = args.join(' ').split('|')
            if (!p3) return m.reply('❌ Formato incorrecto\nUsa: producto|cantidad')
            data.stock[n3.toLowerCase()] = p3.trim()
            guardar()
            m.reply(`✅ *STOCK ACTUALIZADO*\n\n📦 Producto: ${n3}\n📊 Cantidad: ${p3}`)
        break

        case 'delstock':
            if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delstock producto`)
            let delS = args[0].toLowerCase()
            if (!data.stock[delS]) return m.reply('❌ Ese producto no existe')
            delete data.stock[delS]
            guardar()
            m.reply(`✅ *Producto "${delS}" eliminado del stock*`)
        break

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

handler.help = ['setcombos','delcombos','combos','setpago','delpago','pago','setstock','delstock','stock']
handler.tags = ['shop'] // <- Para que salga en el menu
handler.command = /^(setcombos|delcombos|combos|setpago|delpago|pago|setstock|delstock|stock)$/i
handler.admin = true // <- SOLO ADMINS
handler.group = true

export default handler