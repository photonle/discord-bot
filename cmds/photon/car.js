const Command = require("../findercommand")

module.exports = class CarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'car',
			group: 'photon',
			memberName: 'car',
			description: 'Search for vehicle names used in photon addons.',
			args: [{
				key: 'path',
				label: 'Vehicle Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})
	}
}