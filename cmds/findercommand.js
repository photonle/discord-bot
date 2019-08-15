const SQL = require('sql-template-strings')
const Command = require("./sqlcommand.js")

function SQLS(str){
	return SQL([str])
}

module.exports = class FinderCommand extends Command {
	constructor(client, data) {
		super(client, data)

		this.queryTable = "cars"
		this.queryType = "vehicle"
		this.finderType = "name"
		this.finderName = "cname"
	}

	async run(msg, args, _){
		let reply = msg.say(`Searching for ${this.queryTable} ${this.finderType} \`${args.path.replace(/`/, '\`')}\` in addons.`)

		let query = SQL`SELECT `
			.append(this.finderName)
			.append(" path, COUNT(*) count FROM ")
			.append(this.queryTable)
		query = this.generateWhere(query, args.path)
			.append(" GROUP BY ")
			.append(this.finderName)

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

	 generateWhere(query, str){
		if (this.queryTable === "files"){
			if (str.startsWith("lua")){
				return query
					.append(` WHERE ${this.finderName} = `)
					.append(SQL`${str}`)
			}
			return query.append(`WHERE ${this.finderName} LIKE `)
				.append(SQL`${str.endsWith(".lua") ? `%${str}` : `%${str}%`}`)
		} else {
			str = `%${str}%`
			return query
				.append(` WHERE ${this.finderName} LIKE `)
				.append(SQL`${str}`)
		}
	 }
}