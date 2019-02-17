const Command = require("discord.js-commando").Command
const {Attachment} = require("discord.js")

module.exports = class NiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nice',
			group: 'util',
			memberName: 'nice',
			description: '*nice*',
			clientPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async run(msg, args, _){
		await msg.delete()
		return msg.channel.send(new Attachment("https://cdn.discordapp.com/attachments/539928445984178201/541373345644544020/weflip-thumbsup_904.png"))

	}
}