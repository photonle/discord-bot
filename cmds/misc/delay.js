const {Command} = require("discord.js-commando")
const {Attachment} = require("discord.js")

module.exports = class NiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delay',
			group: 'util',
			memberName: 'delay',
			description: '*delay*',
			clientPermissions: ['MANAGE_MESSAGES'],
		});
	}

	/**
	 * @param {CommandMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){return msg.say(new Attachment("http://puu.sh/ED2C4.png"))}
}
