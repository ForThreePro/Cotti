
import fs from 'fs'
import os from 'os'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    await m.react('⏳')

    // OWNER
    if (command === 'owner' || command === 'creator') {
        let owner = '56931300864@s.whatsapp.net'
        let texto = `
🐱 *𓆩 DUEÑA DEL BOT 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`OWNER\`\`* —˙𖦹.💖꒷

 *⤷ ┇ INFORMACION* ：✿ 。

──🌸 *CONTACTO* ╏ 💚
💚 ➛ *Owner:* @${owner.split('@')[0]}
💚 ➛ *Numero:* +56 9 3130 0864

──🌸 *NOTA* ╏ 🌸
🌸 ➛ *Marie dice: Contacta solo para cosas importantes*

━━━━━━━━━━━
*Owner*: @56931300864
> *"COTTI BOTS x Marie está aquí para ayudar"* 💖`

        // Solo 1 foto
        let img = { url: 'https://files.evogb.win/QFXQtu.jpg' }

        await m.react('✅')
        return conn.sendMessage(m.chat, {
            image: img,
            caption: texto,
            mentions: [owner]
        })
    }

    // PING
    if (command === 'ping' || command === 'p') {
        let start = new Date * 1
        await conn.reply(m.chat, '🐱 *Marie dice: Calculando...*', m)
        let end = new Date * 1
        let speed = end - start
        let texto = `
🐱 *𓆩 PING DE COTTI BOTS 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`VELOCIDAD\`\`* —˙𖦹.💖꒷

 *⤷ ┇ ESTADO* ：✿ 。

──🌸 *ESTADISTICAS* ╏ 💚
💚 ➛ *Velocidad:* ${speed}ms
💚 ➛ *Estado:* Activa y atenta

──🌸 *NOTA* ╏ 🌸
🌸 ➛ *Servidor estable*

━━━━━━━━━━━
*Owner*: @56931300864
> *"Respondo más rápido que un parpadeo"* 💖`

        let img = { url: 'https://files.evogb.win/QFXQtu.jpg' }

        await m.react('✅')
        return conn.sendMessage(m.chat, {
            image: img,
            caption: texto
        }, { quoted: m })
    }

    if (command === 'cleartmp') {
        const tmpPath = './tmp'
        if (fs.existsSync(tmpPath)) {
            fs.readdirSync(tmpPath).forEach(file => fs.unlinkSync(`${tmpPath}/${file}`))
        }
        let texto = `
🐱 *𓆩 ***COTTI BOTS x Marie*** 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`LIMPIEZA\`\`* —˙𖦹.💖꒷

 *⤷ ┇ CACHE PURIFICADO* ：✿ 。

──🌸 *RESULTADO* ╏ 💚
💚 ➛ *Caché temporal eliminado*
💚 ➛ *Memoria liberada con éxito*

──🌸 *NOTA* ╏ 🌸
🌸 ➛ *Marie dice: El bot está más ligero*

━━━━━━━━━━━
*Owner*: @56931300864
> *"Ya limpié todo para que estemos ordenados"* 💖`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'cpu') {
        let cpu = os.loadavg()[0].toFixed(2)
        let texto = `
🐱 *𓆩 ***COTTI BOTS x Marie*** 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`CPU\`\`* —˙𖦹.💖꒷

 *⤷ ┇ ESTADO DEL PROCESADOR* ：✿ 。

──🌸 *ESTADISTICAS* ╏ 💚
💚 ➛ *Carga CPU:* ${cpu}%

──🌸 *NOTA* ╏ 🌸
🌸 ➛ *Si supera 90% el bot va lento*

━━━━━━━━━━━
*Owner*: @56931300864
> *"Mi energía está al ${cpu}% para seguir trabajando"* 💖`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'ram') {
        const used = process.memoryUsage()
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)
        let texto = `
🐱 *𓆩 ***COTTI BOTS x Marie*** 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`RAM\`\`* —˙𖦹.💖꒷

 *⤷ ┇ MEMORIA EN USO* ：✿ 。

──🌸 *ESTADISTICAS* ╏ 💚
💚 ➛ *Consumo RAM:* ${ram} MB

──🌸 *NOTA* ╏ 🌸
🌸 ➛ *Memoria usada por el proceso*

━━━━━━━━━━━
*Owner*: @56931300864
> *"Tengo suficiente RAM para seguir ayudando"* 💖`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'uptime') {
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let texto = `
🐱 *𓆩 ***COTTI BOTS x Marie*** 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`UPTIME\`\`* —˙𖦹.💖꒷

 *⤷ ┇ TIEMPO ACTIVO* ：✿ 。

──🌸 *ESTADISTICAS* ╏ 💚
💚 ➛ *Tiempo activo:* ${uptime}

──🌸 *NOTA* ╏ 🌸
🌸 ➛ *Desde que se inició el bot*

━━━━━━━━━━━
*Owner*: @56931300864
> *"Llevo ayudando ${uptime} sin parar"* 💖`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'info') {
        let _muptime = process.uptime() * 1000
        let muptime = clockString(_muptime)
        const used = process.memoryUsage()
        let cpu = os.loadavg()[0].toFixed(2)
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)

        let texto = `
🐱 *𓆩 ***COTTI BOTS x Marie*** 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`REPORTE DE SISTEMA\`\`* —˙𖦹.💖꒷

 *⤷ ┇ ESTADO COMPLETO DEL BOT* ：✿ 。

──🌸 *ESTADISTICAS* ╏ 💚
💚 ➛ *Uptime:* ${muptime}
💚 ➛ *Memoria RAM:* ${ram} MB
💚 ➛ *Carga CPU:* ${cpu}%

──🌸 *DETALLES* ╏ 🌸
🌸 ➛ *Desarrollado por:* Sebastián Barboza
🌸 ➛ *Estado:* Operativo

━━━━━━━━━━━
*Owner*: @56931300864
> *"Todos mis sistemas están al 100% para servir"* 💖`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'tts' || command === 'gtts' || command === 'ttss') {
        let q = m.quoted? m.quoted : m
        let txt = text || q.text || q.caption || q.body || ''

        if (!txt) {
            let texto = `
🐱 *𓆩 ***COTTI BOTS x Marie*** 𓆪* 🐱

.⃟𖥔 ݁. 𖦹˙— *\`\`ERROR\`\`* —˙𖦹.💖꒷

 *⤷ ┇ FALTA TEXTO* ：✿ 。

──🌸 *USO* ╏ 💚
💚 ➛ *Escribe el texto que deseas convertir a audio*
💚 ➛ *O responde a un mensaje*

──🌸 *EJEMPLO* ╏ 🌸
🌸 ➛ ${usedPrefix}tts Hola, ¿cómo estás?

━━━━━━━━━━━
*Owner*: @56931300864
> *"Marie dice: Envíame el texto y lo diré por ti"* 💖`
            await m.react('❌')
            return m.reply(texto)
        }

        await m.react('🎙️')

        let lang = 'es'
        let url = googleTTS.getAudioUrl(txt, {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        })

        let tmpFilePath = path.join(tmpdir(), `marie-${Date.now()}.opus`)

        await new Promise((resolve, reject) => {
            ffmpeg(url)
          .audioCodec('libopus')
          .toFormat('opus')
          .outputOptions([
                    '-avoid_negative_ts make_zero',
                    '-ac 1',
                    '-b:a 64k'
                ])
          .on('end', () => resolve(true))
          .on('error', (err) => reject(err))
          .save(tmpFilePath)
        })

        let audioBuffer = fs.readFileSync(tmpFilePath)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
        await m.react('✅')
    }
}

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['owner', 'ping', 'cleartmp', 'cpu', 'ram', 'uptime', 'info', 'tts <texto>']
handler.tags = ['main', 'tools', 'info']
handler.command = /^(owner|creator|ping|p|cleartmp|cpu|ram|uptime|info|g?tts|ttss)$/i
handler.rowner = false

export default handler