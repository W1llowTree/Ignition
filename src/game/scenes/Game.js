import { EventBus } from '../EventBus';
import { Display, Scene } from 'phaser';
import {clickCount} from './UpgradeScreen';
import {clickCount2} from './UpgradeScreen';
import {TextButton} from '../TextButton';
// what is this dasdasdsaasd
// pls move to inside the class
// why
// its so cursed
// this is how you code in pascal





export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        
        this.load.image('Tileset', 'assets/tilemap/world_tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemap/TileMap.json');

        // Animations
        // Texture
        this.load.image('knight', 'assets/sprites/hero.png');
        this.load.atlas('a-knight', 'assets/sprites/knight.png', 'assets/sprites/knight.json');
    }

    create () {   
        // initializations
        // Animations
        this.anims.create({
            key: 'idle',
            frameRate: 12,
            frames: this.anims.generateFrameNames('a-knight', {
                prefix: "idle",
                suffix: ".png",
                start: 1,
                end: 4,
            }),
            repeat:-1,
        })
        this.anims.create({
            key: 'run',
            frameRate: 12,
            frames: this.anims.generateFrameNames('a-knight', {
                prefix: "run",
                suffix: ".png",
                start: 1,
                end: 16,
            }),
            repeat:-1,
        })

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, 64*30, 64*20);
        this.physics.world.setBounds(0, 0, 64*30, 64*20); // Make bounds responsive
        

        //platforms
        this.map = this.make.tilemap({key: 'map'});
        const tileset = this.map.addTilesetImage('Tileset');
        const backgroundLayer = this.map.createLayer('background', tileset, 0, 0);
        const groundLayer = this.map.createLayer('ground', tileset, 0, 0);
        //const goalLayer = this.map.createLayer('goal', tileset, 0, 0);

        const camera = this.cameras.main;
        groundLayer.setCollisionByProperty({collide: true});
        
        
        // this.plat = 'ground';
        // this.platforms = this.physics.add.staticGroup();
        // this.platforms.create(400, 568, this.plat).setScale(2).refreshBody();
        // this.platforms.create(600, 400, this.plat);
        // this.platforms.create(50, 250,this.plat);
        // this.platforms.create(750, 220,this.plat);
        
        //player

        this.jumpHeight = 310+30*clickCount;
        this.maxStamina = 100+30*clickCount2;
        this.stamina = this.maxStamina;
        this.staminaInc = 1+0.1*clickCount2;
        this.staminaDec = 1;
        this.rest=false;
        
      
        this.player = this.physics.add.sprite(200, 200, 'a-knight');
        this.player.setScale(0.5).refreshBody();
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(300);
        this.physics.add.collider(this.player, groundLayer);
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa, alpha: 0.6 }, fillStyle: { color: 0x00aa00, alpha: 0.7 } });


        // make menu relative to player!!!
        this.menuButton = new TextButton(this, 912, 41, 'MENU', {fill: '#0f0',  fontSize: 20,stroke: '#000000', strokeThickness: 8}, () => this.goToMenu());
        this.wood=this.add.image(940, 20, 'wood').setScale(0.3);
        this.add.existing(this.menuButton);
        this.wood.setScrollFactor(0);
        this.menuButton.setScrollFactor(0);
        
        
       

        // Camera
        // this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        this.cameras.main.startFollow(this.player);


        EventBus.emit('current-scene-ready', this);
    }
    
    update () {

        if (!this.rest && this.cursors.left.isDown)
        {   
            this.player.setFlipX(true);
            this.player.setVelocityX(-160);
            this.stamina-=this.staminaDec;
            this.player.anims.play('run', true);
        }
        else if (!this.rest && this.cursors.right.isDown)
        {
            this.player.setFlipX(false);
            this.player.setVelocityX(160);
            this.stamina -= this.staminaDec;
            this.player.anims.play('run', true);
        } 
        else if (this.player.body.blocked.down) {
            this.player.setVelocityX(0);
            this.stamina += this.staminaInc;
            this.player.anims.play('idle', true);
        }

        this.stamina=Math.min(this.stamina, this.maxStamina);

        if (this.stamina <= 0) { // run out of stamina
            this.rest=true;
        }
        if (this.stamina == this.maxStamina) {
            this.rest = false;//recharged
        }
      
        if (this.rest) this.forceRest();
        
        
        if (this.stamina >= 50 && this.cursors.up.isDown && this.player.body.blocked.down)
        {
            this.stamina-=50;
            this.player.setVelocityY(-this.jumpHeight);
        }


        /*
        this.add.text(512, 460, this.stamina, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        
       console.log(this.player.body.blocked.down);
       */

        

        // drawing stamina bar
        this.rect1 = new Phaser.Geom.Rectangle(this.player.x-24, this.player.y-50, (this.stamina*50)/this.maxStamina, 10);
        this.graphics.clear();
        this.graphics.strokeRectShape(this.rect1);
        this.graphics.fillRectShape(this.rect1);

    
    }

    forceRest() {
        this.player.setVelocityX(0);
        if (this.player.body.blocked.down) {
            this.stamina+=this.staminaInc;
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
    goToMenu() {
        this.scene.start('Menu');
    }
}
