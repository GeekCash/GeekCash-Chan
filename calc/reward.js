
var moment = require('moment');
var _ = require('util');

module.exports = {
    calc: function () {

        var outputs = [];
        var str = "";
        var h = 100
        var total = 180000000;
        var base = 3600;
        var subsidy = 3600000000;
        var reward = 1;
        var nSubsidyHalvingInterval = 262800;//262800;
        while (total < subsidy) {
            //while (h < 8672400) {
            //reward = base - (Math.pow(h,2) / subsidy);
            var d = moment.unix(1525796559);
            reward = base - h / 1440 * 15;
            if (reward <= 680) {
                reward = 680;
            }

            for (let i = nSubsidyHalvingInterval; i <= h; i += nSubsidyHalvingInterval) {
                reward -= reward / 20;
            }

            superblock = (h > 300000) ? reward / 20 : 0;
            reward -= superblock;

            total += reward + superblock;
           
            if (h == 100 || h % (nSubsidyHalvingInterval) == 0) {
                str += _.format("%s, supply: %s, block: %s, reward: %s, superblock: %s\n", d.add((h / 60 / 24), 'd').format("YYYY-MM-DD"), total, h, reward, superblock * 1440 * 30);
            }

            if (str.length > 1800 || total > subsidy) {
                outputs.push(str);
                str = "";
            }
            h++;
            //console.log("at: %s, total: %s, block: %s, reward: %s ", d.add((h / 60 / 24), 'd').format("YYYY-MM-DD"), total, h, reward);
        }

        return outputs;

    }
}


