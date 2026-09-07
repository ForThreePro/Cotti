import fs from 'fs'
let db = './database/autocmds.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let cmds = JSON.parse(fs.readFileSync(db))
    let chat = m.chat
    if (!cmds[chat]) cmds[chat] = {}
    let data = cmds[chat]
    const guardar = () => fs.writeFileSync(db, JSON.stringify(cmds, null, 2))

    // ========== SET ==========
    if (command === 'set') {
        let nombre = args[0]?.toLowerCase()
        if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}set nombre texto/media`)

        let texto = args.slice(1).join(' ')
        let q = m.quoted || m
        let media = null
        let type = null

        // Detectar que tipo de media es
        if (q.mimetype) {
            media = await q.download()
            if (q.mimetype.includes('image')) type = 'image'
            else if (q.mimetype.includes('video')) type = 'video'
            else if (q.mimetype.includes('audio')) type = 'audio'
            else if (q.mimetype.includes('sticker')) type = 'sticker'
            else type = 'document'
        }

        data[nombre] = {
            texto: texto || "",
            media: media? media.toString('base64') : null,
            type: type
        }
        guardar()
        return m.reply(`✅ *COMANDO.${nombre} CREADO*\n\nAhora usa:.${nombre}`)
    }

    // ========== DEL ==========
    if (command === 'del') {
        let nombre = args[0]?.toLowerCase()
        if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}del nombre`)
        if (!data[nombre]) return m.reply('❌ Ese comando no existe')
        delete data[nombre]
        guardar()
        return m.reply(`✅ *Comando.${nombre} eliminado*`)
    }

    // ========== MENU ==========
    if (command === 'menucmd') {
        let lista = Object.keys(data)
        if (lista.length == 0) return m.reply('❌ No hay comandos personalizados aún')
        let txt = `╭━〔 📋 COMANDOS DEL GRUPO 〕━⬣\n`
        lista.forEach(n => txt += `┃ •.${n}\n`)
        txt += `╰━━━━━━━━━━━━⬣`
        return m.reply(txt)
    }

    // ========== USAR COMANDO ==========
    if (data[command]) {
        let cmd = data[command]
        let buffer = cmd.media? Buffer.from(cmd.media, 'base64') : null

        if (cmd.type === 'image') await conn.sendMessage(chat, { image: buffer, caption: cmd.texto }, { quoted: m })
        else if (cmd.type === 'video') await conn.sendMessage(chat, { video: buffer, caption: cmd.texto }, { quoted: m })
        else if (cmd.type === 'audio') await conn.sendMessage(chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
        else if (cmd.type === 'sticker') await conn.sendMessage(chat, { sticker: buffer }, { quoted: m })
        else if (cmd.type === 'document') await conn.sendMessage(chat, { document: buffer, mimetype: q.mimetype, fileName: 'archivo' }, { quoted: m })
        else if (cmd.texto) m.reply(cmd.texto)
        
        return
    }
}

handler.help = ['set', 'del', 'menucmd']
handler.tags = ['cmd']
handler.command = /^(set|del|menucmd|\w+)$/i
handler.group = true
export default handler