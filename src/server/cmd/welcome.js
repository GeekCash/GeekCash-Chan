var _ = require('mix-dash'),
    config = require('../config'),
    axios = require('axios');

module.exports.run = async (client, msg, args) => {

    axios.get([config.api, 'overview'].join('')).catch(function (error) {
        console.log(error);
    }).then(({ data }) => {
        if (data) {

            var _o = '';
            _o += '\nCurrent Block: ' + data.blocks;
            _o += '\nMasternodes: ' + data.masternodes;
            _o += '\nNetwork PoW: ' + _.toKb(data.hashrate, 4);
            _o += '\nSupply: ' + _.toKb(data.supply, 4);
            _o += '\nProtocol requirement: ' + config.protocol;
            _o += '\n\n';

            msg.channel.send(_o);
        }
    });


}