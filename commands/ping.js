var ping = function(msg) {
    var start = Date.now();
    bot.sendMessage(msg, "pong", function(err, message){
        var stop = Date.now();
	var diff = (stop - start);
        bot.updateMessage(message, "pong `"+diff+"ms`");
    });
}

module.exports = {
     main: function(bot, msg) {
        ping(msg);
    },
    help: 'ping the bot'
};