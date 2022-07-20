const SQL = require('sql-template-strings')
const Command = require("./sqlcommand.js")

module.exports = class FinderCommand extends Command {
	constructor(client, data) {
		super(client, data)

		this.queryTable = "cars"
		this.queryType = "vehicle"
		this.finderType = "name"
		this.finderName = "cname"
		this.reportName = "detail"
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for ${this.queryType} ${this.finderType} \`${args.path.replace(/`/, '\`')}\` in addons.`)
		let matches = await this.query(this.generateFinderQuery(args.path))
		if (matches.length === 0){
			return (await reply).edit(`I haven't seen that ${this.queryType} ${this.finderType} before.`)
		}

		matches = matches.map(x => `\`${x.path.replace(/`/, '\\`')}\` has been used in ${x.count} ${x.count === 1 ? 'addon' : 'addons'} that I've seen.`).join("\n\n")
		if (matches.length > 1800){
			return (await reply).edit(`\`${args.path.replace(/`/, '\`')}\` matches too many results to display, please be more specific.`)
		}

		return (await reply).edit(`${matches}\n\nTo see which addons a ${this.queryType} is used in, run the details command for {${this.finderType}}`)
	}

	generateFinderQuery(path){
		let query = SQL`SELECT `
			.append(this.finderName)
			.append(" path, COUNT(*) count FROM ")
			.append(this.queryTable)
		return this.generateFinderWhere(query, path)
			.append(" GROUP BY ")
			.append(this.finderName)
	}

	 generateFinderWhere(query, str){
		if (this.queryTable === "files"){
			if (str.startsWith("lua/")){
				return query
					.append(` WHERE ${this.finderName} = `)
					.append(SQL`${str}`)
			}
			return query.append(` WHERE ${this.finderName} LIKE `)
				.append(SQL`${str.endsWith(".lua") ? `%${str}` : `%${str}%`}`)
		} else {
			str = `%${str}%`
			return query
				.append(` WHERE ${this.finderName} LIKE `)
				.append(SQL`${str}`)
		}
	 }
}