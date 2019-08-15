const Command = require("discord.js-commando").Command
const SQLStatement = require("sql-template-strings").SQLStatement
const pool = require('../libs/sql.js')

module.exports = class SQLCommand extends Command {
	async query(query, data = {}){
		let rows

		if (query instanceof SQLStatement){
			[rows] = await pool.query(query)
			return rows
		}

		[rows] = await pool.query(query, data)
		return rows
	}
}