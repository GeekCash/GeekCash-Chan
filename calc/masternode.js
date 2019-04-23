
var _ = require('util');

module.exports = {
    calc: function () {

        var outputs = [];
        var str = "masternode reward at block: 180000\n";

        var h = 180000
        var total = 0;
        var base = 3600;
        var subsidy = 3600000000;
        var reward = 1;
        var nSubsidyHalvingInterval = 262800;

        while (h < 9460800) {
            //reward = base - (Math.pow(h,2) / subsidy);
            // var d = moment.unix(1525796559);
            reward = base - h / 1440 * 15;
            if (reward <= 680) {
                reward = 680;
            }

            for (let i = nSubsidyHalvingInterval; i <= h; i += nSubsidyHalvingInterval) {
                reward -= reward / 20;
            }

            reward -= (h > 300000) ? reward / 20 : 0;

            r = reward / 4 + (h-180000) / 1440 / 6;

            if (r >= reward * 0.80) {
                //console.log("days: %s, block: %s, pow: %s, masternode: %s ", (h / 60 / 24), h, reward - r, r);
                r = reward * 0.80;
                str += _.format("block: %s, reward: %s, pow: %s, masternode: %s \nmasternode reward up to 80% of block reward from %s to 9460800", h,reward, reward - r, r, h);
                outputs.push(str);              
                break;
            }


            if (h == 180000 || h % (1440 * 30) == 0)
                str += _.format("block: %s, reward: %s, pow: %s, masternode: %s \n", h, reward, reward - r, r);

            if (str.length > 1800) {
                outputs.push(str);
                str = "";
            }

            h++;
        }

        return outputs;

    }
}




