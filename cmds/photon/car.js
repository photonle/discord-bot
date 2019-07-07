const sqlite = require("sqlite")
let db
const SQL = require('sql-template-strings')
const Command = require("discord.js-commando").Command

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
		let reply = msg.say(`Searching for ${args.path} in addons.`)

		args.path = `%${args.path}%`
		let matches = await db.all(SQL`SELECT cname as path, COUNT(*) as count FROM cars WHERE cname LIKE ${args.path} GROUP BY cname`)
		if (matches.length === 0){
			return reply.edit("I haven't seen that vehicle name before.")
		} else {
			matches = matches.map(x => `\`${x.path.replace(/`/, '\\`')}\` has been used in ${x.count} ${x.count === 1 ? 'addon' : 'addons'} that I've seen.`).join("\n\n")
			if (matches.length > 1800){
				return reply.edit("Please be more specific.")
			} else {
				return reply.edit(matches)
			}
			// return Promise.all(matches.map(x => msg.say(`\`${x.path.replace(/`/, '\\`')}\` has been used in ${x.count} ${x.count === 1 ? 'addon' : 'addons'} that I've seen.`)))
		}
	}
}

async function main(){db = await sqlite.open("/app/photon.read.db")}
main()