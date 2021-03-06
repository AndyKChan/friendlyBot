var restify = require('restify');
var builder = require('botbuilder');
var request = require('superagent');
var getNutrition = require('./nutrition.js');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/603163cb-a45c-4308-a518-6d48d0b65618?subscription-key=ea2c31d50ef04c339bf5637ed3dcc758&timezoneOffset=0.0&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', dialog);

dialog.matches('Change_Name', [

    function (session, results) {
		if(results.entities && results.entities.length && results.entities[0]){
			var userName =  results.entities[0].entity;
			session.userData.name = userName;
			session.send('Hello %s!', userName)
		}
		else {
			session.beginDialog('/profile');
		}
    },
	
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

dialog.onDefault([

    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
	
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [

    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
	
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

dialog.matches('Upload_Pic', [

	function (session) {
		builder.Prompts.attachment(session, "Upload a picture of food for me to analyze!");
	},
	
	function (session, results) {
		var result = ''
		console.log(results.response[0].contentUrl);
		session.userData.foodPic = results.response;
		
		if(results.response[0].contentUrl.match(/localhost/i)){
			result = 'https://g.foolcdn.com/editorial/images/225916/getty-apple_large.jpg'
		} else {
			result = results.response[0].contentUrl;
		}
		
		request
		   .post('https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Categories,Tags&language=en')
		   .send({"url":result})
		   .set('Content-Type', 'application/json')
		   .set('Ocp-Apim-Subscription-Key', '450efdb5185b46eca7f09bf89646731c')
		   .end(
		   	function (err, res){
		
				if (err || !res.ok) {
					session.send('oops')
				} else {
					console.log(res)
					var food = res.body.tags.filter(function(t){return t.hint == 'food'});
					console.log(food);
					
					//food[0].name is the food
					if(food.length){
						getNutrition(food[0].name).then(facts => session.send(facts));
					} else { 
					session.send('no food was found!')
					}
					
					console.log('success');
				}

				session.endDialog();
			});
				
		}
]);