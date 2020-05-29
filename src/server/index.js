const http = require('http'), ws = require('ws'), fs = require('fs'), path = require('path');

const httpServer = http.createServer(function (req, res) {
    fs.readFile(path.resolve(__dirname, 'index.html'), function (err, data) {
        if (err) return res.end('Server error.');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
});

const wss = new ws.Server({ server: httpServer });

wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        wss.clients.forEach((client) => {
            client.send(data);
        });
    });
});

wss.on('close', function (ws) {
    console.log('Disconnected: ')
});

wss.on('error', function () {
    console.error('Error in WebSocket.');
})


httpServer.listen(process.env.PORT || 9001, function () { console.log('Server listening on port 9001') });