var SparkToken = require('../SparkToken.js');

clientId = 'Your client id here'
clientSecret = 'Your client secrect here'
callbackURL = 'Your callback URL here'

var sparkToken = new SparkToken(clientId,clientSecret,callbackURL)


sparkToken.initializeTokens('username@tpcall.me','password',function(err,tokens){

    if (!err)
    {
        console.dir(tokens)
        /* Will response with the tokens object below
        {
            access_token: 'NGRhMmU4YmMtNmM1My00MTYxLTk1NDMtZmZlZTgyNWM4YmQwNmIzZGEzYWMtYzBj',
            expires_in: 1209599,
            refresh_token: 'N2YwOWViNWItNjYyMC00MzM1LWEyOTYtNmE2ZTc0YWEwZjUwMGQ4MmQ3YTgtZGIx',
            refresh_token_expires_in: 7775999
        }
        */
    }
})

