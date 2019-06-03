const sqlite = require("sqlite")
let db
const SQL = require('sql-template-strings')
const Command = require("discord.js-commando").Command
const Embed = require('discord.js').RichEmbed

module.exports = class PathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'paths',
			group: 'util',
			memberName: 'paths',
			description: 'Advanced search for lua paths used in photon addons.',
			args: [{
				key: 'path',
				label: 'Search Path',
				prompt: 'Enter the path to search.',
				type: 'string',
			}]
		})
	}

	async run(msg, args, _){
		let matches = []
		args.path = args.path.replace(/\//, '\\')
		msg.say(`Searching for ${args.path.replace(/\\/g, '/')} in addons.`)
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

		matches = await Promise.all(matches.map(async x => {return {path: x.path, data: await db.all(SQL`SELECT path, owner, name, sid, sname FROM files INNER JOIN addons on files.owner = addons.wsid INNER JOIN authors ON addons.author = authors.sid WHERE path = ${x.path}`)}}))
		// matches = matches.map(x => {x.path = x.path.replace(/\\/g, '/'); return x})
		msg.say(`${matches[0].data}`)
		matches = matches.map(x => {
			let y = new Embed()
			let i = 1
			y.setAuthor(x.path.replace(/\\/g, '/'))
			for (let addon of x.data){
				y.addField(`Addon ${i++}`, `[${addon.name.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/sharedfiles/filedetails/?id=${addon.owner}) by [${addon.sname.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/profiles/${addon.sid})`)
			}
			return y
		})
		return Promise.all(matches.map(x => msg.say(x)))
		// msg.say(`${matches[0].path}: ${matches[0].data}`)
	}
}

async function main(){db = await sqlite.open("/app/photon.read.db")}
main()