const Command = require("discord.js-commando").Command

module.exports = class NiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nice',
			group: 'util',
			memberName: 'nice',
			description: '*nice*',
			args: []
		});
	}

	async run(msg, args){
		console.log("running")
		// return msg.channel.send("https://cdn.discordapp.com/attachments/539928445984178201/541373345644544020/weflip-thumbsup_904.png")
	}
};