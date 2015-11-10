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

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

var updateHiScore = function() {
  gameStats.highscore =
    d3.max([gameStats.highscore, gameStats.score]);

  d3.select('.highest').text(gameStats.highscore.toString());
};
 
window.collisionCount = 0;

var render = function(enemy_data) {
  var enemies = gameBoard.selectAll('.enemy')
    .data(enemy_data, function(d) {
      return d.id;
    });


  

  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(d){
      return axes.x(d.x);
    })
    .attr('cy', function(d){
      return axes.y(d.y);
    })
    .attr('r', 10)
    .attr('fill', 'blue');
  // .attr('r',10)
  //.attr('fill', 'blue');

  // enemies.each(function(enemy) {
  //   enemy.x = Math.random() * 100;
  //   enemy.y = Math.random() * 100;
  // });

  //players[0] is the main player
  // here we are checking if they collide:

  var checkCollision = function() {
    enemies.each(function(enemy, i) {

      var x = Number(d3.select(this).attr('cx')) + 10 - players[0].x;
      var y = Number(d3.select(this).attr('cy')) + 10 - players[0].y;

      var l = Math.sqrt(x * x + y * y);
      var r = Number(d3.select(this).attr('r') / 2) + players[0].r;

      if (l < r) {
        //make some sort of effect
        //players[0].attr('fill', 'orange')
        //reset score/game over
        d3.select(".collision-count").data([collisionCount]).text(function(count) {
          return count
        });
        collisionCount++;
        updateHiScore();
        gameStats.score = 0;

        socket.emit('collision', {});
        if (collisionCount >= 3) {

        }
      }
    });
  };
  if (window.collisionHandler) {
    clearInterval(collisionHandler);
  }
  window.collisionHandler = setInterval(checkCollision, 50);
  enemies.transition()
    .duration(1000)
    .ease('linear')
    .attr('cx', function(enemy) {
      return axes.x(enemy.x);
    })
    .attr('cy', function(enemy) {
      return axes.y(enemy.y);
    });

  enemies.exit()
    .remove();
};


var updateOtherPlayers = function(otherPlayers){
  var newPlayers = gameBoard.selectAll('.player')
    .data(otherPlayers, function(d){
    return d.id;
    });

  newPlayers.enter()
    .append('svg:circle')
    .attr('class', 'player')
    .attr('cx', function(d){
      return d.x;
    })
    .attr('cy', function(d){
      return d.y;
    })
    .attr('r', 10)
    .attr('fill', 'orange');

  newPlayers.transition()
    .duration(50)
    .ease('linear')
    .attr('cx', function(player) {
      return player.x;
    })
    .attr('cy', function(player) {
      return player.y;
    });
};

function init() {
  var socket = io('http://10.6.28.252:8080');
  socket.on('enemies', function(enemy_data){
    render(enemy_data.enemies);
  });
  window.players = [];
  players.push(new Player(gameOptions));
  players[0].render(gameBoard);

  socket.on('playerPos', function(player_data){
    updateOtherPlayers(player_data.p);
  });

  setInterval(function(){
    socket.emit('playerPositionUpdate', {'x': players[0].x, 
                                         'y': players[0].y, 
                                         'angle': players[0].angle});
  }, 50);
  
  socket.on('gameOver', function(){
    d3.select(".gameOver")
              .transition()
              .duration(1000)
              .style('background-color', 'red')
              .text("GAME OVER")
              .style('display', 'block');
  });

  // var enemies = createEnemies();
  // setInterval(function() {
  //   render(enemies);
  // }, 1000);
  // setInterval(function() {
  //   gameStats.score++;
  //   d3.select('.current').text(gameStats.score.toString());
  // }, 100);
}
init();