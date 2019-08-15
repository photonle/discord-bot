const Command = require("discord.js-commando").Command
const SQLStatement = require("sql-template-strings")
const pool = require('../libs/sql.js')

module.exports = class SQLCommand extends Command {
	async query(query, data = {}){
		if (query instanceof SQLStatement){
			console.log(query.sql)
			console.log(query.values)
			let [rows, fields] = await pool.query(query.sql, query.values)
			return rows
		}

		let [rows, fields] = await pool.query(query, data)
		return rows
	}
}