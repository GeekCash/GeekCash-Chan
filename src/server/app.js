// Load up the discord.js library
const Discord = require("discord.js"),
    fs = require('fs'),
    mongoose = require('mongoose'),
    _ = require('mix-dash'),
    MN = require('./cmd/masternode'),
    Member = require('./model/member'),
    Info = require('./cmd/info'),
    Job = require('./jobs'),
    config = require("./config");


// mongoose.set('useFindAndModify', false);

global.db = mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true });


// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = global.Discord = new Discord.Client();


// job start 
Job.start();


client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    //client.user.setActivity(`...`, { type: 'WATCHING' });
});


client.on("guildMemberAdd", member => {

    if (member.user.bot) return;   

    try {
        client.users.get(member.user.id).send(fs.readFileSync("./txt/welcome.txt", 'utf-8')).catch(error => {
            Member.update({ uid: member.user.id }, { stt: 0 }, (err, doc) => { });
        });
    } catch (error) {
        Member.update({ uid: member.user.id }, { stt: 0 }, (err, doc) => { });
    }



});



client.on("message", async message => {

    //console.log(message);
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    //if (message.content.indexOf(config.prefix) !== 0) return;

    if (!(_.startsWith(message.content, '!') || _.startsWith(message.content, '/') || _.startsWith(message.content, '>'))) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    // Let's go with a few common example commands! Feel free to delete or change those.

    switch (command) {
        case "mn":
            MN.run(client, message, args);
            break;

        case "info":
            Info.run(client, message, args);
            break;

        case "supply":

            var msgs = fs.readFileSync("./txt/supply.txt", 'utf-8').split('--');
            msgs.forEach(function (msg) {
                message.channel.send(_.format('```{0}```', msg));
            });

            //message.channel.send(fs.readFileSync("./txt/supply.txt", 'utf-8'));

            break;

        // case 'ban':

        //     var x = args[0];

        //     if (!message.member.roles.some(r => ["admin"].includes(r.name)))
        //         return message.reply("Sorry, you don't have permissions to use this!");

        //     if (x == 'db') {

        //         Member.find({ stt: -1 }, function (err, docs) {
        //             if (docs && docs.length) {

        //                 for (let i = 0; i < docs.length; i++) {
        //                     const doc = docs[i];
        //                     let member = client.users.get(doc.uid);

        //                     var reason = "Spam!!!";

        //                     //if (!member.bannable)
        //                     member.ban(reason).catch(error => console.log(`Sorry ${message.author} I couldn't ban because of : ${error}`));

        //                     console.log(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);


        //                 }
        //             }
        //         });
        //     }

        //     else {


        //         let member = message.mentions.members.first();
        //         if (!member)
        //             return message.reply("Please mention a valid member of this server");
        //         if (!member.bannable)
        //             return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

        //         let reason = args.slice(1).join(' ');
        //         if (!reason) reason = "No reason provided";

        //         await member.ban(reason)
        //             .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        //         message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
        //     }



        //     break;

        case "help":

            var msg = fs.readFileSync("./txt/help.txt", 'utf-8');

            message.channel.send(msg);
        default:
            break;
    }


});



client.login(config.token);
