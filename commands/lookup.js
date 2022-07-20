const {SlashCommandBuilder} = require("@discordjs/builders")
const {inspect} = require("util")

let command = new SlashCommandBuilder()
command.setName("lookup")
	.setDescription("Lookup a vehicle or component name from the workshop.")
	.addSubcommandGroup(group => group
		.setName("vehicle")
		.setDescription("Lookup vehicle information from the workshop.")
		.addSubcommand(command => command
			.setName("search")
			.setDescription("Search for components.")
		)
		.addSubcommand(command => command
			.setName("list")
			.setDescription("List components.")
		)
		.addSubcommand(command => command
			.setName("get")
			.setDescription("Get a single component.")
		)
	)
	.addSubcommandGroup(group => group
		.setName("component")
		.setDescription("Lookup component information from the workshop.")
		.addSubcommand(command => command
			.setName("search")
			.setDescription("Search for components.")
		)
		.addSubcommand(command => command
			.setName("list")
			.setDescription("List components.")
		)
		.addSubcommand(command => command
			.setName("get")
			.setDescription("Get a single component.")
		)
	)

module.exports = {
	data: command,
	async execute(interaction){
		let keys = Object.keys(interaction).join("\n") + "\n" + interaction.commandId + "\n" + interaction.commandName + "\n" + inspect(interaction.options)
		await interaction.reply({content: keys.substring(0, 1800), ephemeral: true})
	},
	callbacks: {
		vehicle: {
			async search(interaction){
				await interaction.reply({content: "lookup.vehicle.search", ephemeral: true})
			},
			async list(interaction){
				await interaction.reply({content: "lookup.vehicle.list", ephemeral: true})
			},
			async get(interaction){
				await interaction.reply({content: "lookup.vehicle.get", ephemeral: true})
			}
		}

	}
}
