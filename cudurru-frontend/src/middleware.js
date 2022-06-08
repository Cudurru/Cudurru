
const fetchWrap = require('fetch-wrap');

const authedFetch = fetchWrap(fetch, [
    async function setJWT(url, options, fetch) {
        const jwt = await localStorage.getItem('jwt');
        let token = "Bearer: " + jwt;
        return fetch(url, fetchWrap.merge({}, options, {
            headers: {
                Authorization: token
            }
        }));
    }
]);

export function processResponse (response) {
    const statusCode = response.status;
    const data = response.json();
    const jwt = response.headers.get('X-Jwt', null);
    
    if (jwt != null) {
        /* 8 is the size of the noise
         we add on the backend */
        localStorage.setItem('jwt-noise', jwt.substring(0,8));
        localStorage.setItem('jwt', jwt.substring(8));
    }
    return Promise.all([statusCode, data]).then(res => ({
        statusCode: res[0],
        data: res[1]
    }));
}

export function validateJWT (jwt) {
    if (!jwt) {
        console.log("no JWT!")
        return false;
    }
    const parts = jwt.split('.').map(part => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    const payload = JSON.parse(parts[1]);
    // console.log("payload in validate JWT");
    /*payload's expiration field's key is 'exp' */
    // console.log(payload['exp'] > (Date.now()/1000));
    // console.log(payload['exp']);
    // console.log(Date.now()/1000);

    if (payload['exp'] > (Date.now()/1000)) {
        return true;
    } else {
        return false;
    }
}

export async function isLoggedIn() {
    const jwt = await localStorage.getItem('jwt');
    return validateJWT(jwt);
}

