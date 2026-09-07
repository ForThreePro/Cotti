import fs from 'fs'
let db = './database/shop.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, JSON.stringify({}))

// VER COMBOS
let handlerCombos = async (m, { conn, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
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
handlerCombos.group = true

// VER PAGO
let handlerPago = async (m, { conn, usedPrefix }) => {
    let shop = JSON.parse(fs.readFileSync(db))
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
    let shop = JSON.parse(fs.readFileSync(db))
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

export default [handlerCombos, handlerPago, handlerStock]