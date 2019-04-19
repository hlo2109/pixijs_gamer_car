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

let game = new Application({ width: width, height: heightWindow });
game.renderer.backgroundColor = 0x061639;
game.renderer.autoRezise = true;
document.getElementById("juego").appendChild(game.view);

let principal;
let enemigos = [];
let velocidadGeneraEnemigo = 100;
let cuentaInfinita = 0;
let velocidaEstandarEnemigo = 1;
let velocidadEnemigo = 1;
let velocidadPrincipal = 4;
// Nuevas
let Background;
let Cars;
let Fondo;
let Laterales = 137;
let PosicionFinalAncho = renderer.width - (Laterales + 40);
let PosicionFinal;

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
    setup();
})


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

function gameLoop(delta) {
    cuentaInfinita++;
    if ((cuentaInfinita % velocidadGeneraEnemigo) == 0) {
        game.stage.addChild(boots());
    }
    for (let index = 1; index < enemigos.length; index++) {
        enemigos[index].vy = enemigos[index].vy + velocidadEnemigo;
        enemigos[index].y = enemigos[index].vy;
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

    for (let index = 1; index < enemigos.length; index++) {
        if (hitTestRectangle(enemigos[index], principal)) {
            game.stop();
        }
        else {

        }
    }
}