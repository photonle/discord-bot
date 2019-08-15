const SQL = require('sql-template-strings')
const Command = require("../findercommand.js")

module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'test',
			group: 'util',
			memberName: 'test',
			description: 'Search for vehicle names used in photon addons.',
			args: [{
				key: 'path',
				label: 'Vehicle Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})

		this.queryTable = "cars"
		this.queryType = "vehicle"
		this.finderType = "name"
		this.finderName = "cname"
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for ${this.queryTable} ${this.finderType} \`${args.path.replace(/`/, '\`')}\` in addons.`)

		let query = SQL(`SELECT ${this.finderName} path, COUNT(*) count FROM ${this.queryTable}`)
		msg.say("got to generation")
		query = this.generateWhere(query, args.path).append(`GROUP BY ${this.finderName}`)

		msg.say("got to query")
		let matches = await this.query(query)
		if (matches.length === 0){
			return (await reply).edit("I haven't seen that vehicle name before.")
		} else {
			matches = matches.map(x => `\`${x.path.replace(/`/, '\\`')}\` has been used in ${x.count} ${x.count === 1 ? 'addon' : 'addons'} that I've seen.`).join("\n\n")
			if (matches.length > 1800){
				return (await reply).edit("Please be more specific.")
			} else {
				return (await reply).edit(`${matches}\n\nTo see which addons a vehicle is used in, run !${this.name}s {component}`)
			}
		}
	}
}