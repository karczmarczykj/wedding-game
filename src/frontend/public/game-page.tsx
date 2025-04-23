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
  0:"Maksym",
  1:"Jakub",
  2:"Dominik",
  3:"Mateusz",
  4:"Witold",
  5:"Janusz",
  6:"Wojciech",
  7:"Zbigniew",
  8:"Grzegorz",
  9:"Wiktor",
  10:"Michał",
  11:"Daniel",
  12:"Piotr",
  13:"Marcin"
}

const femalePlayers : Record<string, string> = {
  0: "Malwina",
  1: "Katarzyna",
  2: "Iwona",
  3: "Joanna",
  4: "Agnieszka",
  5: "Kinga",
  6: "Małgorzata",
  7: "Anna",
  8: "Eva",
  9: "Anna",
  10: "Aneta",
  11: "Hania",
  12: "Izabela",
  13: "Katarzyna",
  14: "Grażyna",
  15: "Ada"
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

