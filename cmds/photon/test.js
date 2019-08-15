const SQL = require('sql-template-strings')
const Command = require("../findercommand.js")

module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'test',
			group: 'util',
			memberName: 'test',
			description: 'Search for vehicle names used in photon addons.',
			args: [{
				key: 'path',
				label: 'Vehicle Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})

		this.queryTable = "cars"
		this.queryType = "vehicle"
		this.finderType = "name"
		this.finderName = "cname"
	}
}