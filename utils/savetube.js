const crypto = require('crypto');
const axios = require('axios');

// Clave fija usada por savetube para (des)encriptar la respuesta de /v2/info
const KEY = 'C5D58EF67A7584E4A29F6C35BBC4EB12';

const HEADERS = {
    'content-type': 'application/json',
    origin: 'https://yt.savetube.me',
    'user-agent':
        'Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0'
};

const VALID_FORMATS = ['144', '240', '360', '480', '720', '1080', 'mp3'];

const URL_REGEX =
    /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;

function extractId(url) {
    const match = url.match(URL_REGEX);
    return match ? match[3] : null;
}

function decrypt(enc) {
    const source = Buffer.from(enc, 'base64');
    const key = Buffer.from(KEY, 'hex');
    const iv = source.slice(0, 16);
    const data = source.slice(16);

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

    return JSON.parse(decrypted.toString());
}

async function getCdn() {
    const { data } = await axios.get('https://media.savetube.vip/api/random-cdn', {
        headers: HEADERS
    });

    return data.cdn;
}

async function download(url, format = 'mp3') {
    const id = extractId(url);

    if (!id) {
        throw new Error('No se pudo extraer el ID del video de esa URL');
    }

    if (!VALID_FORMATS.includes(format)) {
        throw new Error(`Formato inválido. Usa uno de: ${VALID_FORMATS.join(', ')}`);
    }

    const cdn = await getCdn();

    const infoRes = await axios.post(
        `https://${cdn}/v2/info`,
        { url: `https://www.youtube.com/watch?v=${id}` },
        { headers: HEADERS }
    );

    const info = decrypt(infoRes.data.data);

    const dlRes = await axios.post(
        `https://${cdn}/download`,
        {
            id,
            downloadType: format === 'mp3' ? 'audio' : 'video',
            quality: format === 'mp3' ? '128' : format,
            key: info.key
        },
        { headers: HEADERS }
    );

    return {
        title: info.title,
        format,
        thumbnail: info.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        duration: info.duration,
        downloadUrl: dlRes.data.data.downloadUrl
    };
}

module.exports = { download };
