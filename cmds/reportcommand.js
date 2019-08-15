const SQL = require('sql-template-strings')
const Command = require("./findercommand")
const Embed = require("discord.js").RichEmbed

module.exports = class ReportCommand extends Command {
	constructor(client, data) {
		super(client, data)

		this.queryTable = "cars"
		this.queryType = "vehicle"
		this.finderType = "name"
		this.finderName = "cname"
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for ${this.queryType} ${this.finderType} \`${args.path.replace(/`/, '\`')}\` in addons.`)
		let matches = await this.query(this.generateFinderQuery(args.path))
		if (matches.length === 0){
			return (await reply).edit(`I haven't seen that ${this.queryType} ${this.finderType} before.`)
		}
		let match = matches[0]

		match = {
			path: x.path,
			data: this.query(
				SQL`SELECT `
					.append(this.finderName)
					.append(" path, name, sid, sname FROM ")
					.append(this.queryTable)
					.append(" INNER JOIN addons ON ")
					.append(this.queryTable)
					.append(".owner = addons.wsid INNER JOIN authors ON addons.author = authors.sid WHERE ")
					.append(this.finderName)
					.append(SQL` = ${x.path}`)
			)
		}

		let i = 1
		let embed = new Embed()
		embed.setTitle(`Vehicle Report: ${match.path}`);

		(await match.data).map(addon => {
			embed.addField(
				`Addon ${i++}`,
				`[${addon.name.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/sharedfiles/filedetails/?id=${addon.owner}) by [${addon.sname.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/profiles/${addon.sid})`
			)
		})

		return (await reply).edit(embed)
	}

	generateFinderQuery(path){
		return SQL`SELECT `
			.append(this.finderName)
			.append(" path, COUNT(*) count FROM ")
			.append(this.queryTable)
			.append(" WHERE ")
			.append(this.finderName)
			.append(" = ")
			.append(SQL`${path}`)
	}
}