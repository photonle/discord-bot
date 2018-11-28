// First Party Libraries
const fs = require("fs");

var CommandLibs = function(client){
	this.client = client;
	this.commands = {};
	this.alias = {};
	this.aliasLookup = {};

	this.processInputString = function(str){
		var outArray = [];

		// Extract the command, with ! or / prefix.
		const cmdRegex = /^([!/])([\w-]*)/g;
		m = cmdRegex.exec(str);
		if (m !== null){
			outArray.push(m[2]);
		} else {
			return false;
		}

		// Get rid of the command.
		str = str.replace(cmdRegex, "").trim();
		var inQuote, i = false;
		var start, end = -1;

		// Then grab the args (space or quote delimited)
		for (i = 0; i < str.length; i++){
			var char = str.substring(i, i+1);
			if (char === "\"" && !inQuote){
				var nextStr = str.slice(start + 1, i);
				if (nextStr !== "") {
					outArray.push(nextStr);
				}
				inQuote = true;
				start = i;
			}else if (char === "\"" && inQuote){
				inQuote = false;
				outArray.push(str.slice(start + 1, i));
				end = i;
				start = end;
			}

			if (char === " " && !inQuote && start === 0){
				start = i;
			}else if (char === " " && !inQuote && start !== -1){
				outArray.push(str.slice(start + 1, i));
				end = i;
				start = end;
			}
		}
		var last = str.slice(end + (end === 0 ? 0 : 1));
		if (last !== ""){
			outArray.push(last);
		}
		outArray = outArray.filter(function(v){return v.trim() !== ""}).map(function(v){return v.trim()});
		return outArray;
	};

	this.hasAccess = function (usr, access){return usr.hasPermission(access)};
	this.hasAccesses = function(usr, accesses){
		accesses.forEach(function(access){
			if (!this.hasAccess(usr, access)){
				return false;
			}
		}, this);
		return true;
	};

	const files = fs.readdirSync("./commands", {"encoding": "utf8"});
	const filesM = files.length;
	for (var i = 0; i < filesM; i++){
		var file = files[i];
		var cmd = require("../commands/" + file);

		if (cmd.onLoad){cmd.onLoad(this.client, cmd)}
		cmd.args = typeof cmd.args !== "undefined" ? cmd.args : 0;
		cmd.enabled = typeof cmd.enabled !== "undefined" ? cmd.enabled : true;
		cmd.description = (typeof cmd.description !== "undefined" && cmd.description !== "") ? cmd.description : "A command without a description.";
		cmd.help = (typeof cmd.help !== "undefined" && cmd.help !== "") ? cmd.help : ("!" + cmd.name + " " + ("[arg]".repeat(cmd.args)));

		this.commands[cmd.name.toLowerCase()] = cmd;
		if (cmd.alias){
			this.alias[cmd.alias.toLowerCase()] = cmd.name.toLowerCase();
			this.aliasLookup[cmd.name.toLowerCase()] = cmd.alias.toLowerCase();
		}
	}

	this.getCommand = function(name){
		name = name.toLowerCase();
		if (this.commands[name] && this.commands[name].enabled){
			return this.commands[name];
		}
		if (this.alias[name] && this.commands[this.alias[name]] && this.commands[this.alias[name]].enabled){
			return this.commands[this.alias[name]];
		}
		return false
	}
};

exports.CommandLibs = CommandLibs;