const Command = require("../reportcommand")

module.exports = class CarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'car-details',
			group: 'photon',
			memberName: 'car',
			description: 'Gives detailed information on a single vehicle.',
			args: [{
				key: 'path',
				label: 'Vehicle Name',
				prompt: 'Enter the name to search.',
				type: 'string',
			}]
		})
	}
}