const Command = require("discord.js-commando").Command

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			group: 'util',
			memberName: 'search',
			description: 'Search up a query for a person.',
			clientPermissions: [],
			args: [
				{
					key: 'term',
					label: 'Search Term',
					prompt: 'The item to search for.',
					type: 'string',
					default: '^',
					max: 200
				},
			]
		})
		this.url = "https://lmgtfy.com/?q="
	}

	/**
	 * @param {CommandMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @param {boolean} _ If the incoming message is from a pattern match.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args, _){
		if (args.term === '^'){
			let msgs = await msg.channel.fetchMessages({limit: 1, before: msg.id})
			args.term = msgs.first().content
		}

		let query = encodeURI(args.term.toString())
		return msg.reply(`<${this.url}${query}>`)
	}
}