// Invoke 'strict' JavaScript mode
'use strict';

const moment = require('moment'),
    Masternode = require('../model/masternode'),
    _ = require('mix-dash');

module.exports = {
    send: function (data) {
        if (data) {
            var _at = moment().add(6, 'minutes').toDate();
            try {
                var _o = '';
                _o += '**Your masternode has been last seen before ' + moment.unix(data.ls).fromNow() + '**';
                _o += '\n**' + data.ip + '**';
                _o += '\nStatus: ' + data.stt;
                _o += '\nPayee: ' + data.wid;
                // _o += '\nRank: ' + data.rnk;
                _o += '\nActive: ' + moment.duration(data.at * 1000).humanize();
                _o += '\nProtocol: ' + data.pro;
                _o += '\nLast seen: ' + moment.unix(data.ls).fromNow();
                _o += _.format('\n<https://explorer.geekcash.org/address/{0}>', data.wid);
                _o += '\n\n';

                global.Discord.users.get(data.uid).send(_o);

                Masternode.update({ _id: data.id }, { $set: { tt: _at } }, function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('sendmessage Done', data.id);
                });

            } catch (error) {
                console.log(error);
            }
        }
    },
};