const Command = require("../reportcommand")

module.exports = class ComponentsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'components',
			group: 'photon',
			memberName: 'components',
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
		this.reportTitle = "Component"
	}
}