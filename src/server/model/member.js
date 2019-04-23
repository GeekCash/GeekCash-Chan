var mongoose = require("mongoose"),
    paginate = require("mongoose-paginate");

module.exports = mongoose.model("member",
    new mongoose.Schema({

        uid: String,

        nm: String,
        //status 
        stt: { type: Number, default: 1 },
        // active
        tt: Number

    }, { collection: "members" }).plugin(paginate)
);
