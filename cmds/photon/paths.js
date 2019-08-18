const Command = require("../reportcommand")

module.exports = class PathsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'paths',
			group: 'photon',
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
		this.finderType = "path"
		this.finderName = "path"
		this.reportTitle = "File Path"
	}
}