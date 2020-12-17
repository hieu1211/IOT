var express = require("express")
var app = express()
var port = 3000
var server = app.listen(port,()=>console.log('Server open port 3000'))
var io = require('socket.io')(server);
var fs = require('fs');
var firebase = require('firebase')

app.use(express.static('public'));
app.set('view engine','pug');
app.set('views', './view');
app.get('/',(req,res)=>{
	res.render('layout')
})
var firebaseConfig = {
  apiKey: "AIzaSyC_EBgUM-6HzJD3MXHNddQlZMYs8SoZqd4",
  authDomain: "esprobot-2878d.firebaseio.com",
  databaseURL: "https://esprobot-2878d.firebaseio.com/",
}
firebase.initializeApp(firebaseConfig)
let database = firebase.database()
var lastFire=0;
setInterval(function(){
	let now = new Date()
	if(now.getTime()-lastFire >500){
		database.ref("/").set({"Room1":"Safe","Room2":"Safe"})
	}
		
},200)
io.on('connection', function (socket) {
	console.log('client connected '+socket.id);
	data = fs.readFileSync('db.json')
	socket.emit('history',data.toString())
	socket.on('fire-detection',(data)=>{
		socket.broadcast.emit('fire-detection',data)
		if(Object.keys(data)[0]=='P1')
			database.ref("/").set({"Room1":"Fire","Room2":"Safe"})
		else if (Object.keys(data)[0]=='P2')
			database.ref("/").set({"Room1":"Safe","Room2":"Fire"})
		let now = new Date()
		if(now.getTime()-lastFire>20000){
			fs.appendFileSync('db.json', now.toLocaleString() +' :  Phòng ' +Object.keys(data)[0][1] +" phát hiện cháy <br/>", function (err) {
		  if (err) throw err;
		});
			data = fs.readFileSync('db.json')
			socket.broadcast.emit('history',data.toString())
		}
		lastFire = now.getTime()
		
	})
    socket.on('disconnect', function() {
        console.log('client disconnected');
    });  
});

