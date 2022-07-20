const Command = require("discord.js-commando").Command
const RichEmbed = require("discord.js").RichEmbed

module.exports = class GLuaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'glua',
			group: 'util',
			memberName: 'glua',
			description: 'Search the GMod Lua Docs.',
			args: [{
				key: 'term',
				label: 'Search Term',
				prompt: 'Search Term',
				type: 'string',
			},{
				key: 'pos',
				label: 'Selector',
				prompt: 'Selector',
				type: 'integer',
				default: 0
			}]
		})
	}

	/**
	 * @param {CommandoMessage} msg The incoming message.
	 * @param {Object|string|Array<string>} args The command arguments.
	 * @returns {Promise<Message>}
	 */
	async run(msg, args){
		if (!this.dataTable){return msg.reply("this command hasn't loaded yet.")}

		let matches = filter_matches(this.dataTable, args.term.toLowerCase())
		if (matches.length === 0){return msg.reply("there are no matching articles.")}
		if (matches.length === 1){args.pos = 1}

		if (args.pos === 0){
			let reply = build_upto(matches, function(table, index){return `${index + 1}: ${table[index].title}`}, 1500)
			if (reply){
				return msg.say(`${reply}`)
			} else {
				return msg.reply(`there are ${matches.length} matching articles. Please narrow your search.`)
			}
		} else if (args.pos > matches.length) {
			return msg.reply(`${args.pos} is out of range for your search, the maximum is ${matches.length}`)
		} else {
			return msg.say("", build_rich(matches[args.pos - 1]))
		}
	}
}

function filter_matches(table, title){return table.filter((v) => {return v.title.toLowerCase().indexOf(title) > -1})}
function build_upto(table, rowFunc, upto){
	let out = ""
	let index = 0

	do {
		out += rowFunc(table, index) + "\n"
		index++
	} while (out.length < upto && index < table.length)

	if (index >= table.length){
		return out
	} else {
		return false
	}
}

const html_ents = {
	"&quot;": "\"",
	"&apos;": "'"
}

function proc_html_ents(html){
	for (let ent in html_ents){html = html.replace(new RegExp(ent, 'g'), html_ents[ent])}
	return html
}

const state_cols = {
	server: [52, 152, 219],
	shared: [191, 34, 230],
	client: [211, 84, 0],
	menu: [39, 174, 96]
}
function build_rich(row){
	const regex_header = /<div class="function_line">([\s\S]*?)<\/div>/g
	const regex_deprec = /<div class="deprecatedfunc">/g

	const regex_arg = /<div class="argument">([\s\S]*?)<\/div>[\s]<\/div>/g
	const regex_arg_type = /<a(.*?)>(.*?)<\/a>/g
	const regex_arg_name = /a> (.*?)(=(.*?))?<\/span>/g
	const regex_arg_desc = /<div style="margin-left: 32px;">(.*)/g

	const regex_func = /a> (.*?)[,<]/g
	const regex_class = /<a(.*?)>(.*?)<\/a>/g
	const regex_desc = /id="Description">[\s\S]*?1>\s<p>([\s\S]*?)<\/p>|class="deprecatedfunc">[\s\S]*?<br>[\s\S]*?<br><br>([\s\S]*?)<h1/g

	let html = row.html

	let res = regex_header.exec(html)
	let header = res[1]
	header = header.split("</span>")
	header.shift()
	header = header.join("</span>")
	let deprecated = regex_deprec.exec(html) ? "This function is deprecated and may be removed in a future version." : ""

	let func_name = header.slice(0, header.indexOf("(")) + "("
	let func_url = `https://samuelmaddock.github.io/glua-docs/#?q=${func_name.slice(0, -1).replace(":", ".")}`

	let func_name_test, func_arg_name, func_class
	let arg_num = 0

	func_name_test = regex_func.exec(header)
	while (func_name_test !== null){
		func_class = regex_class.exec(header)[2]
		func_arg_name = func_name_test[1]
		func_name += `*${func_class}* ${func_arg_name}, `
		arg_num++
		func_name_test = regex_func.exec(header)
	}
	if (arg_num !== 0){func_name = func_name .slice(0, -2)}
	func_name += ")"

	let desc = ""
	let desc_out = regex_desc.exec(html)
	let desc_str = desc_out [1] !== undefined ? desc_out[1] : (desc_out[2] !== undefined ? desc_out [2].replace(/<\/div> /g, "\n\n") : 'None Found')
	desc += "" + desc_str.replace(/<br>/g, "\n").replace(/<a(.*?)>(.*?)<\/a>/g, "$2") + ""

	let args = ""
	let arg_count = 1

	let m = regex_arg.exec(html)
	while (m){
		if (m.index === regex_arg.lastIndex){regex_arg.lastIndex++}
		if (m === null){continue}

		let argType = regex_arg_type.exec(m[1])[2]
		regex_arg_type.lastIndex = 0

		let argName = regex_arg_name.exec(m[1])[1]
		regex_arg_name.lastIndex = 0

		let argDefault = regex_arg_name.exec(m[1])[3]
		regex_arg_name.lastIndex = 0

		let argDesc = regex_arg_desc.exec(m[1])[1].replace(/<a(.*?)>(.*?)<\/a>/g, "$2")
		regex_arg_desc.lastIndex = 0

		args += "```"
		args += "Argument " + (arg_count++) + ": " + argName + " (" + argType + ")"
		if (argDefault !== undefined){args += " (default: " + argDefault + ")"}
		args += "\n" + argDesc + "\n\n"
		args += "```"

		m = regex_arg.exec(html)
	}

	let rich = new RichEmbed()
	rich.setAuthor(func_name, "", row.url)
	rich.setDescription(proc_html_ents(desc))
	if (deprecated !== ""){
		rich.addField("WARNING", deprecated)
	}
	rich.addField("Lua State", row.scope.toUpperCase(), true)
	if (arg_count === 1){
		rich.addField("Arguments", "None")
	} else {
		rich.addField("Arguments", proc_html_ents(args))
	}
	rich.setFooter(func_url)
	rich.setColor(state_cols[row.scope])
	return rich
}