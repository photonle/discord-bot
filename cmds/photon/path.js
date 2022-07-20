const Command = require("../reportcommand")

module.exports = class PathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'path-details',
			group: 'photon',
			memberName: 'path',
			description: 'Gives detailed information on a single file path.',
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
	}
}