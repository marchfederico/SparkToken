var request = require('request');

// ------------
// The Module

function SparkToken(consumerKey, consumerSecret, callbackURL, scope) {

    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.callbackURL = callbackURL;
    this.tokens='';
    this.authorizeURL = "https://idbroker.webex.com/idb/oauth2/v1/authorize";
    this.name = 'sparktoken';

    if (scope)
    {
        this.scope = scope;
    }
    else
    {
        this.scope = ['spark:memberships_write', 'spark:memberships_read', 'spark:rooms_read', 'spark:rooms_write', 'spark:messages_write', 'spark:messages_read'];
    }

}

SparkToken.prototype.initializeTokens = function (username,password,callback) {

    var self = this;

    var params = { IDToken0:'',
        IDToken1:username,
        IDToken2:password,
        IDButton:'Sign+In',
        'goto': self.generateGotoURL(),
        SunQueryParamsString: self.generateSunQuery(username),
        encoded:'true',
        loginid:username,
        isAudioCaptcha:'false',
        gx_charset:'UTF-8'
    };

    // kick it all off!

    request({url:'https://idbroker.webex.com/idb/UI/Login',qs:params, jar:true}, function (error, response, body) {
        if (!error) {
            var securityCode = self.getSecurityCode(body);
            if (securityCode) {
                self.postAccept(securityCode, function (error, response, body) {
                    if (response.statusCode == 302) {
                        var location = response.headers.location;
                        var code = location.match(/.*code=(.*)/);
                        if (code) {
                            // get the access token here.
                            self.requestAccessTokenWithCode(code[1], callback);

                        }
                    }
                    else {
                        callback({error:'Error getting the code'});
                    }
                })
            }
            else
            {
                callback({error:'Error getting the security code'});
            }
        }
        else
        {
            callback({error:'Error trying initial request'});

        }
    })

};


SparkToken.prototype.refreshTokens = function (callback) {
    var self = this;
    var formData = {
        grant_type:'refresh_token',
        client_id:self.consumerKey,
        client_secret:self.consumerSecret,
        refresh_token: self.tokens ? self.tokens.refresh_token : null
    };

    request.post({url: 'https://api.ciscospark.com/v1/access_token', form:formData}, function (error, response, body) {

        if (error)
        {
            callback(error);
        }
        else
        {
            try {

                var refreshed = JSON.parse(body);
                self.tokens.access_token = refreshed.access_token;
                self.tokens.expires_in = refreshed.expires_in;
                callback(null,self.tokens);
            }
            catch (e)
            {
                callback(e);
            }
        }

    })

};

///////////////////////////////
// Internal helper functions //
//////////////////////////////
SparkToken.prototype.generateSunQuery = function(loginId) {
    var self = this;
    var query = 'isCookie=false&fromGlobal=yes&realm=consumer&type=login&encodedParamsString=dHlwZT1sb2dpbg==&gotoUrl='+self.generateGotoURL()+'&email='+loginId;
    return new Buffer(query).toString('base64');
};

SparkToken.prototype.generateGotoURL = function() {
    var self = this;
    var scopeURLEncoded = self.getScopeAsString();
    scopeURLEncoded = scopeURLEncoded.replace(/ /g, '%20').replace(/:/g, '%3A');
    var redirectURL = self.callbackURL.replace(/\//g, '%2F').replace(/:/g, '%3A');
    var decodedUrl = self.authorizeURL+'?response_type=code&client_id='+self.consumerKey+'&redirect_uri='+redirectURL+'&scope='+scopeURLEncoded;
    return new Buffer(decodedUrl).toString('base64');
};

SparkToken.prototype.postAccept = function(securityCode, callback) {
    var self = this;
    var formData = {
        security_code :securityCode,
        response_type: 'code',
        client_id: self.consumerKey,
        decision: 'accept'
    };
    var qparams = {
        response_type: 'code',
        client_id :self.consumerKey,
        redirect_uri: self.callbackURL,
        service: 'webex-squared',
        scope: self.getScopeAsString()
    };
    request.post({url: self.authorizeURL, jar:true, qs:qparams, form:formData}, callback)
};

SparkToken.prototype.getScopeAsString = function () {
    var self = this;
    var ret = '';
    for (var i = 0; i < self.scope.length; i++) {
        ret+=self.scope[i]+' ';
    }
    ret = ret.trim();
    return ret;
};

SparkToken.prototype.getSecurityCode = function (html) {
    var regex1 = /.*<input type="hidden" value="(.*)" name="security_code"/;
    var regex2 = /.*<input type="hidden" name="security_code" value="(.*)"/;
    var result = html.match(regex1);
    if (result)
        return result[1];
    else {
        result = html.match(regex2);
        if (result)
            return result[1];
        else
            return null
    }
};

SparkToken.prototype.requestAccessTokenWithCode = function (code, callback) {
    var self = this;
    var formData = {
        grant_type:'authorization_code',
        client_id:self.consumerKey,
        client_secret:self.consumerSecret,
        code: code,
        redirect_uri: self.callbackURL
    };

    request.post({url: 'https://api.ciscospark.com/v1/access_token', form:formData}, function (error, response, body) {

        if (error)
        {
            callback(error);
        }
        else
        {
            try {
                self.tokens = JSON.parse(body);
                callback(null,self.tokens);
            }
            catch (e)
            {
                callback(e);
            }
        }

    })
};


module.exports = SparkToken;
