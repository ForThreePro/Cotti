import { join } from 'path'
import { promises as fs } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

// FUNCION PARA REACCIONES COMPATIBLE
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) return m.reply('🐱 *COTTI BOTS* \n❌ Marie dice: Responde a un video para extraer su audio~')

    await react(conn, m, "🎀")

    let tempVideo
    let tempAudio
    try {
        await m.reply('🎀 *COTTI BOTS* \n⏳ Marie está extrayendo el audio... 🐾')

        const videoBuffer = await q.download()
        if (!videoBuffer) throw new Error('No se pudo obtener el buffer del video.')

        const tempDir = join(process.cwd(), './tmp')
        await fs.stat(tempDir).catch(() => fs.mkdir(tempDir, { recursive: true }))

        tempVideo = join(tempDir, `${Date.now()}.mp4`)
        tempAudio = join(tempDir, `${Date.now()}.mp3`)

        await fs.writeFile(tempVideo, videoBuffer)

        await execFileAsync('ffmpeg', [
            '-y',
            '-i', tempVideo,
            '-vn',
            '-ar', '44100',
            '-ac', '2',
            '-b:a', '192k',
            tempAudio
        ], { timeout: 120000 })

        const audioBuffer = await fs.readFile(tempAudio)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: 'COTTI_BOTS_Marie.mp3',
            ptt: false
        }, { quoted: m })

        await react(conn, m, "💖")
        await m.reply('💖 *COTTI BOTS* \n✅ ¡Audio extraído! Gracias por usar a Marie 🪷\nBot: +56 9 4256 0740')

    } catch (e) {
        console.error(e)
        await react(conn, m, "😿")
        await m.reply('😿 *COTTI BOTS* \n❌ Error: ' + e.message + '\nSoporte: +56 9 3130 0864')
    } finally {
        await fs.unlink(tempVideo).catch(() => {})
        await fs.unlink(tempAudio).catch(() => {})
    }
}

handler.help = ['audivd']
handler.tags = ['tools']
handler.command = ['audivd', 'audio']
handler.limit = true

export default handler