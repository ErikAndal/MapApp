import { useState, memo } from "react";

type MyComponentProps = {
  onStartGame: (newGameMode: string, newName: string) => void;
  highscoreList: any;
};

interface Score {
  name: string;
  score: number;
}

const Startpage: React.FC<MyComponentProps> = memo(
  ({ onStartGame, highscoreList }) => {
    const [gameMode, setGameMode] = useState("state");
    const [username, setUsername] = useState("Jeff");

    const options = [
      { value: "state", label: "State" },
      { value: "capital", label: "Capital" },
      { value: "nickname", label: "Nickname" },
      { value: "landmark", label: "Landmark" },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onStartGame(gameMode, username);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    };

    const handleGameModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setGameMode(e.target.value);
    };

    return (
      <div className="startpage-container">
        <label className="username-label" htmlFor="name">
          Name:
        </label>
        <form
          className="username-form"
          id="username-form"
          onSubmit={handleSubmit}
        >
          <div className="username-and-input">
            <input
              className="input"
              type="text"
              name="name"
              defaultValue={username}
              onChange={handleUsernameChange}
            />
          </div>
        </form>
        <div className="radio-container">
          {options.map((option, index) => {
            return (
              <label key={option.value} className="radio-label">
                <input
                  type="radio"
                  name="gameMode"
                  value={option.value}
                  checked={gameMode === option.value}
                  onChange={handleGameModeChange}
                />
                <span className="new-radio-label">
                  <img
                    className="gamemode-image"
                    key={index}
                    src={`./public/assets/gamemode-images/${option.value}.webp`}
                    alt={option.value}
                  />
                </span>
              </label>
            );
          })}
        </div>
        <button type="submit" form="username-form">
          Start
        </button>
        <p className="">Legends:</p>
        <ol className="highscore-list">
          {highscoreList.map((score: Score, index: number) => (
            <li key={index}>
              <div className="score-item">
                <span className="score-name">{score.name}</span>
                <span className="score-score">{score.score} points</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }
);

export default Startpage;
