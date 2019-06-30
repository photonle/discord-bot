const Command = require('discord.js-commando').Command

module.exports = class SupportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bug',
			group: 'util',
			memberName: 'bug',
			description: 'Found a bug?'
		})
	}

	/**
	 * @param {CommandMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){return msg.say(`Looks like you've found a bug in Photon! Head over to <https://github.com/photonle/Photon/issues/new?labels=bug&template=bug-report.md> and post a bug report.`)}
}