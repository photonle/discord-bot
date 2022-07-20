const Command = require("../findercommand")

module.exports = class CarsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'car-search',
			group: 'photon',
			memberName: 'cars',
			description: 'Search for vehicle names used in photon addons, and returns a list of vehicle names.',
			args: [{
				key: 'path',
				label: 'Vehicle Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})
	}
}