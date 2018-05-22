var express = require('express');
var path = require('path');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');

app.use(cors());

// own parsing middleware to get raw request body
app.use(function(req, res, next){
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk){
        req.rawBody += chunk;
    })

    req.on('end', function(){
        return next();
    })
});

app.use(express.static(path.join(__dirname, '/')));

app.post('/playready', function (req, res, next) {
    var playReadyServer = 'http://www98.verizon.com/playready/rightsmanager.asmx';
    console.log('INCOMING REQUEST FROM PLAYER TO :' + playReadyServer);
    console.log('----------------------------------------------------------------------------------------------\n\n');
    console.log(req.rawBody + '\n\n--------------------------------------------------------------------------------------\n\n\n');

    // BY REQUEST
    request({
        url: playReadyServer,
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml'
        },
        body: req.rawBody
    }, function(error, response, body){
    
        if(error || response.statusCode !== 200) {
            console.log('\nPLAY READY SERVER GAVE ERROR!!!\n\n', body);
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.status(response.statusCode).send(body);
        } else {
            console.log('RESPONSE from PLAYREADY SERVER IS RECEIVED: ', response.statusCode);
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            res.status(response.statusCode).send(body);
        }       
    });

});
  
app.listen(3000, function () {
  console.log('Player App listening on port 3000...');
});