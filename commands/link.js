const {SlashCommandBuilder} = require("@discordjs/builders")
const {inspect} = require("util")

let command = new SlashCommandBuilder()
command.setName("link")
	.setDescription("Get a link for reporting bugs, suggestion features, and more.")
	.addSubcommand(command => command
		.setName("bug")
		.setDescription("Get the link to report a bug.")
	)
	.addSubcommand(command => command
		.setName("feature")
		.setDescription("Get the link to request a feature.")
	)
	// .addSubcommand(command => command
	// 	.setName("glua")
	// 	.setDescription("Get the link to the Garry's Mod documentation.")
	// 	.addStringOption(option => option
	// 		.setName("Query")
	// 		.setDescription("Item to search for.")
	// 		.setRequired(false)
	// 	)
	// )
	.addSubcommand(command => command
		.setName("docs")
		.setDescription("Get the link for the Photon documentation.")
	)

module.exports = {
	data: command,
	callbacks: {
		bug(interaction){
			return interaction.reply({content: "Looks like you've found a bug in Photon! Head over to <https://github.com/photonle/Photon/issues/new?labels=bug&template=bug-report.md> and post a bug report."})
		},
		feature(interaction){
			return interaction.reply({content: "That looks like a good idea! Head over to <https://github.com/photonle/Photon/issues/new?labels=feature&template=feature-request.md> and post a feature request!"})
		},
		docs(interaction){
			return interaction.reply({content: "[Photon Developer Documentation](https://photonle.github.io/Photon/)"})
		}
	}
}
