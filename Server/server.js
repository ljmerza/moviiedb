'use strict'

let express = require('express');
let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');
let helmet = require('helmet');
let compression = require('compression');
let request = require('request');

const APIKEY = require('./config'); // config file that holds api key
const port = process.env.PORT || 3000;


let app = express();



app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, './../Client/dist/')));




app.get('/topmovies', (req, res, next) => {

	let url = `http://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY.APIkey}&page=${req.query.page}`;

	request.get(url)
	.on('response', response => {
		// set content-type and status headers
		res.header('content-type', response.statusCode);
		res.status(response.statusCode);
	}).pipe(res) // pipe request response to express response

	.on('error', err => {
		// on error push to error route
		next(err);
	});
});


app.get('/search', (req, res, next) => {

	let url = `http://api.themoviedb.org/3/search/movie?api_key=${APIKEY.APIkey}&include_adult=true&page=${req.query.page}&query=${encodeURIComponent(req.query.value)}`;

	request.get(url)
	.on('response', response => {
		// set content-type and status headers
		res.header('content-type', response.statusCode);
		res.status(response.statusCode);
	}).pipe(res) // pipe request response to express response

	.on('error', err => {
		// on error push to error route
		next(err);
	});
});







// catch favicon requests
app.get('/favicon.ico', (req, res, next) => {
	res.send(200);
});


// production error
app.use( (err, req, res, next) => {
	res.status(err.status || 500);
	res.send("An error has occured.");
});

// development error
if (app.get('env' === 'development')) {
	app.use( (err, req, res, next) => {
		res.status(err.status || 500);
		res.json({ error: err });
		
	});
}






// create server object
let server = http.createServer(app);
// booting up server function
let boot = () => {
	server.listen(port, () => {
		console.log('Express server listening on port', port);
  	});
}
// shutdown server function
let shutdown =  () => {
	server.close();
}

// if main module then start server else pass to exports
if(require.main === module){
	boot();
} else {
	console.log('Running moviedb app as module')
	module.exports = {
    	boot,
    	shutdown,
    	port,
    	server,
    	app
  	}
}