import React, { useEffect, useRef, useState, forwardRef } from 'react';
import CountdownTimer from './countdown-fire';
import BackButton from './back-button';
import Game from './game';
import { Girl1, Girl2, Girl3, Girl4, Boy1, Boy2, Boy3, Boy4, Ball1, Bouquet1 } from './icons';

import styles from './game-page.module.scss';

interface GameProps {
  variant: "bride" | "groom" | "playground";
}

const malePlayers : Record<string, string> =  {
  0: 'Jarek',
  1: 'Darek',
  2: 'Krzysiek',
  3: 'Zbyszek',
  4: 'Wojtek',
  5: 'Grzesiek',
  6: 'Michał',
  7: 'Kuba',
  8: 'Marek',
}

const femalePlayers : Record<string, string> = {
  0: 'Magda',
  1: 'Marta',
  2: 'Martyna',
  3: 'Ania',
  4: 'Kasia',
  5: 'Weronika',
  6: 'Asia',
  7: 'Klaudia',
  8: 'Agata',
}

const GameTable : React.FC<GameProps> = ({ variant }) => {
  const [isFired, setIsFired] = useState(false);
  const [isFreeze, setIsFreeze] = useState(true);
  const [pads, setPads] = useState(new Set<number>());
  const [winners, setWinners] = useState<string[]>([]);
  let playersIcons = [Girl1, Girl2, Girl3, Girl4];
  let ballIcon = Bouquet1;
  let playersNames = femalePlayers;

  if (variant === "groom") {
    playersNames = malePlayers;
    playersIcons = [Boy1, Boy2, Boy3, Boy4];
    ballIcon = Ball1;
  }

  const handleGameStart = () => {
    setIsFired(true);
    setIsFreeze(false);
  }

  const handleGameFinish = (winners: string[]) => {
    setIsFreeze(true);
    setWinners(winners);
  }

  const handlePadsUpdate = (pads: Set<number>) => {
    setPads(pads);
  }


  return (
    <div className={styles.gameTableContainer}>
      <BackButton />
      { !isFired && <CountdownTimer initialSeconds={10} onComplete={handleGameStart} onPadsUpdate={handlePadsUpdate} />}
      <Game participantsIcons={playersIcons} BallIcon={ballIcon} isFreeze={isFreeze} finishGame={handleGameFinish} pads={pads} participantsNames={playersNames} iconSize={40} gameTime={2*60} /> 
      { isFreeze && winners.length > 0 && <div className={styles.winnerContainer}>
        <div className={styles.winnerInner}>
          <h1>Magda & Jarek</h1>
          <h2>Winners:</h2>
          <ol>
            {winners.map((winner, index) => (
              <li key={index}>{winner}</li>
            ))}
          </ol>
        </div>
      </div>}
    </div>
  )
}

export default GameTable;

