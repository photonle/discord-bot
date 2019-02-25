const {Command} = require("discord.js-commando")
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

	/**
	 * @param {CommandMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){return msg.say(new Attachment("https://cdn.discordapp.com/attachments/539928445984178201/541373345644544020/weflip-thumbsup_904.png"))}
}