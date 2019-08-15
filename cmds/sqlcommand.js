const Command = require("discord.js-commando").Command
const pool = require('../libs/sql.js')

module.exports = class SQLCommand extends Command {
	async query(query, data = {}){
		let [rows, fields] = await pool.query(query, data)
		return rows
	}
}