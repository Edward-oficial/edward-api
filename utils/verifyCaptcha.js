const axios = require('axios');

// Secret Key de hCaptcha (dashboard.hcaptcha.com)
const HCAPTCHA_SECRET = 'ES_0cf00826876f4e40abd1c276f295b507';

async function verifyCaptcha(token) {
    if (!token) return false;

    try {
        const { data } = await axios.post(
            'https://hcaptcha.com/siteverify',
            new URLSearchParams({
                secret: HCAPTCHA_SECRET,
                response: token
            })
        );

        return data.success === true;
    } catch (err) {
        return false;
    }
}

module.exports = verifyCaptcha;
  
