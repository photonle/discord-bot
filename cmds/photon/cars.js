const SQL = require('sql-template-strings')
const Command = require("../sqlcommand")
const Embed = require('discord.js').RichEmbed

module.exports = class CarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cars',
			group: 'util',
			memberName: 'cars',
			description: 'Advanced search for vehicle names used in photon addons.',
			args: [{
				key: 'path',
				label: 'Search Path',
				prompt: 'Enter the path to search.',
				type: 'string',
			}]
		})
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for \`${args.path.replace(/`/, '\`')}\` in addons.`)
		let matches = await this.query(SQL`SELECT cname as path, COUNT(*) as count FROM cars WHERE cname = ${args.path} GROUP BY cname`)

		matches = matches.filter(result => result.count > 0)
		if (matches.length === 0){return (await reply).edit("I haven't seen that car name before.")}

		let match = matches[0]
		let data = this.query(SQL`SELECT cname as path, owner, name, CAST(sid AS TEXT) as sid, sname FROM cars INNER JOIN addons on cars.owner = addons.wsid INNER JOIN authors ON addons.author = authors.sid WHERE cname = ${match.path}`)

		let i = 1
		let embed = new Embed()
		embed.setTitle(`Vehicle Report: ${match.path}`);

		(await data).map(addon => {
			embed.addField(
				`Addon ${i++}`,
				`[${addon.name.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/sharedfiles/filedetails/?id=${addon.owner}) by [${addon.sname.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/profiles/${addon.sid})`
			)
		})

		return (await reply).edit(embed)
	}
}