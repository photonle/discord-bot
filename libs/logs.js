class Logger {
	constructor(){
		this.ready = false
		this.stack = []
	}

	onReady(){
		this.log("Logger Loaded.")

		this.log("Clearing Backlog.")
		this.clearStack()
		this.log("Cleared Backlog.")

		this.flush()
	}

	log(msg){
		if (!this.ready){
			this.stack.push(["log", msg])
			return false
		}

		return true
	}

	warn(msg){
		if (!this.ready){
			this.stack.push(["warn", msg])
			return false
		}

		return true
	}

	error(msg){
		if (!this.ready){
			this.stack.push(["error", msg])
			return false
		}

		return true
	}

	clearStack(){
		for (let index in this.stack){
			let next = this.stack[index]
			this[next[0]](next[1])
		}
	}

	flush(){}
}

const fs = require("fs")
class TextLogger extends Logger {
	constructor(logpath){
		super()

		this.path = logpath

		fs.stat(this.path, (err, stat) => {
			if (err && err.code === 'ENOENT'){
				fs.mkdir(this.path, (err) => {
					if (err){throw err}
					this.ready = true
				})
			}

			if (stat.isDirectory()){
				let curdate = new Date()
				let logname = `${this.path}/log-${curdate.getFullYear()}-${curdate.getMonth() + 1}-${curdate.getDate()}.log`

				this.loghandler = fs.createWriteStream(logname, {flags: "a"})
				this.ready = true
				this.onReady()
			} else {
				throw new TypeError("./discord-logs is present but not a directory.")
			}
		})
	}

	log(msg){
		let ready = super.log(msg)
		if (ready){
			this.loghandler.write(`[LOG] ${msg}\n`)
		}
		this.flush()
	}

	warn(msg){
		let ready = super.warn(msg)
		if (ready){
			this.loghandler.write(`[WARNING] ${msg}\n`)
		}
		this.flush()
	}

	error(msg){
		let ready = super.error(msg)
		if (ready){
			this.loghandler.write(`[ERROR] ${msg}\n`)
		}
		this.flush()
	}
}

module.exports = new TextLogger("/app/bot-logs")

// console.log = function(...rest){
// 	for (let line of rest){
// 		module.exports.log(line.toString())
// 	}
// }
// console.warn = function(...rest){
// 	for (let line of rest){
// 		module.exports.warn(line.toString())
// 	}
// }
//
// console.error = function(...rest){
// 	for (let line of rest){
// 		module.exports.error(line.toString())
// 	}
// }