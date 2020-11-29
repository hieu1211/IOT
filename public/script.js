var fs = require('fs');
let db = JSON.parse(fs.readFileSync('db.json'))

console.log("db"+db)