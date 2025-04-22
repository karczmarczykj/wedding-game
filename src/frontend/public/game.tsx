import React, { useState, useEffect, useRef, ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

import {setupPadsClient, lightPads, PadsState} from '@frontend/common/pads-client';

import { isCollision, BallState, createDefaultGameState, createDefaultParticipantState, RadiusPosition, transform, GameState, ParticipantState} from '@frontend/common/game-state';
import ParticipantAvatar from '@frontend/common/participant-avatar';

import styles from './game.module.scss';

interface GameProps {
  participantsIcons: React.FC[];
  BallIcon: ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>;
  isFreeze: boolean;
  pads: Set<number>;
  participantsNames: Record<string, string>;
  iconSize: number;
  gameTime: number;
  finishGame: (winners:string[]) => void;
}

function createInitialState(pads: Set<number>, participantsNames: Record<string, string>) :GameState {
  const radius = 350;
  const gameState = createDefaultGameState();
  Array.from(pads).forEach((padId, index) => {
    let name = participantsNames[padId] || `Participant ${padId}`;
    gameState.participants[padId] = createDefaultParticipantState(name, radius, index, pads.size, padId);
  });

  return gameState;
}

function moveBall(gameState : GameState, iconSize: number) : RadiusPosition {
  const current = gameState.ball.position;
  let speedAngle = gameState.ball.speedAngle;
  let speedRadius = gameState.ball.speedRadial;

  if (current.radius + speedRadius >= 400) {
    gameState.ball.speedRadial = -gameState.ball.speedRadial;
  } else if (current.radius + speedRadius <= 15) {
    gameState.ball.speedRadial = -gameState.ball.speedRadial;
  } else if (Math.random() < 0.01) {
    gameState.ball.speedRadial = -gameState.ball.speedRadial;
  } else if (Math.random() < 0.01) {
    gameState.ball.speedAngle = -speedAngle;
  }

  const radius = Math.max(Math.min(current.radius + speedRadius, 400), 15);
  const angle = (current.angle + speedAngle / radius) % (2 * Math.PI);
  const anyCollision = isAnyCollision({ radius, angle }, gameState.participants, iconSize);
  if (anyCollision) {
    gameState.ball.position = findFirstNonCollision(gameState.participants, iconSize);
    gameState.ball.speedAngle = -gameState.ball.speedAngle + Math.random() * 2 - 1;
    gameState.ball.speedRadial = -gameState.ball.speedRadial + Math.random() * 2 - 1;
    gameState.participants[anyCollision].points += 1;
    return current;
  }
  return {
    radius,
    angle,
  };
}

function findFirstNonCollision(participants : Record<string, ParticipantState>, iconSize: number) : RadiusPosition {
  let position : RadiusPosition = { radius: 0, angle: 0 };
  while(true) {
    position.radius = Math.random() * 380 + 15;
    position.angle = Math.random() * 2 * Math.PI;
    const collision = isAnyCollision(position, participants, iconSize);
    if (!collision) {
      break;
    }
  }

  return position;
}

function isAnyCollision(position: RadiusPosition, participants : Record<string, ParticipantState>, iconSize: number) : string | false {
  for (let key in participants) {
    const participantState = participants[key];
    if (isCollision(position, participantState.position, iconSize)) {
      return key;
    }
  }
  return false;
}

function isPlayerCollision(position: RadiusPosition, player: string, participants : Record<string, ParticipantState>, iconSize: number) : boolean {
  for (let key in participants) {
    if (key === player) {
      continue;
    }
    if (isCollision(participants[key].position, position, iconSize)) {
      return true;
    }
  }
  return false;
}

function moveParticipant(gameState: GameState, player: string, iconSize : number) : ParticipantState {
  const playerState = gameState.participants[player];
  const angleSpeed = playerState.angleSpeed;
  const radialSpeed = playerState.radialSpeed;
  let newAngle = playerState.position.angle + angleSpeed / playerState.position.radius;
  if (newAngle > 2 * Math.PI) {
    newAngle -= 2 * Math.PI;
  }

  let newRadius = playerState.position.radius + radialSpeed;

  if (newRadius > 400) {
    newRadius = 400;
  } else if (newRadius < 15) {
    newRadius = 15;
  }

  if (isPlayerCollision({angle: newAngle, radius: newRadius}, player, gameState.participants, iconSize)) {
    playerState.angleSpeed = 0;
    playerState.radialSpeed = 0;
    return playerState;
  }

  if (isCollision(gameState.ball, { radius: newRadius, angle: newAngle }, iconSize)) {

    gameState.participants[player].points += 1;
    gameState.ball.reversed = !gameState.ball.reversed;
    gameState.participants[player].angleSpeed = 0;
    gameState.participants[player].radialSpeed = 0;
    gameState.ball.position = findFirstNonCollision(gameState.participants, iconSize);
    return gameState.participants[player];
  }

  return { ...gameState.participants[player], position: { radius: newRadius, angle: newAngle } };
}

function updateGameState(gameState: GameState, padsState: PadsState) : GameState {
  const radialSpeed = 4;
  const angleSpeed = 4;
  Object.keys(gameState.participants).forEach((key) => {
    gameState.participants[key].angleSpeed = 0;
    gameState.participants[key].radialSpeed = 0;
  });
  for (let key in padsState) {
    if (key === 'count' || parseInt(key) < 0) 
      continue;
    const padId = parseInt(key);
    if (!gameState.participants[padId])
      continue;
    switch (padsState[key]) {
      case 'A':
        gameState.participants[padId].angleSpeed = angleSpeed;
        break;
      case 'B':
        gameState.participants[padId].angleSpeed = -angleSpeed;
        break;
      case 'C':
        gameState.participants[padId].radialSpeed = radialSpeed;
        break;
      case 'D':
        gameState.participants[padId].radialSpeed = -radialSpeed;
        break;
    }
  }
  return {...gameState};
}

function findWinner(gameState: GameState) : string[] {
  const participants = Object.values(gameState.participants);
  const maxPoints = Math.max(...participants.map(p => p.points));
  return participants.filter(p => p.points === maxPoints).map(p => `${p.name} ${p.points} pt.`);
}

const Game : React.FC<GameProps> = ({participantsIcons, BallIcon, isFreeze, finishGame, pads, participantsNames, iconSize, gameTime}) => {
  const [gameState, setGameState] = useState(createInitialState(pads, participantsNames));
  const [secondsLeft, setSecondsLeft] = useState(gameTime);
  const socketRef = useRef<WebSocket | null>(null);
  const bouquetRef = useRef<SVGSVGElement | null>(null);
  const participantsRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (Object.keys(gameState.participants).length !== pads.size) {
    const newGameState = createInitialState(pads, participantsNames);
    setGameState(newGameState);
  }

  useEffect(() => {
    const animate = () => {
      if (bouquetRef.current && !isFreeze) {
        const { x, y } = transform(gameState.ball.position);
        bouquetRef.current.style.transform = `translate(${x}px, ${y}px)`;
        gameState.ball.position = moveBall(gameState, iconSize);
        Object.keys(gameState.participants) .forEach((key, index) => {
          const participantState = gameState.participants[key];
          const { x, y } = transform(participantState.position);
          if (participantsRefs.current[index]) {
            const avatarPoints = participantsRefs.current[index].querySelector('.avatarPoints');
            if (avatarPoints) {
              avatarPoints.textContent = participantState.points.toString();
            }
            participantsRefs.current[index].style.transform = `translate(${x}px, ${y}px)`;
          }
          gameState.participants[key] = moveParticipant(gameState, key, iconSize);
        });
        setGameState(gameState);
      }
      requestAnimationFrame(animate);
    }
    animate();

  }, [pads, isFreeze]);


  useEffect(() => {
    if (isFreeze) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:13254');
    }

    setupPadsClient(socketRef.current, (padsState) => {
      setGameState(updateGameState(gameState, padsState));
    });
  }, [isFreeze]);


  useEffect(() => {
    if (isFreeze) {
      return;
    }

    if (secondsLeft <= 0) {
      const winner = findWinner(gameState);
      finishGame(winner);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [secondsLeft, isFreeze]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsLeft = secs % 60;
    return `${mins}:${secsLeft.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.gameContainer}>
      {!isFreeze && <p className={styles.timer}>{formatTime(secondsLeft)}</p> }
      <BallIcon ref={bouquetRef} className={styles.bouquet} width={iconSize} height={iconSize} />
      { gameState.participants && Object.keys(gameState.participants).map((padId, index) => {
        const participantState = gameState.participants[padId];
        const Icon = participantsIcons[index % participantsIcons.length];
        return ( <ParticipantAvatar ref={(el) => (participantsRefs.current[index] = el, undefined)} key={padId} Icon={Icon} participant={participantState} size={iconSize} /> );
      })}
    </div>
  )
}

export default Game;

