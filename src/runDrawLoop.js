import { Application, Sprite, Rectangle, settings, SCALE_MODES } from "pixi.js";
import red from "./sprites/red.png";
import bedroom from "./sprites/bedroom.png";
import resize from "./resize";

settings.SCALE_MODE = SCALE_MODES.NEAREST;

export default function runDrawLoop(gameState)
{
    const app = new Application({
        width: gameState.world.size.width,
        height: gameState.world.size.height,
        antialias: true,
    });
    resize(app);
    window.addEventListener("resize", () => resize(app));
    app.loader
        .add(red)
        .add(bedroom)
        .load(() => {
            document.body.appendChild(app.view);
            app.ticker.add(() => draw(app.ticker.deltaMS, gameState, app));
        }
    );
}

function draw(delta, gameState, app)
{
    if(!app.stage.getChildByName('bedroom'))
    {
        const bedroomTexture = app.loader.resources[bedroom].texture;
        const bedroomSprite = new Sprite(bedroomTexture);
        bedroomSprite.name = 'bedroom';
        bedroomSprite.x = 64;
        bedroomSprite.y = 64;
        app.stage.addChild(bedroomSprite);
    }
    let player = app.stage.getChildByName('player');
    if(!player)
    {
        const playerTexture = app.loader.resources[red].texture;
        playerTexture.frame = new Rectangle(14, 0, 14, 16);
        player = new Sprite(playerTexture);
        player.name = 'player';
        app.stage.addChild(player);
    }
    let targetFrameY;
    switch (gameState.player.direction.direction) {
        case "down":
            targetFrameY = 0;
            break;
        case "left":
            targetFrameY = 16;
            break;
        case "right":
            targetFrameY = 32;
            break;
        case "up":
            targetFrameY = 48;
            break;
    }

    const walkingAnimation = [28, 14, 0, 14];
    let targetFrameX = walkingAnimation[
        Math.floor(
            ((gameState.player.timeSpentWalking.timeSpentWalking + 950) % 1000) / 250
        )
    ];
    if(targetFrameY !== player.texture.frame.y ||
        targetFrameX !== player.texture.frame.x)
    {
        player.texture.frame.y = targetFrameY;
        player.texture.frame.x = targetFrameX;
        player.texture.update();
    }
    player.x = gameState.player.position.x;
    player.y = gameState.player.position.y;
}