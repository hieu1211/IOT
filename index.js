var express = require("express")
var app = express()
var port = process.env.PORT || 3000;
var server = app.listen(port,()=>console.log('Server open port 3000'))
var io = require('socket.io')(server);
var fs = require('fs');
app.use(express.static('public'));
app.set('view engine','pug');
app.set('views', './view');
app.get('/',(req,res)=>{
	res.render('layout')
})
lastFire=0;
io.on('connection', function (socket) {
	console.log('client connected '+socket.id);
	data = fs.readFileSync('db.json')
	socket.emit('history',data.toString())
	socket.on('fire-detection',(data)=>{
		socket.broadcast.emit('fire-detection',data)
		let now = new Date()
		if(now.getTime()-lastFire>20000){
			console.log(now.getTime()-lastFire)
			fs.appendFileSync('db.json', now.toLocaleString() +' :  Phòng ' +Object.keys(data)[0][1] +" phát hiện cháy <br/>", function (err) {
		  if (err) throw err;
		});
			lastFire = now.getTime()
			data = fs.readFileSync('db.json')
			socket.broadcast.emit('history',data.toString())
		}
		
	})

    socket.on('disconnect', function() {
        console.log('client disconnected');
    });  
});

