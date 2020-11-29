var fs = require('fs');
data = {P1:false}
		let db = JSON.parse(fs.readFileSync('db.json'))
		db = {...db,...data}
		fs.writeFile('db.json', JSON.stringify(db), function (err) {
		  if (err) throw err;
		});