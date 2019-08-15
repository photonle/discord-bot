const Command = require("./sqlcommand")
const faktory = require("faktory-worker")

module.exports = class SQLFaktoryCommand extends Command {
	async queue(job, data = {}){
		let client = await faktory.connect()
		await client.job(job, data).push()
		await client.close()
	}
}