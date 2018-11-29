// const Command = require('discord.js-commando').Command;
//
// module.exports = class TestCommand extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'test',
// 			group: 'debug',
// 			memberName: 'test',
// 			description: 'Tests provided input',
//
// 			args: [{
// 					key: 'time',
// 					label: 'Timestring',
// 					prompt: 'Testing Input.',
// 					type: 'timestring'
// 				}]
// 		});
// 	}
//
// 	async run(msg, args){return msg.reply(args.time)}
// };