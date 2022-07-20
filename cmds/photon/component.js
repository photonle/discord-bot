const Command = require("../reportcommand")

module.exports = class ComponentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'component-details',
			group: 'photon',
			memberName: 'component',
			description: 'Gives detailed information on a single component.',
			args: [{
				key: 'path',
				label: 'Component Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})

		this.queryTable = "components"
		this.queryType = "component"
		this.finderType = "name"
		this.finderName = "cname"
	}
}