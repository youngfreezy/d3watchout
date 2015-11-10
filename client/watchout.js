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

var createEnemies = function() {
  return d3.range(0, gameOptions.nEnemies).map(function(i) {
    var enemy = {};
    enemy.id = i;
    enemy.x = Math.random() * 100;
    enemy.y = Math.random() * 100;
    return enemy;
  });
};

window.collisionCount = 0;
var render = function(enemy_data) {
  var enemies = gameBoard.selectAll('.enemy')
    .data(enemy_data, function(d) {
      return d.id;
    });

  enemies.enter()
    .append('image')
    .attr('xlink:href', 'asteroid.png')
    .attr('class', 'enemy')
    .attr('x', function(enemy) {
      return axes.x(enemy.x);
    })
    .attr('y', function(enemy) {
      return axes.y(enemy.y);
    })
    .attr("width", "20")
    .attr("height", "20");
  // .attr('r',10)
  //.attr('fill', 'blue');

  enemies.each(function(enemy) {
    enemy.x = Math.random() * 100;
    enemy.y = Math.random() * 100;
  });

  //players[0] is the main player
  // here we are checking if they collide:

  var checkCollision = function() {
    enemies.each(function(enemy, i) {

      var x = Number(d3.select(this).attr('x')) + 10 - players[0].x;
      var y = Number(d3.select(this).attr('y')) + 10 - players[0].y;

      var l = Math.sqrt(x * x + y * y);
      var r = Number(d3.select(this).attr('width') / 2) + players[0].r;

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

        // if (collisionCount >= 3) {
        //   d3.select(".gameOver")
        //     .transition()
        //     .duration(1000)
        //     .style('background-color', 'red')
        //     .text("GAME OVER")
        //     .style('display', 'block');
        // }
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
    .attr('x', function(enemy) {
      return axes.x(enemy.x);
    })
    .attr('y', function(enemy) {
      return axes.y(enemy.y);
    });

  enemies.exit()
    .remove();
};

function init() {

  window.players = [];
  players.push(new Player(gameOptions));
  players[0].render(gameBoard);
  var enemies = createEnemies();
  setInterval(function() {
    render(enemies);
  }, 1000);
  setInterval(function() {
    gameStats.score++;
    d3.select('.current').text(gameStats.score.toString());
  }, 100);
}
init();