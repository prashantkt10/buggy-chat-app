const https = require('https'), ws = require('ws'), fs = require('fs'), path = require('path');

const httpsServer = https.createServer({
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    key: fs.readFileSync(path.resolve(__dirname, 'key.pem'))
}, function (req, res) {
    fs.readFile(path.resolve(__dirname, 'index.html'), function (err, data) {
        if (err) return res.end('Server error.');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
});

const wss = new ws.Server({ server: httpsServer });

wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        wss.clients.forEach((client) => {
            client.send(data);
        });
    });
});

wss.on('error', function () { console.error('Error in WebSocket.'); });
httpsServer.listen(process.env.PORT, function () { console.log('Server listening on port 9001') });