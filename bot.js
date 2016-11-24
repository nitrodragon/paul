"use strict";

var Discord = require("discord.js");
var fs = require('fs');

var bot = new Discord.Client({autoReconnect: true});

bot.OWNERID = '<your-discord-id>';
bot.PREFIX = '<prefix>';
bot.TOKEN = '<your-token-here>'

String.prototype.padRight = function(l,c) {return this+Array(l-this.length+1).join(c||" ")}
var commands = {}

commands.help = {};
commands.help.args = '';
commands.help.help = "show this message";
commands.help.main = function(bot, msg) {
    var final = "";
    for (let command in commands) {
        if (!commands[command].hide) {
            final += (command+" "+commands[command].args).padRight(30, ' ') +commands[command].help + "\n";
        }
    }
    bot.sendMessage(msg, "```xl\n"+final+"\n```");
}

commands.load = {};
commands.load.args = '<command>';
commands.load.help = '';
commands.load.hide = true;
commands.load.main = function(bot, msg) {
    if (msg.author.id == bot.OWNERID){
    var args = msg.content.split(' ')[2];
    try {
        delete commands[args];
        delete require.cache[__dirname+'/commands/'+args+'.js'];
        commands[args] = require(__dirname+'/commands/'+args+'.js');
        bot.sendMessage(msg, 'Loaded '+args);
    } catch(err) {
        bot.sendMessage(msg, "Command not found or error loading\n`"+err.message+"`");
    }
    }
}

commands.unload = {};
commands.unload.args = '<command>';
commands.unload.help = '';
commands.unload.hide = true;
commands.unload.main = function(bot, msg) {
    if (msg.author.id == bot.OWNERID){
        var args = msg.content.split(' ')[2];
        try {
            delete commands[args];
            delete require.cache[__dirname+'/commands/'+args+'.js'];
            bot.sendMessage(msg, 'Unloaded '+args);
        }
        catch(err){
            bot.sendMessage(msg, "Command not found");
        }
    }
}

commands.reload = {};
commands.reload.args = '';
commands.reload.help = '';
commands.reload.hide = true;
commands.reload.main = function(bot, msg) {
    if (msg.author.id == bot.OWNERID){
        var args = msg.content.split(' ')[2];
        try {
            delete commands[args];
            delete require.cache[__dirname+'/commands/'+args+'.js'];
            commands[args] = require(__dirname+'/commands/'+args+'.js');
            bot.sendMessage(msg, 'Reloaded '+args);
        }
        catch(err){
            bot.sendMessage(msg, "Command not found");
        }
    }
}

var loadCommands = function() {
    var files = fs.readdirSync(__dirname+'/commands');
    for (let file of files) {
        if (file.endsWith('.js')) {
            commands[file.slice(0, -3)] = require(__dirname+'/commands/'+file);
        }
    }
    console.log("———— All Commands Loaded! ————");
}

var checkCommand = function(msg, length) {
    try {
        if(typeof msg.content.split(' ')[length] === 'undefined') {
            // prefix without command.
        } else {
        	msg.content = msg.content.substr(msg.content.split(" ", length).join(" ").length);
            var command = msg.content.split(' ')[1];
            msg.content = msg.content.split(' ').splice(2, msg.content.split(' ').length).join(' ');
            commands[command].main(bot, msg);
        }
    }
    catch(err) {
        console.log(err.message);
    }
}

bot.on("ready", () => {
    console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
    bot.setStatus("online", "");
    loadCommands();
});

bot.on("message", msg => {
    if (msg.content.startsWith('<@'+bot.user.id+'>') || msg.content.startsWith('<@!'+bot.user.id+'>')) {
        checkCommand(msg, 1);
    } else if (msg.content.startsWith(bot.PREFIX)) {
    	checkCommand(msg, bot.PREFIX.split(' ').length);
    }
});

bot.on('error', (err) => {
    console.log("————— BIG ERROR —————");
    console.log(err);
    console.log("——— END BIG ERROR ———");
});

bot.on("disconnected", () => {
	console.log("Disconnected!");
});

bot.loginWithToken(bot.TOKEN);