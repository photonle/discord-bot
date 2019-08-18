const Command = require("../reportcommand")

module.exports = class CarsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cars',
			group: 'photon',
			memberName: 'cars',
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