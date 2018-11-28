// Config Files
const pkg = require("../package.json");

var DiscordUtils = function(client){
	this.client = client;
	this.startTime = Date.now();

	this.getClientsFromName = function(name, guild){
		if (!name){return false;}
		if (typeof name !== "string"){return false;}
		if (!guild){return false;}

		const matching = guild.members.filter(function(m){return m.user.username.toLowerCase().indexOf(name.toLowerCase()) !== -1;});
		if (matching.array().length < 1){return false;}

		return matching;
	};
	this.getClientsFromNames = function(names, guild){
		if (!names){return false;}
		if (!guild){return false;}

		var matching = [];
		names.forEach(function(v){
			var out = this.getClientsFromName(v, guild);
			if (out){
				matching.push(out)
			}
		}.bind(this));

		matching = matching.reduce(function(t, v){return t.concat(v)});
		return matching;
	};

	this.splitString = function(inStr){
		var outArr = [];
		var nextStr = "";
		if (inStr.length <= 1800){return [inStr];}
		console.log(inStr);

		if (inStr.length > 1800){
			while (inStr.trim() !== "") {
				var endIndexSpace = inStr.indexOf(" ");
				var endIndexNewLine = inStr.indexOf("\n");
				var endIndex;
				if (endIndexSpace === -1 && endIndexNewLine !== -1){endIndex = endIndexNewLine;}
				else if (endIndexSpace !== -1 && endIndexNewLine === -1){endIndex = endIndexSpace;}
				else {endIndex = Math.min(endIndexSpace, endIndexNewLine);}

				if (endIndex > 1800 || endIndex === -1) {
					var endStr = inStr.substring(0, 1800);
					if (nextStr !== "") {
						if (endStr.length + nextStr.length < 1800) {
							outArr.push(nextStr + endStr);
							nextStr = "";
							inStr = inStr.substring(1800)
						} else {
							outArr.push(nextStr);
							nextStr = "";
							outArr.push(inStr.substring(0, 1800));
							inStr = inStr.substring(1800)
						}
					} else {
						outArr.push(inStr.substring(0, 1800));
						inStr = inStr.substring(1800)
					}
				} else {
					var tmp = inStr.substring(0, endIndex + 1);
					if (tmp.length + nextStr.length > 1800) {
						console.log("mid", nextStr, tmp);
						outArr.push(nextStr);
						nextStr = tmp;
					} else {
						nextStr += tmp;
					}
					inStr = inStr.substring(endIndex + 1)
				}
			}
		}
		if (nextStr !== ""){outArr.push(nextStr)}

		return outArr;
	};

	this.sendMsgArr = function(channel, inArr){
		if (inArr.length >= 1){
			return channel.send(inArr[0]).then(function(){
				return this.sendMsgArr(channel, inArr.slice(1))
			}.bind(this));
		}
	};

	this.timeDiff = function(stamp1, stamp2, strict){
		if (strict === undefined){strict = false}
		var ago = (stamp1 - stamp2) < 0;
		var strictSuffix = strict && ago ? " ago" : "";

		var suf, sec, secs, min, mins, hour, hours, day, days, month, months, year, years;
		var ms = Math.floor(Math.abs(stamp1 - stamp2));
		if (ms < 1000){
			suf = (ms === 1 ? " milisecond" : " miliseconds");
			return ms + suf + strictSuffix
		}

		sec = Math.floor(ms / 1000);
		if (sec < 60){
			suf = (sec === 1 ? " second" : " seconds");
			return sec + suf + strictSuffix
		}

		if (sec < 3600){
			min = Math.floor(sec / 60);
			sec = sec - (min * 60);
			mins = (min === 1 ? " minute" : " minutes");
			secs = (sec === 1 ? " second" : " seconds");
			return min + mins + ", " + sec + secs + strictSuffix
		}

		// 1 cay.
		if (sec < 86400){
			min = Math.floor(sec / 60);
			hour = Math.floor(min / 60);
			min = min - (hour * 60);
			hours = (hour === 1 ? " hour" : " hours");
			mins = (min === 1 ? " minute" : " minutes");
			return hour + hours + ", " + min + mins + strictSuffix
		}

		// 30.4 days.
		if (sec < 2626560){
			min = Math.floor(sec / 60);
			hour = Math.floor(min / 60);
			min = min - (hour * 60);
			day = Math.floor(hour / 24);
			hour = hour - (day * 24);
			days = (day === 1 ? " day" : " days");
			hours = (hour === 1 ? " hour" : " hours");
			return day + days + ", " + hour + hours + strictSuffix
		}

		// 365 days.
		if (sec < 31536000){
			min = Math.floor(sec / 60);
			hour = Math.floor(min / 60);
			day = Math.floor(hour / 24);
			hour = hour - (day * 24);
			month = Math.floor(day / 30.4);
			day = day - (month * 30.4);
			months = (month === 1 ? " month" : " months");
			days = (day === 1 ? " day" : " days");
			hours = (hour === 1 ? " hour" : " hours");
			return month + months + ", " + day + days + ", " + hour + hours + strictSuffix
		}

		// Otherwise
		min = Math.floor(sec / 60);
		hour = Math.floor(min / 60);
		day = Math.floor(hour / 24);
		hour = hour - (day * 24);
		month = Math.floor(day / 30.4);
		day = day - (month * 30.4);
		year = Math.floor(month / 12);
		month = month - (year * 12);
		years = (year === 1 ? " year" : " years");
		months = (month === 1 ? " month" : " months");
		days = (day === 1 ? " day" : " days");
		hours = (hour === 1 ? " hour" : " hours");
		return year + years + ", " + month + months + ", " + day + days + ", " + hour + hours + strictSuffix;
	};

	this.getSenderTag = function(message){return "<@" + message.author.id + ">";};
	this.getChannelTag = function(message){return "<#" + message.channel.id + ">";};
	this.getDebugInfo = function(){
		return [pkg.version, this.timeDiff(Date.now(), this.startTime), Math.round(this.client.ping).toString() + "ms"];
	};

	this.getLogArgs = function(cmd, args){
		return "`" + cmd + "`" + args.reduce(function(tot, value){return tot + "`" + value + "` ";}, " ").slice(0, -1)
	};

	this.processTimeString = function(inStr){
		var mins = 0;
		var codeRE = /[hdwmy]/g;

		var code;
		while ((code = codeRE.exec(inStr)) !== null){
			var num = parseFloat(inStr.slice(0, codeRE.lastIndex));
			var multi = 1;
			switch (code[0]){
				case 'h': multi = 60; break;
				case 'd': multi = 1440; break;
				case 'w': multi = 10080; break;
				case 'm': multi = 43830; break;
				case 'y': multi = 525960; break;
				default: multi = 1;
			}

			mins += (num * multi);
			inStr = inStr.slice(codeRE.lastIndex + 1).trim();
			codeRE.lastIndex = 0
		}

		if (inStr !== ""){mins += parseFloat(inStr)}

		return mins;
	}
};

exports.DiscordUtils = DiscordUtils;