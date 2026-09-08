import fs from 'fs'
import path from 'path'
import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import axios from 'axios'

let db = './database/autocmds.json'
let api = { url: 'https://api.stellarwa.xyz', key: 'proyectsV2' }

if (!fs.existsSync('./database')) fs.mkdirSync('./database')
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let cmds = JSON.parse(fs.readFileSync(db))
    let chat = m.chat
    if (!cmds[chat]) cmds[chat] = {}
    let data = cmds[chat]

    const guardar = () => fs.writeFileSync(db, JSON.stringify(cmds))

    // ========== CREAR ==========
    if (command === 'set') {
        let nombre = args[0]?.toLowerCase()
        if (!nombre) return m.reply(`📌 USO: ${usedPrefix}set nombre texto/media`)

        let texto = args.slice(1).join(' ')
        let q = m.quoted || m
        let mime = (q.msg || q).mimetype || ''
        let link = null
        let type = null

        if (mime) {
            await m.react('⏳')
            let media = await q.download()
            let upload = await myCloud(media)
            if (!upload.url) return m.reply('❌ Error al subir a la nube')
            link = upload.url

            if (mime.includes('image')) type = 'image'
            else if (mime.includes('video')) type = 'video'
            else if (mime.includes('sticker')) type = 'sticker'
            else if (mime.includes('audio')) type = 'audio'
            else type = 'document'
        }

        data[nombre] = { texto, link, type }
        guardar()
        await m.react('✅')
        return m.reply(`✅ *COMANDO.${nombre} CREADO*\n🔗 Guardado en: ${link || 'Texto'}`)
    }

    // ========== BORRAR ==========
    if (command === 'del') {
        let nombre = args[0]?.toLowerCase()
        if (!data[nombre]) return m.reply('❌ No existe')
        delete data[nombre]
        guardar()
        return m.reply(`✅ Comando.${nombre} eliminado`)
    }

    // ========== LISTA ==========
    if (command === 'menucmd') {
        let lista = Object.keys(data)
        if (lista.length == 0) return m.reply('❌ No hay comandos')
        return m.reply(`📋 *COMANDOS:*\n` + lista.map(n => `•.${n}`).join('\n'))
    }

    // ========== USAR COMANDO CON HD ==========
    if (data[command]) {
        let cmd = data[command]
        try {
            if (cmd.type === 'image' && cmd.link) {
                await m.react('⏳')
                let hd = await upscaleTo4K(cmd.link)
                await conn.sendMessage(chat, { image: hd, caption: cmd.texto || '' }, { quoted: m })
                await m.react('✅')
            }
            else if (cmd.type === 'video' && cmd.link) {
                let buffer = await (await fetch(cmd.link)).buffer()
                await conn.sendMessage(chat, { video: buffer, caption: cmd.texto || '' }, { quoted: m })
            }
            else if (cmd.type === 'sticker' && cmd.link) {
                let buffer = await (await fetch(cmd.link)).buffer()
                await conn.sendMessage(chat, { sticker: buffer }, { quoted: m })
            }
            else if (cmd.type === 'audio' && cmd.link) {
                let buffer = await (await fetch(cmd.link)).buffer()
                await conn.sendMessage(chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
            }
            else if (cmd.texto) {
                m.reply(cmd.texto)
            }
        } catch { m.reply('❌ Error al enviar. Link caido') }
        return
    }
}

// SUBIR A EVOGB
async function myCloud(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType? fileType.ext : 'bin'
  const mime = fileType? fileType.mime : 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  if (!response.ok) throw new Error()
  return await response.json()
}

// HACER HD 4K CON STELLAR
async function upscaleTo4K(url) {
  const apiUrl = `${api.url}/tools/upscale?url=${encodeURIComponent(url)}&scale=4&key=${api.key}`
  const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 120000 })
  if (!res.data) throw 'Error HD'
  return Buffer.from(res.data)
}

handler.help = ['set', 'del', 'menucmd']
handler.tags = ['cmd']
handler.command = /^(set|del|menucmd|\w+)$/i
handler.group = true
handler.admin = true
export default handler