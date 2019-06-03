const sqlite = require("sqlite")
let db
const SQL = require('sql-template-strings')
const Command = require("discord.js-commando").Command

module.exports = class PathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'path',
			group: 'util',
			memberName: 'path',
			description: 'Search for lua paths used in photon addons.',
			args: [{
				key: 'path',
				label: 'Search Path',
				prompt: 'Enter the path to search.',
				type: 'string',
			}]
		})
	}

	async run(msg, args, _){
		args.path = args.path.replace(/\//, '\\')
		msg.say(`Searching for ${args.path.replace(/\\/g, '/')} in addons.`)

		let matches = []
		if (args.path.startsWith("lua")){
			// Full Path
			matches = await db.all(SQL`SELECT path, COUNT(*) as count FROM files WHERE path = ${args.path} GROUP BY path`)
		} else if (args.path.endsWith(".lua")){
			// End Path
			args.path = `%${args.path}`
			matches = await db.all(SQL`SELECT path, COUNT(*) as count FROM files WHERE path LIKE ${args.path} GROUP BY path`)
		} else {
			// Search
			args.path = `%${args.path}%`
			matches = await db.all(SQL`SELECT path, COUNT(*) as count FROM files WHERE path LIKE ${args.path} GROUP BY path`)
		}

		if (matches.length === 0){
			return msg.say("I haven't seen that path before.")
		} else {
			matches = matches.map(x => {x.path = x.path.replace(/\\/g, '/'); return x})
			return Promise.all(matches.map(x => msg.say(`\`${x.path}\` has been used in ${x.count} ${x.count === 1 ? 'addon' : 'addons'} that I've seen.`)))
		}
	}
}

async function main(){db = await sqlite.open("/app/photon.read.db")}
main()