const SQL = require('sql-template-strings')
const Command = require("./findercommand")
const Embed = require("discord.js").MessageEmbed

module.exports = class ReportCommand extends Command {
	constructor(client, data) {
		super(client, data)

		this.queryTable = "cars"
		this.queryType = "vehicle"
		this.finderType = "name"
		this.finderName = "cname"
		this.reportTitle = "Vehicle"
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for ${this.queryType} ${this.finderType} \`${args.path.replace(/`/, '\`')}\` in addons.`)
		let matches = await this.query(this.generateFinderQuery(args.path))
		let match = matches[0]
		if (match.count === 0){
			return (await reply).edit(`I haven't seen that ${this.queryType} ${this.finderType} before.`)
		}

		match = {
			path: match.path,
			data: this.query(
				SQL`SELECT `
					.append(this.finderName)
					.append(" path, name, sid, sname, owner FROM ")
					.append(this.queryTable)
					.append(" INNER JOIN addons ON ")
					.append(this.queryTable)
					.append(".owner = addons.wsid INNER JOIN authors ON addons.author = authors.sid WHERE ")
					.append(this.finderName)
					.append(SQL` = ${match.path}`)
			)
		}

		let i = 1
		let embed = new Embed()
		embed.setTitle(`${this.reportTitle} Report: ${match.path}`);

		(await match.data).map(addon => {
			embed.addField(
				`Addon ${i++}`,
				`[${addon.name.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/sharedfiles/filedetails/?id=${addon.owner}) by [${addon.sname.replace(/([\[\]])/g, '\$1')}](https://steamcommunity.com/profiles/${addon.sid})`
			)
		})

		return (await reply).edit(embed)
	}

	generateFinderQuery(path){
		let query = SQL`SELECT `
			.append(this.finderName)

		if (this.finderName !== "path"){
			query = query.append(" path")
		}

		query.append(", COUNT(*) count FROM ")
			.append(this.queryTable)
			.append(" WHERE ")
			.append(this.finderName)
			.append(" = ")
			.append(SQL`${path}`)

		console.log(query.sql)
		return query
	}
}