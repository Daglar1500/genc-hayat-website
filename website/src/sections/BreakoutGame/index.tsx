import React, { useEffect, useRef, useState } from "react";

export const BreakoutGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'countdown' | 'waiting'>('waiting');
  const [countdown, setCountdown] = useState(3);

  // Store mutable game data in a ref to persist across renders/state changes
  const gameDataRef = useRef({
    lives: 3,
    score: 0,
    bricks: [] as { x: number; y: number; status: number }[][],
    ball: { x: 0, y: 0, dx: 0, dy: 0, speed: 6 },
    paddleX: 0,
    countdownOpacity: 1 // FIX: To handle the fade out of number 0
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Responsive canvas sizing
    const updateCanvasSize = () => {
      const maxWidth = Math.min(window.innerWidth * 0.9, 800);
      const maxHeight = Math.min(window.innerHeight * 0.8, 600);
      canvas.width = maxWidth;
      canvas.height = maxHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // ---- Styling ----
    const bgColor = "#1a1a1a";
    const scoreColor = "#ffa500";

    // ---- Game constants ----
    const ballRadius = 4;
    const paddleWidth = Math.floor(canvas.width * 0.12);
    const paddleHeight = Math.round((paddleWidth / 33) * 7);

    // Brick Calculation
    const brickRowCount = 6;
    const brickColumnCount = 10;
    const brickPixelWidth = 26;
    const brickPixelHeight = 6;
    const brickWidth = Math.floor(canvas.width * 0.08);
    const brickHeight = Math.floor(brickWidth * (brickPixelHeight / brickPixelWidth));
    const brickPadding = Math.floor(brickWidth * 0.04);
    const brickOffsetTop = Math.floor(canvas.height * 0.1);
    const brickOffsetLeft = Math.floor((canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2);

    // Initialize bricks ONLY if they are empty
    if (gameDataRef.current.bricks.length === 0) {
      for (let c = 0; c < brickColumnCount; c++) {
        gameDataRef.current.bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          gameDataRef.current.bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    }

    let animationId: number;
    let rightPressed = false;
    let leftPressed = false;

    // ---- PIXEL ART ARRAYS (Placeholders) ----
    const paddle_pixels: (string | [number, number, number])[][] = [
      ["empty","empty",[255,161,51],[255,161,51],[255,161,51],"empty"].concat(Array(21).fill([102,102,102])).concat(["empty",[255,161,51],[255,161,51],[255,161,51],"empty","empty"]),
      ["empty",[255,161,51],[255,255,255],[255,255,255],[255,255,255],"empty"].concat(Array(21).fill([164,164,164])).concat(["empty",[255,255,255],[255,255,255],[255,255,255],[255,161,51],"empty"]),
      [[255,161,51],[255,255,255],[255,161,51],[255,161,51],[255,161,51],"empty"].concat(Array(21).fill([102,102,102])).concat(["empty",[255,161,51],[255,161,51],[255,161,51],[255,255,255],[255,161,51]]),
      Array(5).fill([255,161,51]).concat(["empty"]).concat(Array(21).fill([102,102,102])).concat(["empty"]).concat(Array(5).fill([255,161,51])),
      Array(5).fill([255,161,51]).concat(["empty"]).concat(Array(21).fill([102,102,102])).concat(["empty"]).concat(Array(5).fill([255,161,51])),
      ["empty",[255,161,51],[255,161,51],[255,161,51],[255,161,51],"empty"].concat(Array(21).fill([102,102,102])).concat(["empty",[255,161,51],[255,161,51],[255,161,51],[255,161,51],"empty"]),
      ["empty","empty",[228,123,26],[228,123,26],[228,123,26],"empty"].concat(Array(21).fill([51,51,51])).concat(["empty",[228,123,26],[228,123,26],[228,123,26],"empty","empty"]),
    ];

    const ball_pixels: (string | [number, number, number])[][] = [
      ["empty", "empty", [255,161,51], [255,161,51], [255,161,51], "empty", "empty"],
      ["empty", [255,161,51], [255,255,255], [255,255,255], [255,161,51], [255,161,51], "empty"],
      [[255,161,51], [255,255,255], [255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51]],
      [[255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51]],
      [[255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51]],
      ["empty", [255,161,51], [255,161,51], [255,161,51], [255,161,51], [255,161,51], "empty"],
      ["empty", "empty", [228,123,26], [228,123,26], [228,123,26], "empty", "empty"]
    ];

    const brick_pixels: (string | [number, number, number])[][] = [
      Array(25).fill([164,164,164]).concat([[51,51,51]]),
      [[164,164,164]].concat(Array(24).fill([102,102,102])).concat([[51,51,51]]),
      [[164,164,164]].concat(Array(24).fill([102,102,102])).concat([[51,51,51]]),
      [[164,164,164]].concat(Array(24).fill([102,102,102])).concat([[51,51,51]]),
      [[164,164,164]].concat(Array(24).fill([102,102,102])).concat([[51,51,51]]),
      Array(26).fill([51,51,51])
    ];

    const normalizeVelocity = (vx: number, vy: number, speed: number) => {
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      return {
        dx: (vx / magnitude) * speed,
        dy: (vy / magnitude) * speed
      };
    };

    const resetBall = () => {
      gameDataRef.current.ball.x = canvas.width / 2;
      gameDataRef.current.ball.y = canvas.height * 0.6;
      gameDataRef.current.paddleX = (canvas.width - paddleWidth) / 2;
      
      const angle = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 60) * Math.PI / 180;
      const velocity = normalizeVelocity(Math.sin(angle), Math.cos(angle), gameDataRef.current.ball.speed);
      gameDataRef.current.ball.dx = velocity.dx;
      gameDataRef.current.ball.dy = velocity.dy;
    };

    const startCountdown = () => {
      // FIX: Reset transparency for the fade-out
      gameDataRef.current.countdownOpacity = 1; 
      
      // FIX: Ensure ball is reset to center instantly when countdown starts
      resetBall(); 

      setGameState('countdown');
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          // FIX: Stop interval when we reach 0, but don't start game yet. 
          // The draw loop handles the 0 fade out.
          if (prev <= 0) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const restartGame = () => {
      gameDataRef.current.score = 0;
      gameDataRef.current.lives = 3;
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          gameDataRef.current.bricks[c][r].status = 1;
        }
      }
      setGameState('waiting');
    };

    const handleGameOverDisplay = () => {
        setTimeout(() => {
            restartGame();
        }, 3000);
    };

    // ---- Event handlers ----
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };
    
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };
    
    const mouseMoveHandler = (e: MouseEvent) => {
      if (gameState === 'playing' || gameState === 'waiting' || gameState === 'countdown') {
        const relativeX = e.clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < canvas.width) {
          gameDataRef.current.paddleX = Math.max(0, Math.min(relativeX - paddleWidth / 2, canvas.width - paddleWidth));
        }
      }
    };

    const clickHandler = () => {
      if (gameState === 'waiting') {
        startCountdown();
      }
    };

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    canvas.addEventListener("click", clickHandler, false);

    const collisionDetection = () => {
      const { x, y } = gameDataRef.current.ball;
      
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = gameDataRef.current.bricks[c][r];
          if (b.status === 1) {
            if (
              x + ballRadius > b.x &&
              x - ballRadius < b.x + brickWidth &&
              y + ballRadius > b.y &&
              y - ballRadius < b.y + brickHeight
            ) {
              const velocity = normalizeVelocity(gameDataRef.current.ball.dx, -gameDataRef.current.ball.dy, gameDataRef.current.ball.speed);
              gameDataRef.current.ball.dx = velocity.dx;
              gameDataRef.current.ball.dy = velocity.dy;
              b.status = 0;
              gameDataRef.current.score++;
              
              if (gameDataRef.current.score === brickRowCount * brickColumnCount) {
                setGameState('won');
                return;
              }
            }
          }
        }
      }
    };

    const drawPixelArt = (pixels: (string | [number, number, number])[][], startX: number, startY: number, pixelWidth: number, pixelHeight: number, opacity: number = 1) => {
      for (let row = 0; row < pixels.length; row++) {
        for (let col = 0; col < pixels[row].length; col++) {
          const pixel = pixels[row][col];
          if (pixel !== "empty") {
            const [r, g, b] = pixel as [number, number, number];
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fillRect(
              Math.floor(startX + col * pixelWidth),
              Math.floor(startY + row * pixelHeight),
              Math.ceil(pixelWidth),
              Math.ceil(pixelHeight)
            );
          }
        }
      }
    };

    const drawBall = () => {
      const pixelSize = Math.max(2, Math.floor(canvas.width / 400));
      const ballDisplaySize = 7 * pixelSize;
      drawPixelArt(ball_pixels, gameDataRef.current.ball.x - ballDisplaySize / 2, gameDataRef.current.ball.y - ballDisplaySize / 2, pixelSize, pixelSize);
    };

    const drawPaddle = () => {
      const pixelWidth = paddleWidth / paddle_pixels[0].length;
      const pixelHeight = paddleHeight / paddle_pixels.length;
      const paddleY = canvas.height - paddleHeight - 20;
      drawPixelArt(paddle_pixels, gameDataRef.current.paddleX, paddleY, pixelWidth, pixelHeight);
    };

    const drawBricks = () => {
      const pixelWidth = brickWidth / brick_pixels[0].length;
      const pixelHeight = brickHeight / brick_pixels.length;
      
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (gameDataRef.current.bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            gameDataRef.current.bricks[c][r].x = brickX;
            gameDataRef.current.bricks[c][r].y = brickY;
            drawPixelArt(brick_pixels, brickX, brickY, pixelWidth, pixelHeight);
          }
        }
      }
    };

    const drawScore = () => {
      ctx.font = `bold ${Math.floor(canvas.width / 25)}px monospace`;
      ctx.fillStyle = scoreColor;
      ctx.fillText("SKOR: " + gameDataRef.current.score, 20, 40);
    };

    const drawHearts = () => {
      const heartSize = Math.floor(canvas.width / 40);
      const heartSpacing = heartSize + 5;
      const startX = canvas.width - (3 * heartSpacing) - 20;
      
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < gameDataRef.current.lives ? "#ff0000" : "#555555";
        ctx.font = `${heartSize}px Arial`;
        ctx.fillText("♥", startX + i * heartSpacing, 40);
      }
    };

    const drawCountdown = () => {
      // 1. Draw Overlay
      // We only draw the dark overlay if countdown is > 0.
      // If countdown is 0, we only draw the fading number.
      if (countdown > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const fontSize = Math.floor(canvas.width / 8);
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";

      // 2. Fade out logic for '0'
      if (countdown === 0) {
        // Decrease opacity
        gameDataRef.current.countdownOpacity -= 0.02; // Adjust speed of fade
        if (gameDataRef.current.countdownOpacity <= 0) {
          // Fade complete! START GAME
          setGameState('playing');
          return;
        }
        ctx.fillStyle = `rgba(255, 165, 0, ${gameDataRef.current.countdownOpacity})`;
      } else {
        ctx.fillStyle = "#ffa500";
      }

      ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
      ctx.textAlign = "left";
    };

    const drawWaitingScreen = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const mainFontSize = Math.floor(canvas.width / 15);
      const subFontSize = Math.floor(canvas.width / 30);
      ctx.font = `bold ${mainFontSize}px monospace`;
      ctx.fillStyle = "#ffa500";
      ctx.textAlign = "center";
      ctx.fillText("OYUNU BAŞLAT", canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = `${subFontSize}px monospace`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Başlamak için tıkla!", canvas.width / 2, canvas.height / 2 + 40);
      ctx.textAlign = "left";
    };

    const drawGameOverScreen = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const mainFontSize = Math.floor(canvas.width / 15);
      ctx.font = `bold ${mainFontSize}px monospace`;
      ctx.textAlign = "center";
      
      if (gameState === 'won') {
        ctx.fillStyle = "#00ff00";
        ctx.fillText("YOU WON!", canvas.width / 2, canvas.height / 2);
      } else {
        ctx.fillStyle = "#ff0000";
        ctx.fillText("GAME OVER, YOU LOSE", canvas.width / 2, canvas.height / 2);
      }
      ctx.textAlign = "left";
    };

    const draw = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ALWAYS Draw Game Elements first (so they are visible behind countdown)
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawHearts();

      // State Handling
      if (gameState === 'waiting') {
        drawWaitingScreen();
        animationId = requestAnimationFrame(draw);
        return;
      }

      if (gameState === 'countdown') {
        // This will draw the number on top of the bricks/ball
        drawCountdown();
        animationId = requestAnimationFrame(draw);
        return;
      }

      if (gameState === 'won' || gameState === 'lost') {
        drawGameOverScreen();
        cancelAnimationFrame(animationId);
        handleGameOverDisplay();
        return;
      }

      if (gameState === 'playing') {
        collisionDetection();

        let { x, y, dx, dy, speed } = gameDataRef.current.ball;

        // Wall collisions
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
          const v = normalizeVelocity(-dx, dy, speed);
          gameDataRef.current.ball.dx = v.dx;
          gameDataRef.current.ball.dy = v.dy;
        }
        
        if (y + dy < ballRadius) {
          const v = normalizeVelocity(dx, -dy, speed);
          gameDataRef.current.ball.dx = v.dx;
          gameDataRef.current.ball.dy = v.dy;
        } else if (y + dy > canvas.height - paddleHeight - 20 - ballRadius) {
          if (x > gameDataRef.current.paddleX - ballRadius && x < gameDataRef.current.paddleX + paddleWidth + ballRadius) {
            const hitPos = (x - (gameDataRef.current.paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            const angle = hitPos * Math.PI / 3;
            const v = normalizeVelocity(Math.sin(angle), -Math.abs(Math.cos(angle)), speed);
            gameDataRef.current.ball.dx = v.dx;
            gameDataRef.current.ball.dy = v.dy;
          } else if (y + dy > canvas.height - ballRadius) {
            gameDataRef.current.lives--; 
            if (gameDataRef.current.lives <= 0) {
              setGameState('lost');
              return;
            } else {
              startCountdown();
              return;
            }
          }
        }

        // Paddle movement with FIX: CLAMPING FOR KEYBOARD
        if (rightPressed) {
          gameDataRef.current.paddleX += Math.floor(canvas.width / 80);
        } else if (leftPressed) {
          gameDataRef.current.paddleX -= Math.floor(canvas.width / 80);
        }
        // Strict boundary clamp
        gameDataRef.current.paddleX = Math.max(0, Math.min(gameDataRef.current.paddleX, canvas.width - paddleWidth));

        gameDataRef.current.ball.x += gameDataRef.current.ball.dx;
        gameDataRef.current.ball.y += gameDataRef.current.ball.dy;
      }

      animationId = requestAnimationFrame(draw);
    };

    if (gameDataRef.current.ball.dx === 0 && gameDataRef.current.ball.dy === 0) {
        resetBall();
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("click", clickHandler);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [gameState, countdown]);

  return (
    <section style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px", backgroundColor: "#0a0a0a" }}>
      <canvas ref={canvasRef} style={{ background: "#1a1a1a", border: "3px solid #444", borderRadius: "8px", maxWidth: "100%", maxHeight: "100%" }} />
    </section>
  );
};