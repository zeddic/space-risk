var renderer, camera, stage;

PIXI.Point = Vector;

function createState() {
  var el = $('.game-content');

  var state = {
    el:  el,
    width: el.innerWidth(),
    height: el.innerHeight(),
    graphics: null,
    renderer: null,
    stage: null,
    entities: []
  };

  $(window).resize(function() {
    state.width = el.innerWidth();
    state.height = el.innerHeight();
    state.renderer && state.renderer.resize(state.width, state.height);
  });

  return state;
}

space.state = {};

function start() {

  // Stats
  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  $(document.body).append(stats.domElement);

  // Canvas
  var state = space.state = createState();
  var width = state.width;
  var height = state.height;
  var renderer = state.renderer = new PIXI.WebGLRenderer(width, height);
  state.el.append(state.renderer.view);

  var stage = state.stage = new PIXI.Stage();
  var items = state.entities;
  var planets = [];
  var ships = [];

  // Create Planets.
  for (var i = 0; i < 20; i++) {
    var planet = new Planet(rand(0, width), rand(0, height));
    planets.push(planet);
    items.push(planet);
  }

  // Create Ships.
  for (var i = 0; i < 0; i++) {
    var ship = new Ship(rand(0, width), rand(0, height));
    items.push(ship);
    ships.push(ship);
  }

  // Create Graphics.
  state.graphics = new PIXI.Graphics();

  // Move them around when you click.
  /*stage.click = function() {
    items.forEach(function(item) {
      item.position.set(rand(0, width), rand(0, height));
    });
  }; */

  // Have ships follow your mouse.
  stage.mousemove = function(data) {
    ships.forEach(function(ship) {
      ship.target = data.global;
    });
  };

  var commands = createCommands(stage, planets);

  items.forEach(stage.addChild.bind(stage));
  stage.addChild(state.graphics);

  function animate() {
    state.graphics.clear();

    items.forEach(invoke('update'));
    commands.update();
    space.collisions.check(items);

    renderer.render(stage);

    requestAnimationFrame(animate);
    stats.update();
  }

  requestAnimationFrame(animate);
}