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
		msg.reply("https://cdn.discordapp.com/attachments/539928445984178201/541373345644544020/weflip-thumbsup_904.png")
	}
};