document.addEventListener('DOMContentLoaded', function() {
    // --- Animación de Escritura del Encabezado ---
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const text = "Fernando Acosta Franco";
        let index = 0;

        function type() {
            if (index < text.length) {
                heroTitle.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 150);
            } else {
                heroTitle.style.borderRight = '0.15em solid #00ff9b';
                setInterval(() => {
                    heroTitle.style.borderRightColor = heroTitle.style.borderRightColor === 'transparent' ? '#00ff9b' : 'transparent';
                }, 500);
            }
        }
        setTimeout(type, 500);
    }

    // --- Animación de Scroll con Intersection Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('section, .project-card, .experience-card, .freelance-card');
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Lógica del Juego de la Viborita (Snake) con Estados ---
    const canvas = document.getElementById('snake-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const startButton = document.getElementById('start-button');
        const retryButton = document.getElementById('retry-button');
        const gameOverlay = document.getElementById('game-overlay');

        const gridSize = 20;
        const canvasSize = canvas.width / gridSize;

        let snake, food, score, direction, gameLoopInterval, changingDirection;

        function resetGame() {
            snake = [{ x: 10, y: 10 }];
            food = {};
            score = 0;
            direction = 'right';
            changingDirection = false;
            scoreElement.textContent = score;
            placeFood();
            draw();
        }

        function startGame() {
            resetGame();
            gameOverlay.style.display = 'none';
            document.addEventListener('keydown', handleKeyPress);
            gameLoopInterval = setInterval(mainGameLoop, 120);
        }

        function placeFood() {
            food = {
                x: Math.floor(Math.random() * canvasSize),
                y: Math.floor(Math.random() * canvasSize)
            };
            snake.forEach(part => {
                if (part.x === food.x && part.y === food.y) {
                    placeFood();
                }
            });
        }

        function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff9b';
            snake.forEach(part => {
                ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
            });
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        }

        function advanceSnake() {
            const head = { x: snake[0].x, y: snake[0].y };
            switch (direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }
            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreElement.textContent = score;
                placeFood();
            } else {
                snake.pop();
            }
        }

        function checkCollision() {
            const head = snake[0];
            if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
                return true;
            }
            for (let i = 4; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    return true;
                }
            }
            return false;
        }

        function handleGameOver() {
            clearInterval(gameLoopInterval);
            document.removeEventListener('keydown', handleKeyPress);
            gameOverlay.style.display = 'flex';
            retryButton.style.display = 'block';
            startButton.style.display = 'none';
        }

        function mainGameLoop() {
            if (changingDirection) return;
            if (checkCollision()) {
                handleGameOver();
                return;
            }
            advanceSnake();
            draw();
        }

        function handleKeyPress(event) {
            const keyPressed = event.key;
            const goingUp = direction === 'up';
            const goingDown = direction === 'down';
            const goingLeft = direction === 'left';
            const goingRight = direction === 'right';

            if (changingDirection) return;
            changingDirection = true;

            if ((keyPressed === 'ArrowLeft' || keyPressed.toLowerCase() === 'a') && !goingRight) direction = 'left';
            else if ((keyPressed === 'ArrowUp' || keyPressed.toLowerCase() === 'w') && !goingDown) direction = 'up';
            else if ((keyPressed === 'ArrowRight' || keyPressed.toLowerCase() === 'd') && !goingLeft) direction = 'right';
            else if ((keyPressed === 'ArrowDown' || keyPressed.toLowerCase() === 's') && !goingUp) direction = 'down';
            
            setTimeout(() => { changingDirection = false; }, 50);
        }

        function initGame() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            gameOverlay.style.display = 'flex';
            startButton.style.display = 'block';
            retryButton.style.display = 'none';
        }

        startButton.addEventListener('click', startGame);
        retryButton.addEventListener('click', startGame);

        initGame();
    }
});