import fs from 'fs'
let db = './database/shop.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, JSON.stringify({}))

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat
    let user = m.sender

    // FIX DEFINITIVO: DETECTAR ADMIN
    let isAdmin = false
    let isOwner = [conn.user.jid, global.owner[0] + '@s.whatsapp.net'].includes(user)

    if (m.isGroup) {
        let meta = await conn.groupMetadata(chat)
        let participant = meta.participants.find(p => p.id === user)
        // Metodo 1: admin === 'admin' || 'superadmin'
        // Metodo 2: admin === true
        isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin' || participant?.admin === true
    }

    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    // SOLO ADMINS Y OWNER
    let adminOnly = ['setcombos','delcombos','setpago','delpago','setstock','delstock']
    if (adminOnly.includes(command) &&!isAdmin &&!isOwner) {
        return m.reply(`❌ Solo los administradores pueden usar este comando\nTu ID: ${user}\nAdmin: ${isAdmin}\nOwner: ${isOwner}`) // <- borra esto despues de probar
    }

    const guardar = () => fs.writeFileSync(db, JSON.stringify(shop, null, 2))

    switch(command) {
        case 'setcombos':
            if (args.length < 2) return m.reply(`📦 *USO:* ${usedPrefix}setcombos nombre|precio|descripcion`)
            let [n1, p1,...d1] = args.join(' ').split('|')
            if (!p1 ||!d1.length) return m.reply('❌ Formato incorrecto. Usa: nombre|precio|descripcion')
            data.combos[n1.toLowerCase()] = {precio: p1.trim(), desc: d1.join('|').trim()}
            guardar()
            m.reply(`✅ *COMBO GUARDADO*\n\n📦 Nombre: ${n1}\n💰 Precio: S/ ${p1}\n📝 Descripción: ${d1.join('|')}`)
        break

        case 'combos':
            if (Object.keys(data.combos).length == 0) return m.reply('❌ No hay combos registrados aún')
            let txtC = `🧰 *LISTA DE COMBOS DISPONIBLES* 🧰\n\n`
            for (let [k,v] of Object.entries(data.combos)) {
                txtC += `💎 *${k.toUpperCase()}*\n💰 Precio: S/ ${v.precio}\n📝 ${v.desc}\n\n`
            }
            txtC += `*Para comprar:* Escribe ${usedPrefix}pago`
            m.reply(txtC)
        break

        case 'delcombos':
            if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delcombos nombre`)
            let delC = args[0].toLowerCase()
            if (!data.combos[delC]) return m.reply('❌ Ese combo no existe')
            delete data.combos[delC]
            guardar()
            m.reply(`✅ *Combo "${delC}" eliminado*`)
        break

        case 'setpago':
            if (args.length < 2) return m.reply(`💳 *USO:* ${usedPrefix}setpago metodo|numero`)
            let [n2, p2] = args.join(' ').split('|')
            if (!p2) return m.reply('❌ Formato incorrecto. Usa: metodo|numero')
            data.pago[n2.toLowerCase()] = p2.trim()
            guardar()
            m.reply(`✅ *MÉTODO DE PAGO AGREGADO*\n\n💳 Método: ${n2}\n📲 Dato: ${p2}`)
        break

        case 'pago':
            if (Object.keys(data.pago).length == 0) return m.reply('❌ No hay métodos de pago registrados')
            let txtP = `💳 *MÉTODOS DE PAGO ACEPTADOS* 💳\n\n`
            for (let [k,v] of Object.entries(data.pago)) {
                txtP += `💎 *${k.toUpperCase()}*\n📲 ${v}\n\n`
            }
            m.reply(txtP)
        break

        case 'delpago':
            if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delpago metodo`)
            let delP = args[0].toLowerCase()
            if (!data.pago[delP]) return m.reply('❌ Ese método no existe')
            delete data.pago[delP]
            guardar()
            m.reply(`✅ *Método "${delP}" eliminado*`)
        break

        case 'setstock':
            if (args.length < 2) return m.reply(`📊 *USO:* ${usedPrefix}setstock producto|cantidad`)
            let [n3, p3] = args.join(' ').split('|')
            if (!p3) return m.reply('❌ Formato incorrecto. Usa: producto|cantidad')
            data.stock[n3.toLowerCase()] = p3.trim()
            guardar()
            m.reply(`✅ *STOCK ACTUALIZADO*\n\n📦 Producto: ${n3}\n📊 Cantidad: ${p3}`)
        break

        case 'stock':
            if (Object.keys(data.stock).length == 0) return m.reply('❌ No hay stock registrado')
            let txtS = `📦 *STOCK DISPONIBLE* 📦\n\n`
            for (let [k,v] of Object.entries(data.stock)) {
                txtS += `💎 *${k.toUpperCase()}*\n📊 Cantidad: ${v}\n\n`
            }
            m.reply(txtS)
        break

        case 'delstock':
            if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delstock producto`)
            let delS = args[0].toLowerCase()
            if (!data.stock[delS]) return m.reply('❌ Ese producto no existe')
            delete data.stock[delS]
            guardar()
            m.reply(`✅ *Producto "${delS}" eliminado*`)
        break
    }
}

handler.help = ['setcombos','combos','delcombos','setpago','pago','delpago','setstock','stock','delstock']
handler.tags = ['shop']
handler.command = /^(setcombos|combos|delcombos|setpago|pago|delpago|setstock|stock|delstock)$/i
handler.group = true

export default handler