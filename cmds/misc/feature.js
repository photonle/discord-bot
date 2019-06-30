const Command = require('discord.js-commando').Command

module.exports = class SupportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'feature',
			group: 'util',
			memberName: 'feature',
			description: 'Request a feature.'
		})
	}

	/**
	 * @param {CommandMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){return msg.say(`Looks like you've suggested a good idea! Head over to <https://github.com/photonle/Photon/issues/new?labels=enhancement&template=feature-request.md> and post a feature request.`)}
}