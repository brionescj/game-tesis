import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const Game = () => {
  const gameContainer = useRef(null);
  const recentPositions = useRef([]);
  const lastArrayUsed = useRef(null);
  const lastPositionUsed = useRef(null);
  const lemurEvent = useRef(null);
  const elapsedTime = useRef(0);
  const currentDelay = useRef(3600);
  const currentDuration = useRef(2600);
  const currentHold = useRef(1500);
  const gameStarted = useRef(false);
  const gameEnded = useRef(false);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameContainer.current,
      scene: {
        preload,
        create,
        update
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('background', './public/assets/back.jpg');
      this.load.image('arbol', './public/assets/arbol3.png');
      this.load.image('arbol2', './public/assets/arbol4.png');
      this.load.image('jirafa', './public/assets/jirafaa.png');
      this.load.image('lemur', './public/assets/lemur.png');
      this.load.image('piedra', './public/assets/piedra.png');
      this.load.image('rinoceronte', './public/assets/rinoceronte.png');
      this.load.image('elefante', './public/assets/elefante.png');
      this.load.image('playButton', './public/assets/play.png'); // Cargar la imagen del botón de jugar
      this.load.image('gameOver', './public/assets/endgame.png'); // Cargar la imagen de juego finalizado
    }

    function create() {
      this.add.image(512, 384, 'background').setDepth(0);

      const arbol = this.add.sprite(100, 250, 'arbol').setScale(0.3).setAngle(-2).setDisplaySize(500, 600).setDepth(0).setInteractive(this.input.makePixelPerfect(100));
      const arbol2 = this.add.sprite(800, 200, 'arbol2').setScale(0.3).setAngle(-2).setDisplaySize(900, 800).setDepth(0).setInteractive(this.input.makePixelPerfect(100));
      const jirafa = this.add.sprite(300, 300, 'jirafa').setScale(0.3).setAngle(-2).setDisplaySize(500, 600).setDepth(2).setInteractive(this.input.makePixelPerfect(100));
      const piedra = this.add.sprite(956, 675, 'piedra').setScale(0.1).setAngle(0).setDepth(2).setInteractive(this.input.makePixelPerfect(100));
      const rinoceronte = this.add.sprite(120, 730, 'rinoceronte').setScale(0.3).setAngle(-5).setDisplaySize(700, 400).setDepth(2).setInteractive(this.input.makePixelPerfect(100));
      const elefante = this.add.sprite(660, 380, 'elefante').setScale(0.3).setAngle(0).setDisplaySize(700, 400).setDepth(2).setInteractive(this.input.makePixelPerfect(100));

      const playButton = this.add.sprite(512, 384, 'playButton').setInteractive().setDepth(5).setScale(0.3).setInteractive(this.input.makePixelPerfect(100));
      const gameOverImage = this.add.sprite(512, 150, 'gameOver').setDepth(5).setScale(0.4).setVisible(false);
      const restartButton = this.add.sprite(512, 480, 'playButton').setInteractive().setDepth(5).setDisplaySize(200, 200).setVisible(false);

      playButton.on('pointerdown', () => {
        if (!gameStarted.current) {
          gameStarted.current = true;
          startGame();
          playButton.destroy();
        }
      });

      restartButton.on('pointerdown', () => {
        if (gameEnded.current) {
          gameEnded.current = false;
          gameOverImage.setVisible(false);
          restartButton.setVisible(false);
          startGame();
        }
      });

      const elefantePositions = [
        {
          startX: 640,
          startY: 280,
          endX: 640,
          endY: 180,
          angle: 0,
          scale: 0.2
        },
        {
          startX: 540,
          startY: 300,
          endX: 500,
          endY: 195,
          angle: -22,
          scale: 0.2
        },
        {
          startX: 770,
          startY: 280,
          endX: 810,
          endY: 185,
          angle: 15,
          scale: 0.2
        },
        {
          startX: 780,
          startY: 377,
          endX: 870,
          endY: 377,
          angle: 90,
          scale: 0.2
        },
        {
          startX: 770,
          startY: 500,
          endX: 840,
          endY: 500,
          angle: 90,
          scale: 0.2
        },
        {
          startX: 600,
          startY: 500,
          endX: 524,
          endY: 500,
          angle: -90,
          scale: 0.2
        }
      ];

      const piedraPositions = [
        {
          startX: 840,
          startY: 700,
          endX: 790,
          endY: 680,
          angle: -60,
          scale: 0.2
        },
        {
          startX: 860,
          startY: 650,
          endX: 825,
          endY: 605,
          angle: -45,
          scale: 0.2
        },
        {
          startX: 1000,
          startY: 550,
          endX: 970,
          endY: 490,
          angle: -45,
          scale: 0.2
        }
      ];

      const rinocerontePositions = [
        {
          startX: 600,
          startY: 500,
          endX: 524,
          endY: 500,
          angle: -90,
          scale: 0.2
        },
        {
          startX: 50,
          startY: 632,
          endX: 50,
          endY: 530,
          angle: 0,
          scale: 0.2
        },
        {
          startX: 380,
          startY: 670,
          endX: 484,
          endY: 670,
          angle: 90,
          scale: 0.2
        }
      ];

      const jirafaPositions = [
        {
          startX: 250,
          startY: 300,
          endX: 217,
          endY: 250,
          angle: -48,
          scale: 0.2
        },
        {
          startX: 275,
          startY: 330,
          endX: 180,
          endY: 330,
          angle: -85,
          scale: 0.2
        },
        {
          startX: 325,
          startY: 300,
          endX: 400,
          endY: 270,
          angle: 70,
          scale: 0.2
        }
      ];

      this.lemurs = Array.from({ length: 15 }, () => {
        const lemur = this.add.sprite(0, 0, 'lemur').setInteractive().setScale(0.2);
        lemur.visible = false;
        lemur.setDepth(1);
        lemur.on('pointerdown', () => {
          if (!gameEnded.current) {
            lemur.visible = false;
            lemur.active = false;
          }
        });
        return lemur;
      });

      const allPositions = {
        elefante: elefantePositions,
        piedra: piedraPositions,
        rinoceronte: rinocerontePositions,
        jirafa: jirafaPositions
      };

      this.add.rectangle(245, 20, 400, 20, 0x57865F).setOrigin(0.5, 0).setDepth(3);
      const timeBar = this.add.rectangle(245, 20, 400, 20, 0x158027).setOrigin(0.5, 0).setDepth(3);

      const totalTime = 5 * 60 * 1000; // 5 minutos en milisegundos

      const createLemurEvent = () => {
        if (gameEnded.current) return;

        const availableLemurs = this.lemurs.filter(l => l.visible === false && l.active !== false);
        if (availableLemurs.length === 0) {
          this.lemurs.forEach(l => l.active = true);
          return;
        }

        const lemur = Phaser.Utils.Array.GetRandom(availableLemurs);

        let position;
        let selectedArray;
        let attempts = 0;

        let allowedArrays = Object.keys(allPositions);
        if (lastArrayUsed.current === 'elefante') {
          allowedArrays = allowedArrays.filter(key => key !== 'elefante');
        }

        do {
          selectedArray = Phaser.Utils.Array.GetRandom(allowedArrays);
          position = Phaser.Utils.Array.GetRandom(allPositions[selectedArray]);
          attempts++;
        } while ((recentPositions.current.includes(position) || position === lastPositionUsed.current) && attempts < 100);

        recentPositions.current.push(position);
        if (recentPositions.current.length > 3) {
          recentPositions.current.shift();
        }

        lastArrayUsed.current = selectedArray;
        lastPositionUsed.current = position;

        lemur.setPosition(position.startX, position.startY);
        lemur.setAngle(position.angle);
        lemur.setScale(position.scale);
        lemur.setDepth(2);
        lemur.visible = true;

        this.tweens.add({
          targets: lemur,
          x: position.endX,
          y: position.endY,
          ease: 'Power1',
          duration: currentDuration.current,
          yoyo: true,
          hold: currentHold.current,
          onYoyo: () => {
            if (lemur.active && !gameEnded.current) {
              lemur.visible = true;
            }
          },
          onComplete: () => {
            lemur.setPosition(position.startX, position.startY);
            lemur.setAngle(position.angle);
            lemur.setScale(position.scale);
            lemur.visible = false;
            lemur.active = true;
          }
        });
      };

      const startGame = () => {
        elapsedTime.current = 0;
        currentDelay.current = 3600;
        currentDuration.current = 2600;
        currentHold.current = 1500;
        gameEnded.current = false;

        lemurEvent.current = this.time.addEvent({
          delay: currentDelay.current,
          callback: createLemurEvent,
          loop: true
        });

        this.time.addEvent({
          delay: 100,
          callback: () => {
            elapsedTime.current += 100;
            const timeRatio = elapsedTime.current / totalTime;
            timeBar.width = 400 * (1 - timeRatio); // Mantener el tamaño de la barra

            if (elapsedTime.current >= totalTime) {
              this.time.removeAllEvents();
              endGame(); // Terminar el juego cuando se acabe el tiempo
            }
          },
          loop: true
        });

        this.time.addEvent({
          delay: 25000, // 20 segundos
          callback: () => {
            currentDelay.current = Math.max(currentDelay.current - 200, 200);
            currentDuration.current = Math.max(currentDuration.current - 200, 800);
            currentHold.current = Math.max(currentHold.current - 100, 400);

            if (lemurEvent.current) {
              lemurEvent.current.remove();
            }

            lemurEvent.current = this.time.addEvent({
              delay: currentDelay.current,
              callback: createLemurEvent,
              loop: true
            });
          },
          loop: true
        });
      };

      const endGame = () => {
        gameEnded.current = true;
        gameOverImage.setVisible(true);
        restartButton.setVisible(true);
        this.lemurs.forEach(lemur => {
          lemur.visible = false; // Ocultar todos los lemures
        });
      };
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} style={{ width: '1024px', height: '768px' }} />;
};

export default Game;
