# RedisViaNode
## Summary
A complete example which includes Windows Redis server and client and provides a Node JS based http server to which allows you to run Redis commands via Node and a web page.

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
* This console window will stay open to keep the Redis server running.

![alt text](https://raw.githubusercontent.com/raddevus/RedisViaNode/master/RedisViaHttp/images/ClientZrange.png)
###
