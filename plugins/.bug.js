import fs from 'fs'
import path from 'path'
let db = './database/autocmds.json'
let mediaFolder = './database/autocmds_media/'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(mediaFolder)) fs.mkdirSync(mediaFolder)
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    try {
        let cmds = {}
        try { cmds = JSON.parse(fs.readFileSync(db)) } catch { cmds = {} }

        let chat = m.chat
        if (!cmds[chat]) cmds[chat] = {}
        let data = cmds[chat]

        const guardar = () => { try { fs.writeFileSync(db, JSON.stringify(cmds)) } catch {} }

        if (command === 'set') {
            let nombre = args[0]?.toLowerCase()
            if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}set nombre texto/media`)

            let texto = args.slice(1).join(' ')
            let q = m.quoted || m
            let type = null
            let filePath = null

            if (q.mimetype) {
                try {
                    let media = await q.download()
                    if (media.length > 20 * 1024 * 1024) return m.reply('❌ Max 20MB')

                    if (q.mimetype.includes('image')) type = 'jpg'
                    else if (q.mimetype.includes('video')) type = 'mp4'
                    else if (q.mimetype.includes('audio')) type = 'mp3'
                    else if (q.mimetype.includes('sticker')) type = 'webp'
                    else type = 'bin'

                    // NOMBRE UNICO: chat_nombre_timestamp.ext
                    filePath = path.join(mediaFolder, `${chat}_${nombre}_${Date.now()}.${type}`)
                    fs.writeFileSync(filePath, media)

                    // Borrar archivo anterior si existe para no llenar memoria
                    if (data[nombre]?.file && fs.existsSync(data[nombre].file)) fs.unlinkSync(data[nombre].file)

                } catch { return m.reply('❌ Error al descargar') }
            }

            data[nombre] = { texto: texto || "", type: type, file: filePath }
            guardar()
            return m.reply(`✅ *COMANDO.${nombre} CREADO*\n\nAhora usa:.${nombre}`)
        }

        if (command === 'del') {
            let nombre = args[0]?.toLowerCase()
            if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}del nombre`)
            if (!data[nombre]) return m.reply('❌ Ese comando no existe')

            if (data[nombre].file && fs.existsSync(data[nombre].file)) fs.unlinkSync(data[nombre].file)
            delete data[nombre]
            guardar()
            return m.reply(`✅ *Comando.${nombre} eliminado*`)
        }

        if (command === 'menucmd') {
            let lista = Object.keys(data)
            if (lista.length == 0) return m.reply('❌ No hay comandos aún')
            let txt = `╭━〔 📋 COMANDOS DEL GRUPO 〕━⬣\n`
            lista.forEach(n => txt += `┃ •.${n}\n`)
            txt += `╰━━━━━━━━━━━━⬣`
            return m.reply(txt)
        }

        if (data[command]) {
            let cmd = data[command]
            try {
                if (cmd.file && fs.existsSync(cmd.file)) {
                    let buffer = fs.readFileSync(cmd.file)
                    if (cmd.type === 'jpg') await conn.sendMessage(chat, { image: buffer, caption: cmd.texto }, { quoted: m })
                    else if (cmd.type === 'mp4') await conn.sendMessage(chat, { video: buffer, caption: cmd.texto }, { quoted: m })
                    else if (cmd.type === 'mp3') await conn.sendMessage(chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
                    else if (cmd.type === 'webp') await conn.sendMessage(chat, { sticker: buffer }, { quoted: m })
                    else await conn.sendMessage(chat, { document: buffer }, { quoted: m })
                } else if (cmd.texto) {
                    m.reply(cmd.texto)
                }
            } catch { m.reply('❌ Error al enviar. Archivo dañado') }
            return
        }
    } catch (e) {
        console.log(e)
        m.reply('❌ *ANTICRASH:* El bot sigue vivo')
    }
}

handler.help = ['set', 'del', 'menucmd']
handler.tags = ['cmd']
handler.command = /^(set|del|menucmd|\w+)$/i
handler.group = true
handler.admin = true
export default handler