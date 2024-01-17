const redis = require('redis');

//single client and export it to diffrent files that is connected to redis
// as there is a easy method to connect to redis but it will create mulptiple clients
const client = redis.createClient({
    port:679 , 
    host:"17.0.0.1"
});


//The connect() method is used to connect the NodeJS to the Redis Server.
//This return promise that’s why we have to handle it either using the then and catch or using the sync and await keyword.
(async () => { 
    await client.connect(); 
})(); 
  
console.log("Connecting to the Redis"); 

//The client emits a ready event when it successfully initiates the connection to the server. 
client.on('ready', () => {
    console.log('Redis ready');

});

client.on('error', (err) => {
    console.log(err.message);
});

client.on('end', () => {
    console.log('Redis disconnected');
});

// stop redis when the client quit (ctrl + c)
process.on('SIGINT', () => {
    client.quit();
  })

module.exports = client;


