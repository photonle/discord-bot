const Command = require("discord.js-commando").Command

module.exports = class NiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'debugs',
			group: 'util',
			memberName: 'debugs',
			description: 'Output debug information such as uptime, API latency and version.',
		});
	}

	async run(msg, args){
		console.log("running")
		// return msg.channel.send("https://cdn.discordapp.com/attachments/539928445984178201/541373345644544020/weflip-thumbsup_904.png")
	}
};