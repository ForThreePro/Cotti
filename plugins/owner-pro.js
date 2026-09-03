import { exec } from "child_process"

let handler = async (m, { conn, command }) => {
    const owner = "@56931300864"

    // 1. RESET
    if (command === 'reset') {
        await m.react('🔄')
        await m.reply(`🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘 - 𝗥𝗘𝗦𝗘𝗧* 🐱

*━━━━━━━━━━*
*🔄 REINICIANDO SISTEMA*

> _Marie dice: Por favor espera unos segundos..._

*━━━━━━━━━━*`)
        process.send('reset')
    }

    // 2. AUTOADMIN
    if (command === 'autoadmin') {
        try {
            await m.react('👑')
            await conn.groupParticipantsUpdate(m.chat, [conn.user.jid], 'promote')
            await m.reply(`🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘 - 𝗔𝗗𝗠𝗜𝗡* 🐱

*━━━━━━━━━━*
*✅ ADMINISTRADOR ASIGNADO*

*➤* Ya tengo poderes de *admin* en este grupo

*━━━━━━━━━━*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱

*━━━━━━━━━━*
*❌ ERROR*

*➤* No pude asignarme *admin*
*➤* Revisa que ya no sea admin o que tengas permisos

*━━━━━━━━━━*`)
        }
    }

    // 3. UPDATE / ACTUALIZAR / FIX
    if (command === 'update' || command === 'actualizar' || command === 'fix') {
        if (m.react) await m.react('🌀')

        await conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘 - 𝗨𝗣𝗗𝗔𝗧𝗘* 🐱

*━━━━━━━━━━*
*🌀 ACTUALIZANDO MODULOS*

> _Obteniendo cambios del repositorio..._

*━━━━━━━━━━*`, m)

        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
                if (m.react) await m.react('❌')
                return conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱

*━━━━━━━━━━*
*❌ ERROR EN LA ACTUALIZACION*

*➤* Detalle: 
\`\`${err.message}\`\`

*━━━━━━━━━━*
*Owner:* ${owner}
*IG:* @cottii.dzn`, m)
            }

            if (stdout.includes('Already up to date.')) {
                if (m.react) await m.react('✅')
                return conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱

*━━━━━━━━━━*
*✅ SISTEMA ACTUALIZADO*

*➤* El sistema ya está en su *versión más reciente*

*━━━━━━━━━━*
*Owner:* ${owner}
*IG:* @cottii.dzn`, m)
            }

            if (m.react) await m.react('✅')
            return conn.reply(m.chat, `🐱 *𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧𝗦 𝗫 𝗠𝗔𝗥𝗜𝗘* 🐱

*━━━━━━━━━━*
*✅ ACTUALIZACION APLICADA*

*📋 Cambios:*
\`\`${stdout}\`\`

*━━━━━━━━━━*
*Owner:* ${owner}
*IG:* @cottii.dzn`, m)
        })
    }
}

handler.help = ['reset', 'autoadmin', 'update']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin', 'update', 'actualizar', 'fix']
handler.rowner = true

export default handler