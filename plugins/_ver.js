let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

let handler = async (m, { conn }) => {
if (!m.quoted) return conn.reply(m.chat, `🐱 *COTTI BOTS* \n🌸 Marie dice: Responde a una imagen ViewOnce~`, m)
if (!m?.quoted || !m?.quoted?.viewOnce) return conn.reply(m.chat, `🐱 *COTTI BOTS* \n🌸 Marie dice: Eso no es una imagen ViewOnce~`, m)
let buffer = await m.quoted.download(false);
if (/videoMessage/.test(m.quoted.mtype)) {
return conn.sendFile(m.chat, buffer, 'COTTI_BOTS_Marie.mp4', m.quoted.caption || '', m)
} else if (/imageMessage/.test(m.quoted.mtype)) {
return conn.sendFile(m.chat, buffer, 'COTTI_BOTS_Marie.jpg', m.quoted?.caption || '', m)
}}
handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver'] 

export default handler