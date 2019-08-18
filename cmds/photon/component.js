const Command = require("../findercommand")

module.exports = class ComponentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'component',
			group: 'photon',
			memberName: 'component',
			description: 'Search for component names used in photon addons.',
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