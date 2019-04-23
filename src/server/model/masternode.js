var mongoose = require("mongoose");
// paginate = require("mongoose-paginate");

module.exports = mongoose.model("masternode",
    new mongoose.Schema({

        // discord id
        uid: String,

        // masternode alias name
        nm: String,

        ip: String,
        //status 
        stt: { type: String, default: 'Wait sync...' },
        // address payee
        wid: String,
        // last seen
        ls: Number,
        // last payment
        lp: Number,

        // last block paid
        lb: Number,
        // active
        at: Number,
        // protocol
        pro: Number,
        // rank
        rnk: Number,

        idx: Number,

        tt: { type: Number, default: Date.now },

    }, { collection: "masternodes" })
);
