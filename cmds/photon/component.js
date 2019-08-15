const SQL = require('sql-template-strings')
const Command = require("../sqlcommand")

module.exports = class ComponentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'component',
			group: 'util',
			memberName: 'component',
			description: 'Search for component names used in photon addons.',
			args: [{
				key: 'path',
				label: 'Component Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for \`${args.path.replace(/`/, '\`')}\` in addons.`)

		args.path = `%${args.path}%`
		console.log(SQL`SELECT cname as path, COUNT(*) as count FROM components WHERE cname LIKE ${args.path} GROUP BY cname`)
		let matches = await this.query(SQL`SELECT cname as path, COUNT(*) as count FROM components WHERE cname LIKE ${args.path} GROUP BY cname`)
		if (matches.length === 0){
			return (await reply).edit("I haven't seen that component name before.")
		} else {
			matches = matches.map(x => `\`${x.path.replace(/`/, '\\`')}\` has been used in ${x.count} ${x.count === 1 ? 'addon' : 'addons'} that I've seen.`).join("\n\n")
			if (matches.length > 1800){
				return (await reply).edit("Please be more specific.")
			} else {
				return (await reply).edit(matches)
			}
		}
	}
}

async function main(){db = await sqlite.open("/app/photon.read.db")}
main()