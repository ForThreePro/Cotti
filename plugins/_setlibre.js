import fs from 'fs'
let db = './database/autocmds.json'

// Crear BD si no existe
if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let cmds = JSON.parse(fs.readFileSync(db))
    let chat = m.chat

    if (!cmds[chat]) cmds[chat] = {}
    let data = cmds[chat]

    const guardar = () => fs.writeFileSync(db, JSON.stringify(cmds, null, 2))
    let texto = args.slice(1).join(' ') // todo lo que va despues del nombre

    // ========== SET ==========
    if (command === 'set') {
        let nombre = args[0]?.toLowerCase()
        if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}set nombre | texto o imagen`)

        let q = m.quoted
        let img = q?.mimetype?.includes('image')? await q.download() : m.mimetype?.includes('image')? await m.download() : null

        data[nombre] = {
            texto: texto || "",
            imagen: img? img.toString('base64') : null
        }
        guardar()

        m.reply(`✅ *COMANDO.${nombre} CREADO*\n\nAhora usa:.${nombre}`)
    }

    // ========== DEL ==========
    else if (command === 'del') {
        let nombre = args[0]?.toLowerCase()
        if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}del nombre`)
        if (!data[nombre]) return m.reply('❌ Ese comando no existe')

        delete data[nombre]
        guardar()
        m.reply(`✅ *Comando.${nombre} eliminado*`)
    }

    // ========== VER LISTA ==========
    else if (command === 'menucmd') {
        let lista = Object.keys(data)
        if (lista.length == 0) return m.reply('❌ No hay comandos personalizados aún')
        let txt = `╭━〔 📋 COMANDOS DEL GRUPO 〕━⬣\n`
        lista.forEach(n => txt += `┃ •.${n}\n`)
        txt += `╰━━━━━━━━━━━━⬣`
        m.reply(txt)
    }

    // ========== USAR COMANDO ==========
    else {
        let nombre = command.toLowerCase()
        if (!data[nombre]) return // no existe

        let cmdData = data[nombre]
        if (!cmdData.texto &&!cmdData.imagen) return m.reply(`❌.${nombre} está vacío`)

        if (cmdData.imagen) {
            let buffer = Buffer.from(cmdData.imagen, 'base64')
            await conn.sendMessage(chat, { image: buffer, caption: cmdData.texto }, { quoted: m })
        } else {
            m.reply(cmdData.texto)
        }
    }
}

handler.help = ['set','del','menucmd']
handler.tags = ['cmd']
handler.command = /^(set|del|menucmd|\w+)$/i
handler.group = true