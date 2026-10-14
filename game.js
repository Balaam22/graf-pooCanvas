// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false, color = 'white') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 6;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        // Generar 5 pelotas con diferentes tamaños, colores y velocidades (similares a la referencia)
        this.balls = [
            new Ball(canvas.width / 2 - 50, canvas.height / 2 - 100, 6, 3, 2, 'orange'),
            new Ball(canvas.width / 2, canvas.height / 2 - 50, 10, -4, 3, 'blue'),
            new Ball(canvas.width / 2 + 100, canvas.height / 2 + 100, 14, 2, -4, 'gray'),
            new Ball(canvas.width / 2 - 150, canvas.height / 2 + 80, 8, -3, -3, 'cyan'),
            new Ball(canvas.width / 2 + 50, canvas.height / 2 + 150, 4, 4, 4, 'white')
        ];

        // Paleta del jugador (izquierda): Color verde, el doble de alto (200px en lugar de 100px)
        this.paddle1 = new Paddle(20, canvas.height / 2 - 100, 10, 200, true, 'green');
        
        // Paleta de la CPU (derecha): Color rojo, altura estándar (100px)
        this.paddle2 = new Paddle(canvas.width - 30, canvas.height / 2 - 50, 10, 100, false, 'red');
        
        this.keys = {};
        this.handleInput();
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar cada una de las 5 pelotas
        this.balls.forEach(ball => ball.draw());

        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Actualizar el movimiento y colisiones para cada pelota
        this.balls.forEach(ball => {
            ball.move();

            // Colisión con la paleta del jugador (Izquierda)
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            // Colisión con la paleta de la CPU (Derecha)
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Si la pelota sale por los extremos laterales, se reinicia al centro
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });

        // Controles de teclado para la paleta del jugador (Flecha Arriba / Flecha Abajo)
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento automático de la paleta de la CPU siguiendo la primera pelota
        this.paddle2.autoMove(this.balls[0]);
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Inicializar y ejecutar el juego
const game = new Game();
game.run();