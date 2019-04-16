let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type)

var heightWindow = window.innerHeight; 
var width = 700;

let Application = PIXI.Application,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Text = PIXI.Text,
TextStyle = PIXI.TextStyle,
Graphics = PIXI.Graphics,
renderer = PIXI.autoDetectRenderer(width, heightWindow);

let game = new Application({width:width,  height:heightWindow});
game.renderer.backgroundColor=0x061639;
game.renderer.autoRezise = true;
document.getElementById("juego").appendChild(game.view);

let principal;
let enemigos=[];
let velocidadGeneraEnemigo=100;
let cuentaInfinita=0;
let velocidaEstandarEnemigo=1;
let velocidadEnemigo = 1;
let velocidadPrincipal = 4;

setup();
function setup(delta){ 
    principal = jugador();
    game.stage.addChild(principal);

    let left = keyboard("ArrowLeft"), 
      right = keyboard("ArrowRight");
      down = keyboard("ArrowDown");
    left.press = () => { 
        principal.vx = -velocidadPrincipal;
        principal.vy = 0;
    }   
    left.release = () => {
            principal.vx = 0;
            principal.vy = 0;
    }
    right.press = () => { 
        principal.vx = velocidadPrincipal;
        principal.vy = 0;
    }   
    right.release = () => {
            principal.vx = 0;
            principal.vy = 0;
    }
    down.press = () => { 
        velocidadEnemigo += 10;
        velocidadGeneraEnemigo = 10; 
    }   
    down.release = () => {
        velocidadEnemigo = velocidaEstandarEnemigo;
        velocidadGeneraEnemigo = 100;;
    }
    state = play;

    game.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){ 
    cuentaInfinita++;
    if((cuentaInfinita % velocidadGeneraEnemigo) == 0){
        game.stage.addChild(boots());
    }
    for (let index = 1; index < enemigos.length; index++) {
        enemigos[index].vy = enemigos[index].vy + velocidadEnemigo; 
        enemigos[index].y = enemigos[index].vy; 
    }

    state(delta);
}

function play(delta) {
    principal.x += principal.vx;
    principal.y += principal.vy;

    for (let index = 1; index < enemigos.length; index++) {
        if (hitTestRectangle(enemigos[index], principal)) {            
            game.stop();
        }
        else{

        }
    }
}