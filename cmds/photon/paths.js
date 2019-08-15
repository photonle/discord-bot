const Command = require("../reportcommand")

module.exports = class PathsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'paths',
			group: 'util',
			memberName: 'paths',
			description: 'Search for lua files used in photon addons.',
			args: [{
				key: 'path',
				label: 'File Path',
				prompt: 'Enter the path to search.',
				type: 'string',
			}]
		})

		this.queryTable = "files"
		this.queryType = "file"
		this.finderType = "paths"
		this.finderName = "path"
	}
}