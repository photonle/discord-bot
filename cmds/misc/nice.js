const {Command} = require("discord.js-commando")
const {MessageAttachment} = require("discord.js")

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

	/**
	 * @param {CommandoMessage} msg The incoming message.
	 */
	async run(msg){return msg.say(new MessageAttachment("https://cdn.discordapp.com/attachments/539928445984178201/541373345644544020/weflip-thumbsup_904.png"))}
}
