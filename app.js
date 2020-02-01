require('dotenv').config()

const Discord = require("discord.js-commando")
const http = require("https")
const fs = require("fs")

const pkg = require("./package.json")

const client = new Discord.Client({
	owner: ['239031520587808769', '142796643589292032', '191255947648172033', '263541113913212929'],
	commandPrefix: '!',
	disableEveryone: true,
	unknownCommandResponse: false
})
client.logs = require("./libs/logs.js")

client.on('error', client.logs.error)
client.on('warn', client.logs.warn)
client.on('disconnect', () => {client.logs.warn('Disconnected from socket.')})
client.on('reconnecting', () => {client.logs.warn('Reconnecting to discord.')})

client.registry.registerGroups([
	['debug', 'Debugging'],
	['docs', 'Documentation'],
	['misc', 'Miscellaneous'],
	['help', 'Help'],
	['photon', 'PLE Integration']
])
client.registry.registerDefaults()
client.registry.registerCommandsIn(__dirname + "/cmds")

client.on('ready', () => {
	client.generateInvite().then(console.log)
	client.user.setPresence({
		status: "online",
		afk: false,
		game: {
			name: "with ions.",
			url: "https://photon.lighting",
			type: "PLAYING"
		}
	})

	client.logs.log("Loaded Version " + pkg.version)
})

const UNTAGABLE_FULL = 1 // Cannot be tagged by regular people, can tag other bypassed people.
const UNTAGABLE_BYPASS = 2 // Can be tagged and can tag untaggables.

// Untaggable people (CDT).
let untaggable = {
	"142796643589292032": UNTAGABLE_FULL, // Schmal
	"263541113913212929": UNTAGABLE_BYPASS, // Noble
	"191255947648172033": UNTAGABLE_BYPASS, // Super Meaty
	"239031520587808769": UNTAGABLE_BYPASS, // Internet
	"170593095312867328": UNTAGABLE_BYPASS, // Creator
	"303663831274487810": UNTAGABLE_BYPASS, // GermanDude
	"221792879763390468": UNTAGABLE_BYPASS // SGM
}
let tag_restrictions = {
	"479487537006510086": { // Support 1
		// roles: new Set([
		// 	"479485006209613839" // CDT
		// ]),
		// members: new Set(Object.keys(untaggable)),
		warn: true,
		warnbypass: new Set([
			'479485091710631936', // Support
			'552032086828122112', // Moderator
			'481511094725115906', // Dev
			'495848941896859658', // Master
			'479485006209613839', // CDT
			'586262825958375435' // Support Lead
		]),
		message: "Try asking our support team."
	},
	"588412504112103424": { // Support 2
		// roles: new Set([
		// 	"479485006209613839"
		// ]),
		// members: new Set(Object.keys(untaggable)),
		warn: true,
		warnbypass: new Set([
			'479485091710631936', // Support
			'552032086828122112', // Moderator
			'481511094725115906', // Dev
			'495848941896859658', // Master
			'479485006209613839', // CDT
			'586262825958375435' // Support Lead
		]),
		message: "Try asking our support team."
	}
}

new (require('./libs/warner'))(client,'/app/warned', tag_restrictions)
new (require('./libs/tagger'))(client, untaggable, tag_restrictions)

client.on("commandError", (cmd, err, msg) => {
	console.error(err)
})
let cmd = client.registry.commands.get("glua")
if (cmd){cmd.dataTable = require('./libs/glua.json')}

// Log our bot in
client.login(process.env.DISCORD_TOKEN)

process.on('uncaughtException', (e) => {console.error(e); process.exit(1)})
process.on('unhandledRejection', console.error)

process.on('SIGTERM', async () => {
	await client.destroy()
	process.exit(0)
})