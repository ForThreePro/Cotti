import fs from 'fs'
let db = './database/autocmds.json'

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    try {
        let cmds = {}
        try { cmds = JSON.parse(fs.readFileSync(db)) } catch { cmds = {} }
        
        let chat = m.chat
        if (!cmds[chat]) cmds[chat] = {}
        let data = cmds[chat]
        const guardar = () => { try { fs.writeFileSync(db, JSON.stringify(cmds)) } catch { m.reply('❌ Error al guardar') }

        if (command === 'set') {
            let nombre = args[0]?.toLowerCase()
            if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}set nombre texto/media`)
            if (nombre.length > 30) return m.reply('❌ Nombre muy largo')

            let texto = args.slice(1).join(' ')
            let q = m.quoted || m
            let media = null
            let type = null

            if (q.mimetype) {
                try {
                    media = await q.download()
                    if (media.length > 20 * 1024 * 1024) return m.reply('❌ El archivo es muy pesado. Max 20MB') // <- 20MB
                    if (q.mimetype.includes('image')) type = 'image'
                    else if (q.mimetype.includes('video')) type = 'video'
                    else if (q.mimetype.includes('audio')) type = 'audio'
                    else if (q.mimetype.includes('sticker')) type = 'sticker'
                    else type = 'document'
                } catch { return m.reply('❌ Error al descargar') }
            }

            data[nombre] = { texto: texto || "", media: media? media.toString('base64') : null, type: type }
            guardar()
            return m.reply(`✅ *COMANDO.${nombre} CREADO*\n\nAhora usa:.${nombre}`)
        }

        if (command === 'del') {
            let nombre = args[0]?.toLowerCase()
            if (!nombre) return m.reply(`📌 *USO:* ${usedPrefix}del nombre`)
            if (!data[nombre]) return m.reply('❌ Ese comando no existe')
            delete data[nombre]
            guardar()
            return m.reply(`✅ *Comando.${nombre} eliminado*`)
        }

        if (command === 'menucmd') {
            let lista = Object.keys(data)
            if (lista.length == 0) return m.reply('❌ No hay comandos aún')
            let txt = `╭━〔 📋 COMANDOS 〕━⬣\n`
            lista.forEach(n => txt += `┃ •.${n}\n`)
            txt += `╰━━━━━━━━━━━━⬣`
            return m.reply(txt)
        }

        if (data[command]) {
            let cmd = data[command]
            let buffer = cmd.media? Buffer.from(cmd.media, 'base64') : null
            try {
                if (cmd.type === 'image') await conn.sendMessage(chat, { image: buffer, caption: cmd.texto }, { quoted: m })
                else if (cmd.type === 'video') await conn.sendMessage(chat, { video: buffer, caption: cmd.texto }, { quoted: m })
                else if (cmd.type === 'audio') await conn.sendMessage(chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
                else if (cmd.type === 'sticker') await conn.sendMessage(chat, { sticker: buffer }, { quoted: m })
                else if (cmd.type === 'document') await conn.sendMessage(chat, { document: buffer }, { quoted: m })
                else if (cmd.texto) m.reply(cmd.texto)
            } catch { m.reply('❌ Error al enviar') }
            return
        }
    } catch (e) {
        console.log(e)
        m.reply('❌ *ANTICRASH:* El bot no se cayó')
    }
}

handler.help = ['set', 'del', 'menucmd']
handler.tags = ['cmd']
handler.command = /^(set|del|menucmd|\w+)$/i
handler.group = true
export default handler