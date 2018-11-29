const Promise = require("promise")
const Command = require("discord.js-commando").Command

module.exports = class PurgeCommand extends Command {
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
		});
	}

	async run(msg, args){
		let url = "https://lmgtfy.com/?q="

		if (args.term === '^'){
			msg.channel.fetchMessages({limit: 1, before: msg.id})
				.then((msgs) => {
					let query = encodeURI(msgs.first().content)
					msg.channel.send(`${msgs.first().author.toString()}, <${url}${query}>`)
				})
		} else {
			let query = encodeURI(args.term.toString())
			msg.reply(`<${url}${query}>`)
		}
	}
};
