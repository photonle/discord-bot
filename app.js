// 3rd Party
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")
const {Client, Intents, Permissions} = require("discord.js")
const {Collection} = require("discord.js")
const SQLite = require("better-sqlite3")
const {migrate} = require("@blackglory/better-sqlite3-migrations")

// 1st Party
const filepath = require("path")
const fs = require("fs").promises

// Local Files
const pkg = require("./package")

// Destructuring
const Intent = Intents.FLAGS
const Permission = Permissions.FLAGS

// Environment
const OWNER = (process.env.OWNER || "239031520587808769").split(",").map(str => str.trim())
const {DISCORD_GUILD: GUILD, DISCORD_TOKEN: TOKEN, DISCORD_CLIENT_ID: CLIENT, SQLITE_PATH: SQLITE} = process.env

const client = new Client({
	intents: [Intent.DIRECT_MESSAGES]
})

client.commands = new Collection()
client.database = new SQLite(SQLITE)

async function setupCommands(){
	const files = (await fs.readdir(filepath.join(__dirname, "commands"))).filter(file => file.endsWith(".js"))
	for (const file of files){
		console.log(`registering ${file}`)
		const cmd = require(`./commands/${file}`)
		client.commands.set(cmd.data.name, cmd)
	}
}

async function runMigrations(db){
	let migrations = (await fs.readdir(filepath.join(__dirname, "migrations"))).filter(file => file.endsWith(".js")).map(path => require("./" + filepath.join(".", "migrations", path)))
	return migrate(db, migrations)
}

async function registerCommands(client){
	const rest = (new REST({version: 9})).setToken(TOKEN)

	let cmds = []
	for (let cmd of client.commands.values()){
		cmds.push(cmd.data.toJSON())
	}

	console.log("updating guild commands")
	try {
		await rest.put(
			Routes.applicationGuildCommands(CLIENT, GUILD),
			{body: cmds},
		)
	} catch (e){
		console.error(e);
	}
}

client.on('ready', async () => {
	console.log("login complete")

	let invite = await client.generateInvite({
		scopes: ["applications.commands", "bot"],
		permissions: Permission.SEND_MESSAGES
	})
	console.log(invite)

	client.user.setPresence({
		status: "online",
		afk: false,
		game: {
			name: "with ions.",
			url: "https://photon.lighting",
			type: "PLAYING"
		}
	})
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()){
		return;
	}

	const {commandName, options: opts} = interaction
	if (!client.commands.has(commandName)){
		return
	}

	try {
		let cmd = client.commands.get(commandName)
		let callback = cmd.execute
		const callbacks = cmd.callbacks

		let subGroup = opts.getSubcommandGroup(false)
		let subCmd = opts.getSubcommand(false)

		if (subGroup !== null && subCmd !== null && callbacks[subGroup] !== undefined && callbacks[subGroup][subCmd] !== undefined){
			callback = callbacks[subGroup][subCmd]
		} else if (subGroup == null && subCmd !== null && callbacks[subCmd] !== undefined){
			callback = callbacks[subCmd]
		}

		if (callback === undefined){
			let cmdName = [cmd, subGroup, subCmd].filter(Boolean).join(".")
			return interaction.reply({content: `${cmdName} is missing a callback.`, ephemeral: true})
		}

		return callback(interaction)
	} catch (e){
		console.error(e)
		return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
	}
})

client.on("commandError", (cmd, err, msg) => {
	console.error(err)
})

async function main(){
	await runMigrations(client.database)
	await setupCommands()
	await client.login(TOKEN)
	await registerCommands(client)
}

process.on('uncaughtException', (e) => {console.error(e); process.exit(1)})
process.on('unhandledRejection', (e) => {console.error(e)})

process.on('SIGTERM', async () => {
	console.log("Recieved SIGTERM, hanging up.")
	await client.destroy()
	process.exit(0)
})

main()
