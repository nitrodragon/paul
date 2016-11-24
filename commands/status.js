module.exports = {
  main: (bot, msg, settings) => {
	if (msg.author.id == bot.OWNERID){
		var status = msg.replace("!status ", "");
		bot.setStatus("online", status);
		console.log("Status changed to " + status);
	}
  },
  hide: true
}
