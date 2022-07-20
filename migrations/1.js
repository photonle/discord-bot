class Migration {
	version = 1
	up = "CREATE TABLE \"addons\" ( `wsid` NUMERIC, `name` TEXT, `author` NUMERIC, PRIMARY KEY(`wsid`) );\n" +
		"CREATE TABLE \"authors\" ( `sid` NUMERIC, `sname` TEXT, PRIMARY KEY(`sid`) );\n" +
		"CREATE TABLE \"files\" ( `path` TEXT, `owner` NUMERIC );\n" +
		"CREATE TABLE \"components\" ( `cname` TEXT, `owner` NUMERIC );\n" +
		"CREATE TABLE \"cars\" ( `cname` TEXT, `owner` NUMERIC );\n" +
		"CREATE TABLE \"errors\" ( `path` TEXT, `error` TEXT, `owner` NUMERIC );"
	down = "DROP TABLE \"addons\"; DROP TABLE \"authors\"; DROP TABLE \"files\"; DROP TABLE \"components\"; DROP TABLE \"cars\"; DROP TABLE \"errors\";"
}

module.exports = new Migration()
