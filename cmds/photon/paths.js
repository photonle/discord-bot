const Command = require("../findercommand")

module.exports = class PathsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'path-search',
			group: 'photon',
			memberName: 'paths',
			description: 'Search for lua files used in photon addons, and returns a list of paths.',
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