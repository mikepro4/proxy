const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const PUBLIC_DIR = "public";
const STATIC_DIR = "static";
const timeout = require('connect-timeout')

var cors_proxy = require('cors-anywhere');

const app = express();

const net = require("net")

var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 909;

var cors_proxy = require('cors-anywhere');
let server = net.createServer({
    originWhitelist: [],
  removeHeaders: [
    'cookie',
    'cookie2',
    // Strip Heroku-specific headers
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
    // Other Heroku added debug headers
    // 'x-forwarded-for',
    // 'x-forwarded-proto',
    // 'x-forwarded-port',
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
    xfwd: false,
  },
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});

server.on("connection", (clientToProxySocket) => {
    console.log("Client connected to proxy");
    clientToProxySocket.once("data", (data) => {
        let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;

        let serverPort = 80;
        let serverAddress;
        console.log(data.toString());
        if (isTLSConnection) {
            serverPort = 443;
            serverAddress = data
                .toString()
                .split("CONNECT")[1]
                .split(" ")[1]
                .split(":")[0];
        } else {
            serverAddress = data.toString().split("Host: ")[1].split("\r\n")[0];
        }
        console.log(serverAddress);

        // Creating a connection from proxy to destination server
        let proxyToServerSocket = net.createConnection(
            {
                host: serverAddress,
                port: serverPort,
            },
            (data) => {
                console.log("Proxy to server set up");
            }
        );


        if (isTLSConnection) {
            clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else {
            proxyToServerSocket.write(data);
        }

        clientToProxySocket.pipe(proxyToServerSocket);
        proxyToServerSocket.pipe(clientToProxySocket);

        proxyToServerSocket.on("error", (err) => {
            console.log("Proxy to server error");
            console.log(err);
        });

        clientToProxySocket.on("error", (err) => {
            console.log("Client to proxy error");
            console.log(err)
        });
    });
});

server.on("error", (err) => {
    console.log("Some internal server error occurred");
    console.log(err);
});

server.on("close", () => {
    console.log("Client disconnected");
});

// server.listen(
//     {
//         host: process.env.HOST || "0.0.0.0",
//         port: process.env.PORT || 909,
//     },
//     () => {
//         console.log("Server listening on 0.0.0.0:909");
//     }
// );

// var http = require('http');
// var httpProxy = require('http-proxy');
// var proxy = httpProxy.createProxyServer({});

// // http.createServer(function(req, res) {
// //     console.log(req.body)
// //     proxy.web(req, res, { target: 'http://www.google.com' });
// // }).listen(909);

// var server = http.createServer(function(req, res) {
//     // You can define here your custom logic to handle the request
//     // and then proxy the request.
//     console.log(req.body)
//     // proxy.web(req, res, { target: 'http://127.0.0.1:5050' });
// });

// console.log("listening on port 5050")
// server.listen(5050);

// app.use(timeout('15s'))
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(cors());

// app.use(express.static(STATIC_DIR));
// app.use(express.static(PUBLIC_DIR));

// app.get('/', function(req, res) {
//   res.send({ message: 'this is a proxy' });
// });




// const PORT = process.env.PORT || 909;
// const server = app.listen(PORT);

// const io = require('socket.io')(server, {
// 	cors: {
// 	  origin: '*',
//     },
//     pingTimeout: 25000
// })

// io.on('connection',(socket)=>{
//     socket.emit('rejectvideo',(data)=>{     
//         return('reject from socket')
//     })

// })
