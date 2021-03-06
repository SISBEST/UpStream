var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');
var path = require('path')
var stripe = require('stripe')(process.env.STRIPE);
var code = require('./code.json');
var games = require('./games.json');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('static'));

var admin = require('firebase-admin');

var serviceAccount = {
	type: 'service_account',
	project_id: 'samuelstream-b7231',
	private_key_id: process.env.PRIVATE_KEY_ID,
	private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: 'firebase-adminsdk-xp2vu@samuelstream-b7231.iam.gserviceaccount.com',
	client_id: '104282618802925540147',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xp2vu%40samuelstream-b7231.iam.gserviceaccount.com'
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://samuelstream-b7231.firebaseio.com'
});

db = admin.firestore();

app.get('/', function(req, res) {
	if (req.get('X-Replit-User-Id')) {
		db.collection(req.get('X-Replit-User-Id')).doc('payment').get()
			.then((doc) => {

			});
	} else {
		res.render('home');
	}
});

app.get('/done', function(req, res) {
	db.collection(req.get('X-Replit-User-Id')).doc('payment').set({
		member: false
	});
	res.render('paydone');
});

app.get('/play/:id', function(req, res) {
	res.render('500', {
		error: "Coming soon..."
	});
});

app.get('/code/:id', function(req, res) {
	res.render('500', {
		error: "Coming soon..."
	});
});

app.get('/play/:id/:page', function(req, res) {
	res.render('500', {
		error: "Coming soon..."
	});
});

app.get('/code/:id/:page', function(req, res) {
	db.collection(req.get('X-Replit-User-Id')).doc('payment').get()
		.then((doc) => {
			if (doc.data().owns.includes(req.params.id)) {
				fs.readFile(path.join(__dirname, req.params.id, req.params.page), 'utf8', function(err, data) {
					if (err) {
						res.send(err);
					} else {
						res.send(data);
					}
				});
			} else {
				res.status(403).send("AUTH");
			}
		});
});

app.use(function(req, res) {
	res.render('404');
});
app.use(function(error, req, res, next) {
	res.render('500', {
		error: error
	});
});
app.listen(3000);