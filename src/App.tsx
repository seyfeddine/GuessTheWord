import { useCallback, useEffect, useState } from "react";
import HangManDrawing from "./HangManDrawing";
import HangManWord from "./HangManWord";
import Keyboard from "./Keyboard";
import words from "./wordList.json";

function getWord(){
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);

  const [guessedtLetters, setGuestLetters] = useState<string[]>([]);
  const incorrectLetters = guessedtLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedtLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedtLetters.includes(letter) || isLoser || isWinner) return;
      setGuestLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedtLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedtLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if(key != "Enter") return
      e.preventDefault()
      setGuestLetters([])
      setWordToGuess(getWord())
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  })
  return (
    <div
      style={{
        maxWidth: "800 px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner"}
        {isLoser && "You Lost - Try Again"}
      </div>
      <HangManDrawing numberOfGuesses={incorrectLetters.length} />
      <HangManWord reveal={isLoser} guessedLetters={guessedtLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled = {isWinner || isLoser}
          activeLetters={guessedtLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inActiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
