var Player = function(gameOptions){
  this.gameOptions = gameOptions;
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = 'red';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;
};

Player.prototype.render = function(to) {
  this.el = to.append('svg:path')
            .attr('d', this.path)
            .attr('fill', this.fill);
  this.transform({'x': this.gameOptions.width * 0.5, 'y': this.gameOptions.height * 0.5});
  this.setupDragging()
  return this;
};

Player.prototype.setX = function(x){
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;

  x = x <=minX ? minX : x;
  x = x >=maxX ? maxX : x;
  this.x = x;
};

Player.prototype.setY = function(y){
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.height - this.gameOptions.padding;

  y = y <=minY ? minY : y;
  y = y >=maxY ? maxY : y;
  this.y = y;
};

Player.prototype.transform =  function(opts){
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);

  this.el.attr('transform',
    "rotate(" + this.angle + ","+ this.x + "," + this.y + ")" +
    "translate(" + this.x + ","+this.y+")");
};


Player.prototype.moveRelative = function(dx,dy){
  this.transform({
    'x': this.x +dx,
    'y': this.y +dy,
    'angle': 360 * (Math.atan2(dy,dx)/(Math.PI*2))
  });      
};

Player.prototype.setupDragging = function(){
  var dragMove = function(){
    this.moveRelative(d3.event.dx, d3.event.dy);
  };
  
  var drag = d3.behavior.drag()
               .on('drag', dragMove.bind(this) );

  this.el.call(drag);
};
    