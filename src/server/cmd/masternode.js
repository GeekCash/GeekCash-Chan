var _ = require('mix-dash'),
    ip = require('ip'),
    moment = require('moment'),
    axios = require('axios'),
    config = require('../config'),
    Masternode = require('../model/masternode');

module.exports.run = async (client, msg, args) => {

    // console.log(args);

    // console.log(msg.author);

    var a = args[0].toLowerCase();
    switch (a) {
        case 'a':
        case 'add':
        case 'u':
        case 'update':

            var i = args[1];

            if (!ip.isV4Format(i)) {
                msg.channel.send('IP address is incorrect');
                return;
            }

            var _m = a == 'u' || a == 'update' ? _.format('Node successfully updated. **{0}**', i) : _.format('Add new Node successfully. **{0}**', i);

            Masternode.findOneAndUpdate({ ip: i, uid: msg.author.id }, {
                ip: i,
                uid: msg.author.id,
                nm: args[2],
                tt: moment().unix()
            }, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, doc) => {
                if (err) {
                    console.log(err);
                }
                msg.channel.send(_m);
            });

            break;


        case 'r':
        case 'remove':


            var i = args[1];
            var _match = i == 'all' ? { uid: msg.author.id } : { ip: i, uid: msg.author.id };
            var _m = i == 'all' ? 'Successfully removed **all** your nodes!\n' : _.format('Node successfully removed. **{0}**\n', i);

            Masternode.remove(_match, (err, doc) => {
                if (err)
                    console.log(err);

                msg.channel.send(_m);

            });

            break;



        case 'i':
        case 'info':

            var i = args[1];

            // var _match = i == 'all' ? { uid: msg.author.id } : { ip: i };

            var _m = '';

            if (i == 'all') {

                Masternode.find({ uid: msg.author.id }, (err, docs) => {
                    if (docs && docs.length) {

                        for (let x = 0; x < docs.length; x++) {
                            const doc = docs[x];

                            var _o = '';
                            _o += '**' + doc.ip + '**';
                            _o += doc.nm ? ' - ' + doc.nm : '';
                            _o += '\nStatus: ' + doc.stt;
                            _o += '\nPayee: ' + doc.wid;
                            _o += '\nWin at: ' + doc.idx;
                            _o += '\nLast reward: ' + moment.unix(doc.lp).fromNow();
                            _o += '\nActive: ' + moment.duration(doc.at * 1000).humanize();                            
                            _o += '\nLast seen: ' + moment.unix(doc.ls).fromNow();
                            _o += '\nProtocol: ' + doc.pro;
                            _o += _.format('\n<https://explorer.geekcash.org/address/{0}>', doc.wid);
                            _o += '\n\n';

                            _m += _o;

                            if (x % 6 == 0 || x == docs.length - 1) {
                               // msg.channel.send(_m);
                               client.users.get(msg.author.id).send(_m);
                                _m = '';
                            }
                        }

                        //msg.channel.send(_m);

                    } else {
                        msg.channel.send(_.format('The node was not found. **{0}**', i));
                    }


                });

            } else {

                axios.post([config.api, 'mn/info'].join(''), { search: i }).then(({ data }) => {
                    if (data && data.length) {
                        var doc = data[0];

                        var _o = '';
                        _o += '**' + doc.ip + '**';
                        _o += '\nStatus: ' + doc.stt;
                        _o += '\nPayee: ' + doc.wid;
                        // _o += '\nRank: ' + doc.rnk;
                        _o += '\nWin at: ' + doc.idx;
                        _o += '\nLast reward: ' + moment.unix(doc.lp).fromNow();
                        _o += '\nActive: ' + moment.duration(doc.at * 1000).humanize();
                        _o += '\nLast seen: ' + moment.unix(doc.ls).fromNow();                        
                        _o += '\nProtocol: ' + doc.pro;
                        _o += _.format('\n<https://explorer.geekcash.org/address/{0}>', doc.wid);
                        _o += '\n\n';

                        msg.channel.send(_o);
                    }

                    else {
                        msg.channel.send(_.format('The node was not found. **{0}**', i));
                    }
                });
            }

            break;       


    }
}