var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var serialport = require("serialport");		
var	SerialPort  = serialport.SerialPort;

//Port
app.listen(8080);

//Global variable for building JSON
var myObject = {};

//Serialport setup
var myPort = new SerialPort("/dev/ttyATH0", { 
	baudRate: 9600,
	//Parsing data if return or newline
	parser: serialport.parsers.readline("\r")
});

//Is triggert when receiving data from Serialport
myPort.on("open", function () {
  console.log("Port is open:");
    //Writes received data into a string
    myPort.on("data", function(data) {
    var command = data.toString();
    //Parsing data and build JSON
    if (command.substring(0, command.indexOf("#"))=="LED"){
        myObject.LED = [command.substring(command.indexOf("#")+1)];
    }
    //If needed for console log
    //console.log("data received: " + JSON.stringify(myObject));
  });
});

//HTML routing for different kind of data html;css;js
function handler (req, res) {
   if (req.url === '/') {
        fs.readFile('index.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data, 'utf-8');
   });
   } else if (req.url === '/css/index.css') {
        fs.readFile('css/index.css', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(data, 'utf-8')
   });
   } else if (req.url === '/socketio.js') {
        fs.readFile('socketio.js', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(data, 'utf-8')
   });
   };
}

//Opening a WebSocket connection
io.on('connection', function (socket) {
  console.log("New Connection started");
//Sends LED Status information (every 100ms) to all connected clients and keeps them in sync
    setInterval(function(){
        socket.emit('news', myObject); 
  }, 100);
//Listen on "ledBttonOn" and sends the command to Atmel via Serialport 
  socket.on('ledButtonOn', function (data) {
    console.log("Event ledButtonOn: "+JSON.stringify(data));
    
    myPort.write("L"+JSON.stringify(data.LED)+"/n");
  });
    
//Listen on "ledBttonOn" and sends the command to Atmel via Serialport 
  socket.on('ledButtonOff', function (data) {
    console.log("Event ledButtonOff: "+JSON.stringify(data));
    
    myPort.write("L"+JSON.stringify(data.LED)+"/n");
  });
});

//Information for console
console.log("Server initialized");