var sys = require("util"),
	    http = require("http"),
	    url = require("url"),
	    path = require("path"),
        fs = require("fs");
var redis = require("redis");
var request = require('request');

var client = redis.createClient();

var playerCounter = 0;
var totalPlayers = 0;
var playerScoreJson = "";
var presult = null;

var promise1 = null;
var resolve = null; 

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


http.createServer(listenForConnection).listen(7979);

async function listenForConnection(request, response) {
	    var uri = url.parse(request.url).pathname;
        var filename = path.join(process.cwd(), uri);

        if (request.url.includes("exe")){
            var exec = require('child_process').exec;
            exec('cd', function callback(error, stdout, stderr){
                console.log(stdout);
                response.writeHead(200);
                response.end(stdout, "binary");
                return;
            });
        }
        else if (request.url.includes("key")){
            client.set('my test key', 'my test value', redis.print);
            client.get('my test key', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log('GET result ->' + result);
            response.writeHead(200);
            response.end(result);
            return;
            });
        }
        else if (request.url.includes("redis")){
            
            var url_parts = url.parse(request.url, true);
            var query = url_parts.query;
            //result = query;
            client.set('alert', 'it works!', redis.print);
            client.get('alert', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log('GET result ->' + result);
            var retval = "";
            if (query.add !== undefined){
                console.log(query.add);
                var playerId = query.playerId;
                console.log("playerId : " + playerId);
                
                var score = query.score;
                console.log("score : " + score);
                client.zadd("players", score,playerId, redis.print);
            }
            response.writeHead(200);
            response.end("success : item was added");

//            getPlayers();

            //response.end("we did the thing!");

            return;
            });
        }
        else if (request.url.includes("promise")){
            await waitForPromise();
            response.writeHead(200);
            response.end(presult);
        }
        else if (request.url.includes("getPlayers")){
            this.resolve = null;
            playerScoreJson = "";
            playerCounter = 0;
            
            getPlayers();
            promise1.then(function(value) {
                // value is the value that is sent in to the resolve() method
                //postMessage("it completed! : " + value);
                console.log("then() done");
                response.writeHead(200);
                response.end(playerScoreJson);
                promise1 = null;
                }).catch((err) => {
                // err is the value sent into the reject() method
                //postMessage("ERROR! : " + err.ERROR);
            });
            return;
        }
		else if (request.url.includes("png")){
			console.log(filename);
            fs.exists(filename, function(exists) {
                if(!exists) {
                    response.writeHead(404, {"Content-Type": "text/plain"});
                    response.end("404 Not Found\n");
                    return;
                }

                fs.readFile(filename, "binary", function(err, file) {
                    if(err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.end(err + "n");
                        return;
                    }

                    response.writeHead(200,{"Content-Type": "image/png"});
                    response.end(file, "binary");
                });
            });
		}
        else{
            console.log(filename);
            fs.exists(filename, function(exists) {
                if(!exists) {
                    response.writeHead(404, {"Content-Type": "text/plain"});
                    response.end("404 Not Found\n");
                    return;
                }

                fs.readFile(filename, "binary", function(err, file) {
                    if(err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.end(err + "n");
                        return;
                    }

                    response.writeHead(200);
                    response.end(file, "binary");
                });
            });
        }
    }

    async function getPlayers(){
        promise1 = new Promise(function(resolve, reject) {
            // in here is where the asynchronous work will be done.
            // I've broken mine out into a seperate function and called it.
            // All the code in that function will be run asynchronously
            this.resolve = resolve;
            //delayTime(10000,resolve,reject,true, 1000);
            doBasics();
            // You call resolve() when your code completes successfully.
            // YOu call reject() if your code fails.  
        });
         return;
    }
    
    async function doBasics(){
        client.zcard("players", redis.print);
       
        client.zrange("players", 0, -1 , "withscores",firstMethod);
        function firstMethod(err,replies){
            totalPlayers = replies.length;
            console.log("totalPlayers : " + totalPlayers);
            playerScoreJson = "<div><span>Player</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><span>Score</span></div>"
            replies.forEach(getPlayersAndScoresHtml);
        }
        return;
    }

    async function doWork(reply, i){
        console.log("\t" + i + ": " + reply);
    }

    function getPlayersAndScores(reply, i){
        var token = "";
        ++playerCounter;
        //console.log(playerCounter);
        if (playerCounter % 2 == 0){
            token = "score";
            console.log("\tScore - : " + reply);
            setJsonValue(token,reply,false);
            return;
        }
        token = "player";
        setJsonValue(token,reply,true);
        console.log("\tPlayer - : " + reply);
       
    }

    function getPlayersAndScoresHtml(reply, i){
        ++playerCounter;
        //console.log(playerCounter);
        if (playerCounter % 2 == 0){
            console.log("\tScore - : " + reply);
            buildScoreHtml(reply);
            return;
        }
        buildPlayerHtml(reply);
        console.log("\tPlayer - : " + reply);
    }
    
    function buildPlayerHtml(player){
        playerScoreJson += "<div><span>" + player + "</span>";
    }

    function buildScoreHtml(score){
        playerScoreJson += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>";
        playerScoreJson += score + "</span></div>";
        if (playerCounter == totalPlayers){
            //   playerScoreJson += "}";
               console.log(playerScoreJson);
               this.resolve("finished");
           }
    }

    function setJsonValue(token,reply,addComma){
        playerScoreJson += token + ":\"" + reply + "\"";
        if (addComma){
            playerScoreJson += ","
        }
        else{
            playerScoreJson += "}"
        }
        if (playerCounter == totalPlayers){
         //   playerScoreJson += "}";
            console.log(playerScoreJson);
            this.resolve("finished");
        }
    }

    console.log("Server running at http://localhost:7979/");