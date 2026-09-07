import fs from 'fs'
let db = './database/shop.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
    let chat = m.chat
    let user = m.sender

    // DETECTAR ADMIN
    let isAdmin = false
    let isBotOwner = [conn.user.jid, global.owner[0] + '@s.whatsapp.net'].includes(user)
    if (m.isGroup) {
        let meta = await conn.groupMetadata(chat)
        let participant = meta.participants.find(p => p.id.split(':')[0] === user.split(':')[0])
        isAdmin = participant?.admin || false
    }
    let isAllowed = isAdmin || isBotOwner

    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]
    const guardar = () => fs.writeFileSync(db, JSON.stringify(shop, null, 2))

    let adminCmd = ['setcombos','delcombos','setpago','delpago','setstock','delstock']
    if (adminCmd.includes(command) &&!isAllowed) return m.reply('❌ *Solo los administradores pueden usar este comando*')

    switch(command) {
        // ========== ADMIN ==========
        case 'setcombos':
            if (args.length < 2) return m.reply(`📦 *USO:* ${usedPrefix}setcombos nombre|precio|descripcion\n*EJ:* ${usedPrefix}setcombos VIP|10|Bot + Grupo`)
            let [n1, p1,...d1] = args.join(' ').split('|')
            if (!p1 ||!d1.length) return m.reply('❌ Formato: nombre|precio|descripcion')
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
            m.reply(`✅ *Combo "${delC}" eliminado*`)
        break

        case 'setpago':
            if (args.length < 2) return m.reply(`💳 *USO:* ${usedPrefix}setpago metodo|numero\n*EJ:* ${usedPrefix}setpago Yape|927174369`)
            let [n2, p2] = args.join(' ').split('|')
            if (!p2) return m.reply('❌ Formato: metodo|numero')
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
            m.reply(`✅ *Método "${delP}" eliminado*`)
        break

        case 'setstock':
            if (args.length < 2) return m.reply(`📊 *USO:* ${usedPrefix}setstock producto|cantidad\n*EJ:* ${usedPrefix}setstock Netflix|15`)
            let [n3, p3] = args.join(' ').split('|')
            if (!p3) return m.reply('❌ Formato: producto|cantidad')
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
            m.reply(`✅ *Producto "${delS}" eliminado*`)
        break

        // ========== PUBLICO ==========
        case 'combos':
            if (Object.keys(data.combos).length == 0) return m.reply('❌ No hay combos registrados aún')
            let txtC = `🧰 *LISTA DE COMBOS DISPONIBLES* 🧰\n\n`
            for (let [k,v] of Object.entries(data.combos)) {
                txtC += `💎 *${k.toUpperCase()}*\n💰 Precio: S/ ${v.precio}\n📝 ${v.desc}\n\n`
            }
            txtC += `*Para comprar:* Escribe ${usedPrefix}pago para ver métodos`
            m.reply(txtC)
        break

        case 'pago':
            if (Object.keys(data.pago).length == 0) return m.reply('❌ No hay métodos de pago registrados')
            let txtP = `💳 *MÉTODOS DE PAGO ACEPTADOS* 💳\n\n`
            for (let [k,v] of Object.entries(data.pago)) {
                txtP += `💎 *${k.toUpperCase()}*\n📲 ${v}\n\n`
            }
            txtP += `_Realiza el pago y envía tu comprobante_`
            m.reply(txtP)
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

handler.help = ['setcombos','delcombos','setpago','delpago','setstock','delstock','combos','pago','stock']
handler.tags = ['shop'] // <- PARA QUE SALGA EN EL MENU
handler.command = /^(setcombos|delcombos|setpago|delpago|setstock|delstock|combos|pago|stock)$/i
handler.group = true

export default handler