const http = require('http'), ws = require('ws'), fs = require('fs');

const httpServer = http.createServer(function (req, res) {
    fs.readFile('../static/index.html', function (err, data) {
        if (err) res.end('Server error.');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
});

const wss = new ws.Server({ server: httpServer });

wss.on('connection', function (ws) {
    console.log('clients: ', wss.clients.size);
    ws.on('message', function (data) {
        wss.clients.forEach((client) => {
            console.log('incoming msg: ', data.data);
            client.send(data);
        });
    });
});

wss.on('close', function (ws) {
    console.log('Disconnected: ')
})


httpServer.listen(process.env.PORT, function () { console.log('Server listening on port 9001') });