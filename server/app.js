

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 10,
  padding: 20
};

var gameStats = {
  score: 0,
  highscore: 0
};

var updateHiScore = function() {
  // gameStats.highscore =
  //   d3.max([gameStats.highscore, gameStats.score]);

  // d3.select('.highest').text(gameStats.highscore.toString());
};

var createEnemies = function() {
  var enemies = [];
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    var enemy = {};
    enemy.id = i;
    enemy.x = Math.random() * 100;
    enemy.y = Math.random() * 100;
    enemies.push(enemy);
  }
  return enemies;
};


global.collisionCount = 0;

function updatePos (enemies){
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].x = Math.random() * 100;
    enemies[i].y = Math.random() * 100;
  };
};
function init() {

}

//initialize server
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
app.listen(8080);

function handler (req, res) {
  var path = require('url').parse(req.url).pathname;
  if(path === '/') path = '/index.html';
  fs.readFile(__dirname + path,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

//init();

var playerPositions = {};

var enemies = createEnemies();

setInterval(function(){
    updatePos(enemies);
    io.emit('enemies', {'enemies' : enemies});
  }, 1000);

io.on('connection', function (socket) {

  

  socket.on('playerPositionUpdate', function (playerPos) {
    playerPositions[socket.id] = playerPos;
    playerPositions[socket.id].id = socket.id;
  });

  setInterval(function(){
    var playerData = [];
    for(var id in playerPositions){
      if(id !== socket.id ){
        playerData.push(playerPositions[id]);
      }
    }

    socket.emit('playerPos', {'p':playerData});
  }, 50);
});

io.on('disconnect', function (socket) {

  delete playerPositions[socket.id];
});
io.on('collision', function (socket) {
  console.log(global.collisionCount++);

  if (global.collisionCount >= 3) {
    io.emit('gameOver');
  }
});


console.log(global.collisionCount);





























