const dotenv = require('dotenv');
const { getServerIpAddress } = require('./../util/serverUtil');

if (process.env.NODE_ENV === 'dev') {
    dotenv.config();
}

process.env['SERVER_IP_ADDRESS'] = getServerIpAddress();
