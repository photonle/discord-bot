class Migration {
	version = 2
	up = "ALTER TABLE addons RENAME COLUMN lastup TO last_updated;"
	down = "ALTER TABLE addons RENAME COLUMN last_updated TO lastup;"
}

module.exports = new Migration()
