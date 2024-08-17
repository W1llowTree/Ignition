import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import {clickCount} from './UpgradeScreen';

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
        /*
        this.load.image('tiles', 'assets/world_tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/TileMap.json');
        */
    }

    create () {   
        // initializations
        
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        

        //platforms
        this.map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('world_tileset', 'tiles')
        const backgroundLayer = map.createLayer('background', tileset, 0, 0);
        const groundLayer = map.createLayer('ground', tileset, 0, 0);
        const goalLayer = map.createLayer('goal', tileset, 0, 0);

        const camera = this.cameras.main;
        groundLayer.setCollisionByProperty({collide: true});
        this.physics.add.collider(this.player, groundLayer);
        
        // this.plat = 'ground';
        // this.platforms = this.physics.add.staticGroup();
        // this.platforms.create(400, 568, this.plat).setScale(2).refreshBody();
        // this.platforms.create(600, 400, this.plat);
        // this.platforms.create(50, 250,this.plat);
        // this.platforms.create(750, 220,this.plat);
        
        //player
        // sprite sheet will wait 
        this.avatar = 'player';
        this.jumpHeight = 310;
        this.maxStamina = 100;
        this.stamina = this.maxStamina;
        this.staminaInc = 1;
        this.staminaDec = 1;
        this.rest=false;
        
      
        this.player = this.physics.add.sprite(200, 200,this.avatar);
        this.player.setScale(0.5).refreshBody();
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(300);
        this.physics.add.collider(this.player, this.platforms);

        
        
        

        EventBus.emit('current-scene-ready', this);
    }
    
    update () {
        if (!this.rest && this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.stamina-=this.staminaDec;
            
        }
        else if (!this.rest && this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.stamina -= this.staminaDec;
        } 
        else if (this.player.body.touching.down) {
            this.player.setVelocityX(0);
            this.stamina += this.staminaInc;
        }

        this.stamina=Math.min(this.stamina, this.maxStamina);

        if (this.stamina <= 1) { // run out of stamina
            this.rest=true;
        }
        if (this.stamina == this.maxStamina) {
            this.rest = false;//recharged
        }
      
        if (this.rest) this.forceRest();
        
        
        if (this.stamina >= 50 && this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.stamina-=50;
            this.player.setVelocityY(-this.jumpHeight);
        }

        this.add.text(512, 460, this.stamina, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);



        
        

        this.jumpHeight = this.jumpHeight+clickCount;
    }

    forceRest() {
        this.player.setVelocityX(0);
        if (this.player.body.touching.down)this.stamina+=this.staminaInc;
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
