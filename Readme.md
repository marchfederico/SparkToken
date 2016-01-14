# Cisco Spark Token
> A Cisco Spark Access Token module for Bots 
This module lets you use obtain a Cisco Spark access token without any user interaction.  
Useful for creating a Spark Bot. 

***Note this will only work for consumer accounts.** Corporate/SSO accounts haven't been tested and will most 
likely not work.  

## Install

Install with [npm](http://github.com/isaacs/npm):

```
  npm install git+https://github.com/marchfederico/SparkToken.git
```
## The  Cisco Spark Access Token Library Functions

*Create the Spark Token object*

#### SparkToken(consumerKey, consumerSecret, callbackURL)
```
    var SparkToken = require('spark-token')
    var sparkToken = new SparkToken('1111c127579545adeb55226aa8857986c6e1ab4a67ec907c39b879bf2aaaaaaaa','ffffffffd0a01af12a627e5d8772055564a5d873ba913e971c1883b7eeeeeeee','https://chester.tpcall.me/callback' )
```


*Grab the access token using a username and password.*
 
#### SparkToken.initializeTokens(username,password,callback)

``` javascript
    sparkClient.initializeTokens('chester@tpcall.me', 'thisIsNotMyPassword', function(err,tokens) {
        if (!err) {
            console.log("Got the tokens!")
            console.dir(tokens)
            /*   Will respond with the tokens object
                 {
                        access_token: 'NGRhMmd4YmMtxmM1My10M2YxLTk1NDMtZmZlZTgyNWM4YmQwNmIzZGEzYWMtYzBj',
                        expires_in: 1209599,
                        refresh_token: 'N2YwdWVWNWItNjYyMC00MzM1LW2yOTYtNmE2ZT50YWEwZjUwMGQ4MmQ3YTgtZGIx',
                        refresh_token_expires_in: 7775999
                  }
             */
        }
    })
```

*The access token and refresh token will be stored in a tokens object that is a member of SparkToken*

#### SparkToken.tokens

``` javascript
    {
        access_token: 'NGRhMmd4YmMtxmM1My10M2YxLTk1NDMtZmZlZTgyNWM4YmQwNmIzZGEzYWMtYzBj',
        expires_in: 1209599,
        refresh_token: 'N2YwdWVWNWItNjYyMC00MzM1LW2yOTYtNmE2ZT50YWEwZjUwMGQ4MmQ3YTgtZGIx',
        refresh_token_expires_in: 7775999
     }
```
 
*Refresh the access token before it expires*

#### SparkToken.refreshTokens(callback)

``` javascript
    sparkClient.refreshTokens(function(err,tokens) {
        if (!err) {
            console.log("Refreshed the access token!")
            console.dir(tokens)
            /*   will respond with the tokens object
                 {
                        access_token: 'DGRbwmd4Ykst3mM1My10M2YxLTk1NDMtZmZlZTgyNWM4YmQwNmIzZGEzYWMtYzBj',
                        expires_in: 1209599,
                        refresh_token: 'N2YwdWVWNWItNjYyMC00MzM1LW2yOTYtNmE2ZT50YWEwZjUwMGQ4MmQ3YTgtZGIx',
                        refresh_token_expires_in: 7775999
                  }
             */
        }
    })
```

