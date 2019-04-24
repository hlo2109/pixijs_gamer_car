let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
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
let util = new SpriteUtilities(PIXI);

let game;
let principal;
let enemigos = []; 
let velocidaEstandarEnemigo = 1;
let velocidadEnemigo = 1;
let velocidadPrincipal = 4; 
let Background;
let Cars;
let Fondo;
let Laterales = 137;
let PosicionFinalAncho = renderer.width - (Laterales + 40);
let PosicionFinal;
let consecutivoEnemigos = 0;
let activeVelocidad = false;
let totalPasaCars = 0;
let nivel = 0;
let puntos = 0;
let puntoAdicional = 0;

loader.add("pista", "assets/img/pista.jpg")
    .add("cars", "assets/img/cars.png");
loader.load();
loader.onError.add((e, d) => {
    console.log(e, d);
});
loader.onLoad.add((e, p) => {
    console.log(p.progressChunk);
});

loader.onComplete.add((loader, resources) => {
    Background = resources["pista"].texture;
    Cars = resources["cars"].texture;    
})


function init(){
    enemigos = []; 
    velocidaEstandarEnemigo = 1;
    velocidadEnemigo = 1;
    velocidadPrincipal = 4;
    consecutivoEnemigos = 0;
    activeVelocidad = false;
    totalPasaCars = 0;
    nivel = 0;
    puntos = 0;
    puntoAdicional = 0;

    game = new Application({ width: width, height: heightWindow });
    game.renderer.backgroundColor = 0x061639;
    game.renderer.autoRezise = true;
    document.getElementById("juego").appendChild(game.view);
    setup();
}

function setup(delta) {
    Fondo = util.tilingSprite(Background, renderer.width, renderer.height, 0, 0);
    Fondo.tileY = 0;
    game.stage.addChild(Fondo);

    principal = jugador();
    game.stage.addChild(principal);

    let left = keyboard("ArrowLeft"),
        right = keyboard("ArrowRight");
    down = keyboard("ArrowDown");
    left.press = () => {
        principal.vx = -velocidadPrincipal;
        principal.vy = 0;
        PosicionFinal = Laterales;
    }
    left.release = () => {
        principal.vx = 0;
        principal.vy = 0;
    }
    right.press = () => {
        principal.vx = velocidadPrincipal;
        principal.vy = 0;
        PosicionFinal = PosicionFinalAncho;
    }
    right.release = () => {
        principal.vx = 0;
        principal.vy = 0;
    }
    down.press = () => {
        activeVelocidad = true;        
    }
    down.release = () => {
        activeVelocidad = false;        
    }
    state = play;

    game.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) { 
    game.stage.addChild(boots()); 
    for (let index = 1; index < enemigos.length; index++) {
        enemigos[index].vy = enemigos[index].vy + velocidadEnemigo;
        enemigos[index].y = enemigos[index].vy;
        if(enemigos[index].y > heightWindow && !enemigos[index].paso){
            enemigos[index].paso = true;
            totalPasaCars++; 
            puntos += (5 + puntoAdicional);
            document.querySelector(".puntos").innerHTML = puntos;
            if(totalPasaCars==5){
                nivel++;                
                document.querySelector(".nivel").innerHTML = nivel;
                velocidaEstandarEnemigo += 0.5;
                totalPasaCars=0;
            }
        }
    }
    Fondo.tileY -= 0.5 * velocidadEnemigo;
    state(delta);
}

function play(delta) {
    if (principal.x >= Laterales && principal.x <= PosicionFinalAncho) {
        principal.x += principal.vx;
        principal.y += principal.vy;
    } else {
        principal.x = PosicionFinal;
    }

    if(activeVelocidad){
        puntoAdicional = 20;
        velocidadEnemigo = velocidaEstandarEnemigo + 10; 
    } else{
        puntoAdicional = 0;
        velocidadEnemigo = velocidaEstandarEnemigo; 
    }


    for (let index = 1; index < enemigos.length; index++) {
        if (hitTestRectangle(enemigos[index], principal)) {
            gameOver();
        }
        else {

        }
    }
}


function iniciaGame(){
    document.querySelector(".puntos").innerHTML = 0;
    document.querySelector(".nivel").innerHTML = 0;
    document.querySelector(".pantalla").classList.add("active");
    init();
}

function gameOver(){ 
    game.stop();    
    document.querySelector(".pantalla").classList.remove("active");
    document.querySelector(".pantalla h1").innerHTML = "Intentalo de nuevo";
    setTimeout(() => {
        document.querySelector("canvas").remove();
    }, 1000);
}