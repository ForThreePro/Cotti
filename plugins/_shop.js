import fs from 'fs'
let db = './database/shop.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, JSON.stringify({}))

const guardar = () => fs.writeFileSync(db, JSON.stringify(shop, null, 2))
let shop = JSON.parse(fs.readFileSync(db))

// ========== COMANDOS SOLO ADMIN ==========

// SET COMBOS
let handlerSetCombos = async (m, { conn, args, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (args.length < 2) return m.reply(`📦 *USO:* ${usedPrefix}setcombos nombre|precio|descripcion`)
    let [n1, p1,...d1] = args.join(' ').split('|')
    if (!p1 ||!d1.length) return m.reply('❌ Formato incorrecto. Usa: nombre|precio|descripcion')
    data.combos[n1.toLowerCase()] = {precio: p1.trim(), desc: d1.join('|').trim()}
    guardar()
    m.reply(`✅ *COMBO GUARDADO*\n\n📦 Nombre: ${n1}\n💰 Precio: S/ ${p1}\n📝 Descripción: ${d1.join('|')}`)
}
handlerSetCombos.help = ['setcombos nombre|precio|desc']
handlerSetCombos.tags = ['shop']
handlerSetCombos.command = /^setcombos$/i
handlerSetCombos.admin = true // <- SOLO ADMIN
handlerSetCombos.group = true

// DEL COMBOS
let handlerDelCombos = async (m, { conn, args, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delcombos nombre`)
    let delC = args[0].toLowerCase()
    if (!data.combos[delC]) return m.reply('❌ Ese combo no existe')
    delete data.combos[delC]
    guardar()
    m.reply(`✅ *Combo "${delC}" eliminado*`)
}
handlerDelCombos.help = ['delcombos nombre']
handlerDelCombos.tags = ['shop']
handlerDelCombos.command = /^delcombos$/i
handlerDelCombos.admin = true
handlerDelCombos.group = true

// SET PAGO
let handlerSetPago = async (m, { conn, args, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (args.length < 2) return m.reply(`💳 *USO:* ${usedPrefix}setpago metodo|numero`)
    let [n2, p2] = args.join(' ').split('|')
    if (!p2) return m.reply('❌ Formato incorrecto. Usa: metodo|numero')
    data.pago[n2.toLowerCase()] = p2.trim()
    guardar()
    m.reply(`✅ *MÉTODO DE PAGO AGREGADO*\n\n💳 Método: ${n2}\n📲 Dato: ${p2}`)
}
handlerSetPago.help = ['setpago metodo|numero']
handlerSetPago.tags = ['shop']
handlerSetPago.command = /^setpago$/i
handlerSetPago.admin = true
handlerSetPago.group = true

// DEL PAGO
let handlerDelPago = async (m, { conn, args, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delpago metodo`)
    let delP = args[0].toLowerCase()
    if (!data.pago[delP]) return m.reply('❌ Ese método no existe')
    delete data.pago[delP]
    guardar()
    m.reply(`✅ *Método "${delP}" eliminado*`)
}
handlerDelPago.help = ['delpago metodo']
handlerDelPago.tags = ['shop']
handlerDelPago.command = /^delpago$/i
handlerDelPago.admin = true
handlerDelPago.group = true

// SET STOCK
let handlerSetStock = async (m, { conn, args, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (args.length < 2) return m.reply(`📊 *USO:* ${usedPrefix}setstock producto|cantidad`)
    let [n3, p3] = args.join(' ').split('|')
    if (!p3) return m.reply('❌ Formato incorrecto. Usa: producto|cantidad')
    data.stock[n3.toLowerCase()] = p3.trim()
    guardar()
    m.reply(`✅ *STOCK ACTUALIZADO*\n\n📦 Producto: ${n3}\n📊 Cantidad: ${p3}`)
}
handlerSetStock.help = ['setstock producto|cantidad']
handlerSetStock.tags = ['shop']
handlerSetStock.command = /^setstock$/i
handlerSetStock.admin = true
handlerSetStock.group = true

// DEL STOCK
let handlerDelStock = async (m, { conn, args, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (!args[0]) return m.reply(`🗑️ *USO:* ${usedPrefix}delstock producto`)
    let delS = args[0].toLowerCase()
    if (!data.stock[delS]) return m.reply('❌ Ese producto no existe')
    delete data.stock[delS]
    guardar()
    m.reply(`✅ *Producto "${delS}" eliminado*`)
}
handlerDelStock.help = ['delstock producto']
handlerDelStock.tags = ['shop']
handlerDelStock.command = /^delstock$/i
handlerDelStock.admin = true
handlerDelStock.group = true

// ========== COMANDOS LIBRES PARA TODOS ==========

// VER COMBOS
let handlerCombos = async (m, { conn, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (Object.keys(data.combos).length == 0) return m.reply('❌ No hay combos registrados aún')
    let txtC = `🧰 *LISTA DE COMBOS DISPONIBLES* 🧰\n\n`
    for (let [k,v] of Object.entries(data.combos)) {
        txtC += `💎 *${k.toUpperCase()}*\n💰 Precio: S/ ${v.precio}\n📝 ${v.desc}\n\n`
    }
    txtC += `*Para comprar:* Escribe ${usedPrefix}pago`
    m.reply(txtC)
}
handlerCombos.help = ['combos']
handlerCombos.tags = ['shop']
handlerCombos.command = /^combos$/i
handlerCombos.group = true // sin admin = libre

// VER PAGO
let handlerPago = async (m, { conn, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (Object.keys(data.pago).length == 0) return m.reply('❌ No hay métodos de pago registrados')
    let txtP = `💳 *MÉTODOS DE PAGO ACEPTADOS* 💳\n\n`
    for (let [k,v] of Object.entries(data.pago)) {
        txtP += `💎 *${k.toUpperCase()}*\n📲 ${v}\n\n`
    }
    m.reply(txtP)
}
handlerPago.help = ['pago']
handlerPago.tags = ['shop']
handlerPago.command = /^pago$/i
handlerPago.group = true

// VER STOCK
let handlerStock = async (m, { conn, usedPrefix }) => {
    let chat = m.chat
    if (!shop[chat]) shop[chat] = {combos:{}, pago:{}, stock:{}}
    let data = shop[chat]

    if (Object.keys(data.stock).length == 0) return m.reply('❌ No hay stock registrado')
    let txtS = `📦 *STOCK DISPONIBLE* 📦\n\n`
    for (let [k,v] of Object.entries(data.stock)) {
        txtS += `💎 *${k.toUpperCase()}*\n📊 Cantidad: ${v}\n\n`
    }
    m.reply(txtS)
}
handlerStock.help = ['stock']
handlerStock.tags = ['shop']
handlerStock.command = /^stock$/i
handlerStock.group = true

export default [handlerSetCombos, handlerDelCombos, handlerSetPago, handlerDelPago, handlerSetStock, handlerDelStock, handlerCombos, handlerPago, handlerStock]