import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import Map from "./Map";
import Startpage from "./Startpage";
import ToneGenerator from "./ToneGenerator";
import {
  initialHighscores,
  initialStates,
  stateInfo,
  gameModes,
  GameMode,
} from "./data";

function App() {
  const [states, setStates] = useState(initialStates);
  const [nextState, setnextState] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const toneGeneratorRef = useRef<{ handlePlay: (correct: boolean) => void }>(
    null
  );
  const [username, setUsername] = useState("");
  const [highscoreList, setHighscoreList] = useState(() => {
    const data = localStorage.getItem("highscoreList_storage");
    return data ? JSON.parse(data) : initialHighscores;
  });
  const [gameMode, setGameMode] = useState("");
  const [nextQuestion, setNextQuestion] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    console.log("Effect runs for nextState or gameMode:", nextState, gameMode);
    if (nextState !== null && gameMode) {
      const key = nextState.replace(/\s/g, "");
      const nextQuestion =
        stateInfo[key]?.[gameMode as keyof (typeof stateInfo)[typeof key]] ||
        null;
      setNextQuestion(nextQuestion);
    }
  }, [nextState, gameMode]);

  useEffect(() => {
    //console.log("Effect runs for highscoreList:", highscoreList);
    localStorage.setItem(
      "highscoreList_storage",
      JSON.stringify(highscoreList)
    );
  }, [highscoreList]);

  useEffect(() => {
    const storedHighscoreList = localStorage.getItem("highscoreList_storage");
    if (storedHighscoreList) {
      setHighscoreList(JSON.parse(storedHighscoreList));
    }
  }, []);

  useEffect(() => {
    if (states.length === initialStates.length) {
      setnextState(states[Math.floor(Math.random() * states.length)]);
    }
  }, [states]);

  useEffect(() => {
    if (running) {
      //console.log("Effect runs for time:", time);
      const timer = setInterval(() => {
        //console.log("Timeout fired for time:", time);
        setTime((prev) => prev + 1);
      }, 1000);
      return () => {
        //console.log("Clearing timeout for time:", time);
        clearInterval(timer);
      };
    }
  }, [time, running]);

  const playTone = (isCorrect: boolean) => {
    toneGeneratorRef.current?.handlePlay(isCorrect);
  };

  const handleStateClick = (clickedState: string) => {
    if (clickedState == nextState) {
      setWrongCount(0);
      playTone(true);
      if (states.length === 1) {
        saveAndReinitGame(username, score + 1);
        return;
      }
      setStates((prevStates) => {
        const statesRemaining = prevStates.filter(
          (state) => state !== nextState
        );
        setnextState(
          statesRemaining[Math.floor(Math.random() * statesRemaining.length)]
        );
        return statesRemaining;
      });
      setScore((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
      playTone(false);
      console.log("wrong state clicked");
      setScore((prev) => prev - 1);
    }
  };

  const saveAndReinitGame = (username: string, score: number) => {
    //console.log("Saving and reinitializing game");
    const combinedScore = score - time;
    const updatedHighscores = [
      ...highscoreList,
      { name: username, score: combinedScore },
    ];
    updatedHighscores.sort((a, b) => b.score - a.score);
    const finishedHighscores = updatedHighscores.slice(0, 5);
    setStates(initialStates);
    setnextState(states[Math.floor(Math.random() * states.length)]);
    setHighscoreList(finishedHighscores);
    setScore(0);
    setTime(0);
    setRunning(false);
  };

  const startGame = useCallback((newGameMode: string, newName: string) => {
    setGameMode(newGameMode);
    setUsername(newName);
    setRunning(true);
  }, []);

  return (
    <>
      {!running ? (
        <Startpage onStartGame={startGame} highscoreList={highscoreList} />
      ) : (
        <div className="map-container">
          <div className="time">Time: {time}</div>
          <div className="score">Score: {score - time}</div>
          <div className="info">
            <h2 className="next-question">{nextQuestion}</h2>

            {nextState &&
              gameModes
                .filter((mode) => mode !== gameMode)
                .slice(0, wrongCount)
                .map((tip, index) => (
                  <h3 key={index} className="tip">
                    {stateInfo[nextState.replace(/\s/g, "")][tip as GameMode]}
                  </h3>
                ))}
          </div>

          <Map handleStateClick={handleStateClick} nextState={nextState} />
          <ToneGenerator ref={toneGeneratorRef} />
        </div>
      )}
    </>
  );
}
export default App;
