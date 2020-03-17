require('dotenv').config();

const { getServerIpAddress } = require('./../util/serverUtil');

process.env['SERVER_IP_ADDRESS'] = getServerIpAddress();
