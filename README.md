# RedisViaNode
## Summary
A complete example which includes Windows Redis server and client and provides a Node JS based http server which allows you to run Redis commands via Node and a web page (incuded in repo).

## Prerequisite Requirements
* Windows box (Win10)
* Node (and NPM) must be installed and available via path from your user console.

## Simple Steps To See It All Work
1. clone this repo (> git clone https://github.com/raddevus/RedisViaNode) into a local directory
2. open Windows Explorer and navigate to the local directory where you cloned the project
3. double-click the 0_runAll.bat 

## What Will Happen?
* 0_runAll.bat will call each of the other batch files in order.
* Each of the .bat files will start a service or run some other functionality for you.

As Each bat file runs you will see some activity.
### 1_installHttpPackages.bat 
* runs npm install in the \RedisViaHttp folder (insures required Node modules are available so HTTP server will run)
### 2_startRedisServer.bat
* Starts Redis Server from \WinRedisComplete folder (server runs on default port 6379)
* This console window will stay open to keep the Redis server running.  It'll look something like the following:
![alt text](https://raw.githubusercontent.com/raddevus/RedisViaNode/master/RedisViaHttp/images/RedisServerConsole.png)

### 3_loadPlayerData.bat
* loads some initial player data from player.dat file (this console window closes)

### 4_startRedisClient.bat
* starts up the Redis-Cli (Redis client) in a console so you can run commands and test the cache data

![alt text](https://raw.githubusercontent.com/raddevus/RedisViaNode/master/RedisViaHttp/images/RedisClientConsole.png)

### 5_startHttpServer.bat
* starts up the custom Node HTTP server via >node static-server.js 

![alt text](https://raw.githubusercontent.com/raddevus/RedisViaNode/master/RedisViaHttp/images/NodeHttpServer.png)

### 6_loadWebPage.bat
* starts up the Main Web page in your default browser

#### Here's What the Main Web Page Looks Like

You can use this page to run some Redis functionality.  The page is self-explanatory.

![alt text](https://raw.githubusercontent.com/raddevus/RedisViaNode/master/RedisViaHttp/images/MainWebPage.png)

