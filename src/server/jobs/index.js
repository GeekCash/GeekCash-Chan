// Invoke 'strict' JavaScript mode
'use strict';

var moment = require('moment'),
    Bus = require('busmq'),
    _ = require('mix-dash'),
    axios = require('axios'),
    Mustache = require('mustache'),
    LRU = require('lru-cache'),
    fs = require('fs'),
    CronJob = require('cron').CronJob,
    Masternode = require('../model/masternode'),
    config = require('../config');


var cache = LRU({ maxAge: 1000 * 60 * 60 });


module.exports = {

    queue: null,

    start: function () {

        var _this = this;
        var bus = Bus.create({ redis: ['redis://127.0.0.1:6379'] });
        bus.connect();


        bus.on('online', function () {
            var queue = bus.queue('discord-queue');
            queue.attach();

            _this.queue = queue;
            // catches ctrl+c event
            process.on('SIGINT', function () {
                queue.close();
                console.log('Queue: removing all messages.');
            });

            process.on('exit', function () {
                queue.close();
                console.log('Queue: removing all messages.');
            });


            // masternodes sync
            new CronJob('*/3 * * * *', function () {
                queue.push({ act: 'stats' });
            }, null, true);

            // masternodes sync
            new CronJob('*/15 * * * * *', function () {

                var _ls60 = moment().add(-60, 'minutes').unix();
                var _ls30 = moment().add(-30, 'minutes').unix();
                var _at = moment().unix();

                // ls: { $lt: _ls30, $gt: _ls60 }

                Masternode.find({ tt: { $lt: _at } }).sort({ tt: 1 }).limit(50).exec(function (err, docs) {
                    if (docs && docs.length > 0) {
                        //   console.log(docs);
                        for (let i = 0; i < docs.length; i++) {
                            const doc = docs[i];

                            setTimeout(function () {
                                _this.queue.push({ act: 'sync', data: { search: doc.ip, t: new Date().getTime() } });
                            }, i * 300);

                        }

                        var arrs = _.filter(docs, o => o.ls < _ls30 && o.ls > _ls60);

                        for (let i = 0; i < arrs.length; i++) {
                            var doc = arrs[i].toJSON();
                            doc.time = moment.unix(doc.ls).fromNow();
                            setTimeout(function () {
                                _this.queue.push({ act: 'warning', data: doc });
                            }, i * 300);

                        }

                        arrs = _.filter(docs, o => o.lp > _ls60);

                        for (let i = 0; i < arrs.length; i++) {
                            var doc = arrs[i].toJSON();
                            var id = [doc.uid, doc.ip].join('-');
                            if (!cache.get(id)) {
                                _this.queue.push({ act: 'reward', data: doc });
                                cache.set(id, 1);
                            }

                        }


                        var _ids = _.uniq(_.map(docs, '_id'));
                        Masternode.updateMany({ _id: { $in: _ids } }, { tt: moment().add(5, 'minutes').unix() }, () => { });

                    }
                });


            }, null, true);


            ///

            queue.consume({ remove: true });

            queue.on("message", function (msg, id) {
                msg = JSON.parse(msg);

                switch (msg.act) {
                    case 'stats':
                        _this.stats();
                        break;
                    case 'sync':
                        _this.sync(msg.data);
                        break;

                    default:
                        _this.send(msg.act, msg.data);

                        break;
                }


            });


        });


    },

    stats: function () {

        if (global.Discord.user) {
            axios.post([config.api, 'overview'].join('')).then(({ data }) => {

                var _series = [];
                if (data) {
                    _series.push({ msg: `our ${data.masternodes} masternodes`, type: 'WATCHING' });
                    _series.push({ msg: `block ${data.blocks}`, type: 'PLAYING' });
                    

                }

                for (let i = 0; i < _series.length; i++) {
                    const m = _series[i];

                    setTimeout(function () {
                        global.Discord.user.setActivity(m.msg, { type: m.type });
                    }, i * 60000);

                }

            });
        }
    },

    sync: function (payload) {

        axios.post([config.api, 'mn/info'].join(''), payload).then(({ data }) => {
            if (data && data.length > 0) {
                var obj = data[0];
                delete obj['_id'];
                // console.log(obj);         

                Masternode.updateMany({ ip: obj.ip }, obj, (err, docs) => {
                    console.log('update', obj.ip);
                });
            }
            // 
        });


    },


    send: function (temp, data) {

        if (global.Discord) {
            var u = global.Discord.users.get(data.uid);
            if (u) {
                var txt = fs.readFileSync('./txt/' + temp + '.txt', 'utf-8');
                var msg = Mustache.render(txt, data);
                u.send(msg).catch(err => {
                    console.log(temp, err);
                });
            }
        }

    }

};
