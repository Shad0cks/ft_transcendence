import React, { useEffect, useRef, useCallback } from 'react';
import '../css/Components/PongGame.css';
import { Socket } from "socket.io-client";
import { GameObj } from '../models/game';

const keys : boolean[] = []

export default function PongGame({
  width,
  height,
  gameInfo,
  socket
}: {
  width: number;
  height: number;
  gameInfo: GameObj;
  socket: Socket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerID = getPlayerID()

  interface playerProps {
    lien: string;
    id: number;
    x: number;
    y: number;
    height: number;
    width: number;
    color: string; 
    speed: number;
  }

  interface ballProps {
    likedGame: string;
    x: number;
    y: number;
    r: number;
    color: string;
    speed: number;
    velocityX: number;
    velocityY: number;
    user1score: number;
    user2score: number;
  };

  const user1 = {
    lien: window.location.pathname,
    id: 1, 
    x: 20,
    y: height / 2 - 60 / 2,
    height: 60,
    width: 10,
    color: 'WHITE',
    speed: 15,
  };

  const user2 = {
    lien: window.location.pathname,
    id: 2,
    x: width - 10 - 20,
    y: height / 2 - 60 / 2,
    height: 60,
    width: 10,
    color: 'WHITE',
    speed: 15,
  };

  const midLine = {
    width: 10,
    height: 10,
    x: width / 2 - 2 / 2,
    y: 0,
    color: 'WHITE',
  };

  const terrain = {
    width: width,
    height: height,
    x: 0,
    y: 0,
    color: 'BLACK',
  };

  const ball = {
    likedGame: window.location.pathname,
    x: width / 2,
    y: height / 2,
    r: 10,
    color: 'WHITE',
    speed: 6,
    velocityX: 5,
    velocityY: 5,
    user1score: 0,
    user2score: 0
  };

  function sendBallPos() {
    if (playerID === 1 || (gameInfo.offline && playerID === 2))
      socket.emit('ballPos', ball);
  }

  function sendPlayers() {
    if (gameInfo.offline)
    {
      socket.emit('playermove', user1);
      socket.emit('playermove', user2);
    }
    else if (playerID === 1)
      socket.emit('playermove', user1);
    else if (playerID === 2)
      socket.emit('playermove', user2);
  }

  function drawMidLine(context: CanvasRenderingContext2D) {
    for (let index = 0; index <= height; index += 10) {
      if (index % 3)
        drawRect(
          context,
          midLine.x,
          midLine.y + index,
          midLine.width,
          midLine.height,
          midLine.color,
        );
    }
  }

  function resetTerrain() {
    ball.x = width / 2;
    ball.y = height / 2;
    if (Math.round(Math.random()) === 0) {
      ball.velocityX = 5;
      ball.velocityY = 5;
    } else {
      ball.velocityX = -5;
      ball.velocityY = 5;
    }
    ball.speed = 6;
  }

  function createTerrin(context: CanvasRenderingContext2D) {
    drawRect(
      context,
      terrain.x,
      terrain.y,
      terrain.width,
      terrain.height,
      terrain.color,
    );
    drawMidLine(context);
    drawtText(
      context,
      ball.user1score.toString(),
      (width / 4) * 1.4,
      height / 5,
      'WHITE',
    );
    drawtText(
      context,
      ball.user2score.toString(),
      (width / 4) * 2.4,
      height / 5,
      'WHITE',
    );
    drawRect(context, user1.x, user1.y, user1.width, user1.height, user1.color);
    drawRect(context, user2.x, user2.y, user2.width, user2.height, user2.color);
    drawCircle(context, ball.x, ball.y, ball.r, ball.color);
  }

  function drawRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
  ) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }

  function drawCircle(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string,
  ) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }

  function drawtText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string,
  ) {
    context.fillStyle = color;
    context.font = '75px Orbitron';
    context.fillText(text, x, y);
  }

  function player_collision(player: playerProps): boolean {
    const p_top = player.y;
    const p_botton = player.y + player.height;
    const p_left = player.x;
    const p_right = player.x + player.width;

    const b_top = ball.y - ball.r;
    const b_bottom = ball.y + ball.r;
    const b_right = ball.x + ball.r;
    const b_left = ball.x - ball.r;

    return (
      b_right > p_left &&
      b_left < p_right &&
      b_top < p_botton &&
      b_bottom > p_top
    );
  }

  function updateGame() {
    let colidePoint = 0;
    let angleCollision = 0;

    if (gameInfo.computer) {
      let temp = gameInfo.player1.taken ? user2 : user1;
      let botMove = (ball.y - (temp.y + temp.height / 2)) * (gameInfo.botLevel / 10);

      if (botMove - temp.height < height && botMove + temp.height > 0)
        temp.y += botMove;
    }

    if (playerID === 1 || (gameInfo.offline && playerID === 2))
    {
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;
    }
    
    if (ball.y + ball.r >= height || ball.y - ball.r <= 0)
      ball.velocityY = -ball.velocityY;
    else if (player_collision(user1)) {
      colidePoint =
        (ball.y - (user1.y + user1.height / 2)) / (user1.height / 2);
      angleCollision = colidePoint * (Math.PI / 4);
      ball.velocityX = ball.speed * Math.cos(angleCollision);
      ball.velocityY = ball.speed * Math.sin(angleCollision);
      ball.speed += 0.4;
    } else if (player_collision(user2)) {
      colidePoint =
        (ball.y - (user2.y + user2.height / 2)) / (user2.height / 2);
      angleCollision = colidePoint * (Math.PI / 4);
      ball.velocityX = -ball.speed * Math.cos(angleCollision);
      ball.velocityY = ball.speed * Math.sin(angleCollision);
      ball.speed += 2;
    } else if (ball.x + ball.r >= width || ball.x - ball.r <= 0) {
      if (ball.x + ball.r >= width) {
        ball.user1score += 1;
        resetTerrain();
        return;
      }
      ball.user2score += 1;
      resetTerrain();
      return;
    }
  }

  socket.on('playermove', function (data: playerProps) {
    if (data.lien !== user1.lien) return;
    if (gameInfo.offline && playerID === 3)
    {
      if (data.id === 2)
      {
        user2.y = data.y;
        
      }
      else
      {
        user1.y = data.y;
        
      }
    }
    else
    {
      if (playerID === 1)
      {
        if (data.id === 2 && !gameInfo.offline)
          user2.y = data.y;
      }
      else if (playerID === 2)
      {
        if (data.id === 1 && !gameInfo.offline)
        {
          user1.y = data.y;
          
        }
        
      }
    }
  });

  socket.on('ballPos', function (data: ballProps) {
    if (data.likedGame !== user1.lien || (playerID === 1 || (gameInfo.offline && playerID === 2))) return;
    ball.velocityX = data.velocityX
    ball.velocityY = data.velocityY
    ball.speed = data.speed
    ball.x = data.x;
    ball.y = data.y
    ball.user1score = data.user1score;
    ball.user2score = data.user2score;
  });


  function game(context: CanvasRenderingContext2D) {
    sendPlayers();
    sendBallPos();
    whatKey();
    updateGame();
    createTerrin(context);
  }

  const mouseMouveEvent = useCallback((e: MouseEvent) => {
      if (playerID === 3) return;
      let temp = playerID === 1 ? user1  : user2;
    if (canvasRef.current) {
      const userRect = canvasRef.current.getBoundingClientRect();
      const userRation = userRect.height / height;
      const ratio = (e.clientY - userRect.top) / userRect.height;
      const userHeight = (userRation * temp.height) / 2;

      if (
        ratio * (e.clientY - userHeight) > 10 &&
        ratio * (e.clientY + userHeight) < height - 10
      ) {
        temp.y = ratio * (e.clientY - userHeight);
      } else if (ratio * (e.clientY - userHeight) > 10) {
        temp.y = height - user1.height - 10;
      } else temp.y = 10;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const touchStartLister = useCallback((e: TouchEvent) => {
    if (playerID === 3) return;
    let temp = playerID === 1 ? user1  : user2;
    if (canvasRef.current) {
      let newPos = e.touches[0].clientY;
      let userRect = canvasRef.current.getBoundingClientRect();

      const userRation = userRect.height / height;
      const ratio = (newPos - userRect.top) / userRect.height;
      const userHeight = (userRation * temp.height) / 2;

      if (
        ratio * (newPos - userHeight) > 10 &&
        ratio * (newPos + userHeight) < height - 10
      )
      temp.y = ratio * (newPos - userHeight);
      else if (newPos - userRect.top - temp.height / 2 > 10)
        temp.y = height - temp.height - 10;
      else temp.y = 10;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function whatKey() {
    if (playerID === 3) return;
    let temp = gameInfo.player1.taken ? user2 : user1;
    if (keys[38] && keys[40]) return;
    if (keys[38] && temp.y > 0) {
      temp.y -= temp.speed;
    } else if (keys[40] && temp.y + user1.height < height) {
      temp.y += user2.speed;
    }
  }

  const handleUserKeyPress = useCallback(
    (e: KeyboardEvent) => {
      keys[e.keyCode] = true;
    },
    [],
  );

  const handleUserKeyUp = useCallback(
    (e: KeyboardEvent) => {
      keys[e.keyCode] = false;
    },
    [],
  );


  function getPlayerID()
  {
    if (socket.id === gameInfo.player1.socket)
      return 1;
    else if (socket.id === gameInfo.player2.socket)
      return 2;
    else
      return 3;
  }

  useEffect(() => {
    if (canvasRef.current) {      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      window.addEventListener('mousemove', mouseMouveEvent);
      window.addEventListener('touchmove', touchStartLister);
      if (gameInfo.offline) {
        window.addEventListener('keydown', handleUserKeyPress);
        window.addEventListener('keyup', handleUserKeyUp);
      }
      if (context) {
        const frame = 60;
        const interval = setInterval(() => {
          game(context);
        }, 1000 / frame);

        return () => {
          socket.off('playermove');
          clearInterval(interval);
          window.removeEventListener('mousemove', mouseMouveEvent);
          window.removeEventListener('touchmove', touchStartLister);
          if (gameInfo.offline) {
            window.removeEventListener('keydown', handleUserKeyPress);
            window.removeEventListener('keyup', handleUserKeyUp);
          }
        };
      }
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      className="canvasGame"
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
}
