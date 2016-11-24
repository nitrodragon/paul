module.exports = {
     main: function(bot, msg) {
        bot.setNickname(msg.server, msg);
        bot.sendMessage(msg, 'Changed nickname to "' + msg + '"');
    },
    args: '<string>',
    help: 'set the nickname for this server'
};