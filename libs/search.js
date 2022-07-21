const SQL = require("sql-template-strings")

async function paginate(pool, table, fields, where = false, asc = false, limit = 5){
	let query = SQL`SELECT `
		.append(fields.join(", "))
		.append(" FROM ")
		.append(table)
		.append(` INNER JOIN addons a ON ${fields[1]} = a.wsid`)
		.append(` INNER JOIN authors au on a.author = au.sid`)

	if (where){
		query.append(" WHERE ")
		let first = true
		for (let statement of where){
			if (!first){
				query.append(" AND ")
			}

			first = false
			query.append(statement)
		}
	}

	query.append(` ORDER BY ${fields[0]} `)
	query.append(asc ? "ASC" : "DESC")
	query.append(SQL` LIMIT ${limit}`)

	return (await pool.query(query))[0]
}

async function page(pool, table, fields, marker = false, where = false, perPage = 5){
	let markerKey = fields[0]
	let sqlWhere = []
	if (where){
		sqlWhere.push(where)
	}

	sqlWhere.push(SQL``.append(markerKey).append(SQL` < ${marker}`))
	let lastPage = paginate(
		pool,
		table,
		fields,
		sqlWhere,
		false,
		perPage
	)
	sqlWhere.pop()

	sqlWhere.push(SQL``.append(markerKey).append(SQL` >= ${marker}`))
	let nextPage = paginate(
		pool,
		table,
		fields,
		sqlWhere,
		true,
		perPage + 1
	)
	sqlWhere.pop()

	lastPage = await lastPage
	nextPage = await nextPage

	let lastPageKey = false
	if (lastPage.length >= 1){
		lastPageKey = lastPage.pop().vehicle
	}

	let nextPageKey = false
	if (nextPage.length === perPage + 1){
		nextPageKey = nextPage.pop().vehicle
	}

	return {
		nextPage,
		nextPageKey,
		lastPage,
		lastPageKey
	}
}

async function vehiclePage(pool, marker = false, where = false, perPage = 5){
	return page(pool, "vehicles v", [
		"v.vehicle",
		"v.wsid",
		"a.name as addon",
		"au.sid",
		"au.name as author"
	], marker, where)
}

module.exports = {
	vehiclePage
}


