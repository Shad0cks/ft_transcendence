import React, { useEffect, useRef, useCallback, useState } from 'react';
import '../css/Components/PongGame.css';
import { socket } from '../services/socket';
import { GameObj } from '../models/game';
import Popup from 'reactjs-popup';

export default function PongGame({
  width,
  height,
  gameInfo,
  gameID,
}: {
  width: number;
  height: number;
  gameInfo: GameObj;
  gameID: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let pause = false;
  const [pauseT, setPauseT] = useState(false);
  const [winner, setWinner] = useState<string>();
  const [seconds, setSeconds] = useState(5);
  const playerID = getPlayerID();
  let myInterval: NodeJS.Timer;

  interface playerProps {
    id: number;
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
    speed: number;
  }

  interface ballProps {
    x: number;
    y: number;
    r: number;
    color: string;
    speed: number;
    velocityX: number;
    velocityY: number;
    user1score: number;
    user2score: number;
  }

  const user1 = {
    id: 1,
    x: 20,
    y: height / 2 - 60 / 2,
    height: 60,
    width: 10,
    color: 'WHITE',
    speed: 15,
  };

  const user2 = {
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
    color: gameInfo.mapColor,
  };

  const ball = {
    x: width / 2,
    y: height / 2,
    r: 10,
    color: 'WHITE',
    speed: 6,
    velocityX: 5,
    velocityY: 5,
    user1score: 0,
    user2score: 0,
  };

  function sendBallPos() {
    if (playerID === 1) socket.emit('ballPos', { data: ball, gameid: gameID });
  }

  function sendPlayers() {
    if (playerID === 1)
      socket.emit('playermove', { data: user1, gameid: gameID });
    else if (playerID === 2)
      socket.emit('playermove', { data: user2, gameid: gameID });
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

    if (playerID === 1) {
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
        socket.emit('Scored', {
          gameid: gameID,
          player: gameInfo.player1.nickname,
        });
        resetTerrain();
        return;
      }
      ball.user2score += 1;
      socket.emit('Scored', {
        gameid: gameID,
        player: gameInfo.player2.nickname,
      });
      resetTerrain();
      return;
    }
  }

  socket.on('playermove', function (data: playerProps) {
    if (playerID === 3) {
      if (data.id === 2) {
        user2.y = data.y;
      } else {
        user1.y = data.y;
      }
    } else if (playerID === 1) {
      if (data.id === 2) user2.y = data.y;
    } else if (playerID === 2) {
      if (data.id === 1) {
        user1.y = data.y;
      }
    }
  });

  socket.on('ballPos', function (data: ballProps) {
    if (playerID === 1) return;
    ball.velocityX = data.velocityX;
    ball.velocityY = data.velocityY;
    ball.speed = data.speed;
    ball.x = data.x;
    ball.y = data.y;
    ball.user1score = data.user1score;
    ball.user2score = data.user2score;
  });

  function game(context: CanvasRenderingContext2D) {
    if (pause) return;
    sendPlayers();
    sendBallPos();
    updateGame();
    createTerrin(context);
  }

  const mouseMouveEvent = useCallback((e: MouseEvent) => {
    if (playerID === 3) return;
    let temp = playerID === 1 ? user1 : user2;
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
    let temp = playerID === 1 ? user1 : user2;
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

  function getPlayerID() {
    if (socket.id === gameInfo.player1.socket) return 1;
    else if (socket.id === gameInfo.player2.socket) return 2;
    else return 3;
  }

  const visibilty = useCallback((e: Event) => {
    if (
      gameInfo.player1.socket !== socket.id &&
      gameInfo.player2.socket !== socket.id
    )
      return;
    if (document.hidden) {
      if (pause)
        socket.emit('Gameforceend', { gameid: gameID, player: undefined });
      else if (playerID === 1)
        socket.emit('GamePause', {
          gameid: gameID,
          pause: true,
          player: gameInfo.player1.nickname,
        });
      else if (playerID === 2) {
        socket.emit('GamePause', {
          gameid: gameID,
          pause: true,
          player: gameInfo.player2.nickname,
        });
      }
    } else {
      socket.emit('GamePause', {
        gameid: gameID,
        pause: false,
        player: 'none',
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socket.on(
      'GamePause',
      (e: { gameid: string; pause: boolean; player: undefined | string }) => {
        pause = e.pause; // eslint-disable-line react-hooks/exhaustive-deps
        setPauseT(e.pause);
        let sec = 5;
        if (!pause) return;
        setSeconds(5);

        clearInterval(myInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        myInterval = setInterval(() => {
          if (sec > 0) {
            setSeconds((prev) => prev - 1);
            sec--;
          }
          if (sec <= 0 && pause) {
            socket.emit('Gameforceend', { gameid: gameID, player: e.player });
            setSeconds(5);
            setPauseT(false);
            clearInterval(myInterval);
          }
        }, 1000);
      },
    );

    socket.on('GameEnded', (player: string) => {
      pause = true;
      setPauseT(true);
      setWinner(player);
    });

    socket.on('Addtoviewver', () => {
      if (playerID === 1) {
        socket.emit('gameOption', { data: gameInfo, gameid: gameID });
      }
    });
  }, [socket]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      window.addEventListener('mousemove', mouseMouveEvent);
      window.addEventListener('visibilitychange', visibilty);
      window.addEventListener('touchmove', touchStartLister);
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
          if (playerID === 1) {
            socket.emit('Gameforceend', {
              gameid: gameID,
              player: gameInfo.player1.nickname,
            });
          } else if (playerID === 2) {
            socket.emit('Gameforceend', {
              gameid: gameID,
              player: gameInfo.player2.nickname,
            });
          }
        };
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <canvas
        className="canvasGame"
        ref={canvasRef}
        width={width}
        height={height}
      />
      <Popup open={pauseT}>
        <div
          style={{
            height: '300px',
            backgroundColor: '#282c34',
            zIndex: 2,
            fontFamily: 'Orbitron',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {pauseT && winner !== undefined ? (
            <h1> Winner is {winner}</h1>
          ) : (
            <>
              <h1 style={{ color: 'blue' }}>{seconds}</h1>
              <h2>Before user1 win</h2>
            </>
          )}
        </div>
      </Popup>
    </>
  );
}
