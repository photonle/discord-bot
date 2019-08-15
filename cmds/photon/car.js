const SQL = require('sql-template-strings')
const Command = require("../sqlcommand")

module.exports = class CarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'car',
			group: 'util',
			memberName: 'car',
			description: 'Search for vehicle names used in photon addons.',
			args: [{
				key: 'path',
				label: 'Vehicle Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for \`${args.path.replace(/`/, '\`')}\` in addons.`)

		args.path = `%${args.path}%`
		let matches = await this.query(SQL`SELECT cname as path, COUNT(*) as count FROM cars WHERE cname LIKE ${args.path} GROUP BY cname`)
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