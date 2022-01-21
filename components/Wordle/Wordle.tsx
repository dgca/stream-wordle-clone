import { useCallback, useEffect, useMemo, useState } from "react";
import SubmittedGuess from "./SubmittedGuess/SubmittedGuess";
import Keyboard from "./Keyboard/Keyboard";
import styles from "./wordle.module.css";

import type { PuzzleWordCharCountType, GuessType } from "./types";

const totalGuessMax = 6;

function useWordOfTheDay() {
  const [word, setWord] = useState<null | string>(null);

  useEffect(() => {
    async function fetchWord() {
      const response = await fetch("/api/word").then((res) => res.json());

      setWord(response.word);
    }

    fetchWord();
  }, []);

  return word;
}

function useCharCountMap(word: string | null) {
  return useMemo(() => {
    if (word === null) {
      return {};
    }
    return word.split("").reduce<Record<string, number>>((acc, char) => {
      if (!acc.hasOwnProperty(char)) {
        acc[char] = 1;
      } else {
        acc[char] += 1;
      }
      return acc;
    }, {});
  }, [word]);
}

export default function Wordle() {
  const [submittedGuesses, setSubmittedGuesses] = useState<string[][]>([]);
  const [guess, setGuess] = useState<string[]>([]);

  const wordOfTheDay = useWordOfTheDay();

  const handleKeyInput = useCallback(
    (key: string) => {
      const isChar = /^[a-z]$/.test(key);
      const isBackspace = key === "Backspace";
      const isSubmit = key === "Enter";
      const isGuessFinished = guess.length === 5;

      if (isBackspace) {
        setGuess((prev) => {
          const temp = [...prev];
          temp.pop();
          return temp;
        });
      } else if (isChar && !isGuessFinished) {
        setGuess((prev) => [...prev, key]);
      } else if (isGuessFinished && isSubmit) {
        setSubmittedGuesses((prev) => [...prev, guess]);
        setGuess([]);
      }
    },
    [guess]
  );

  useEffect(() => {
    function handleKeyDown({ key }: { key: string }) {
      handleKeyInput(key);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess.length, guess, handleKeyInput]);

  const puzzleWordCharCount = useCharCountMap(wordOfTheDay);

  if (wordOfTheDay === null) {
    return <p>Loading...</p>;
  }

  const isCorrect =
    submittedGuesses.length > 0 &&
    submittedGuesses[submittedGuesses.length - 1].join("") === wordOfTheDay;

  const isFailure = !isCorrect && submittedGuesses.length === totalGuessMax;

  return (
    <div className={styles.wordle}>
      <h1 className={styles.title}>Wordleish</h1>
      <div className={styles.boardPositioner}>
        <div className={styles.wordleBoard}>
          <SubmittedGuesses
            submittedGuesses={submittedGuesses}
            puzzleWord={wordOfTheDay}
            puzzleWordCharCount={puzzleWordCharCount}
          />
          {!isFailure && !isCorrect && <CurrentGuess guess={guess} />}
          {Array.from({
            length:
              totalGuessMax - submittedGuesses.length - (isCorrect ? 0 : 1),
          }).map((_, i) => {
            return <EmptyGuess key={i} />;
          })}
          {isCorrect && (
            <div className={`${styles.message}`}>
              You did it! You are the smartest.
            </div>
          )}
          {isFailure && (
            <div className={`${styles.message}`}>
              Oh no! Better luck next time.
            </div>
          )}
        </div>
      </div>
      <Keyboard keyPressHandler={handleKeyInput} />
    </div>
  );
}

type SubmittedGuessesProps = {
  submittedGuesses: string[][];
  puzzleWord: string;
  puzzleWordCharCount: PuzzleWordCharCountType;
};

function SubmittedGuesses({
  submittedGuesses,
  puzzleWord,
  puzzleWordCharCount,
}: SubmittedGuessesProps) {
  return (
    <>
      {submittedGuesses.map((guess, i) => {
        return (
          <SubmittedGuess
            puzzleWord={puzzleWord}
            guess={guess}
            puzzleWordCharCount={puzzleWordCharCount}
            key={i}
          />
        );
      })}
    </>
  );
}

type CurrentGuessProps = {
  guess: GuessType;
};

function CurrentGuess({ guess }: CurrentGuessProps) {
  return (
    <div className={`${styles.word} ${styles.currentGuess}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <span className={styles.char} key={i}>
            {guess[i] || ""}
          </span>
        );
      })}
    </div>
  );
}

function EmptyGuess() {
  return (
    <div className={styles.word}>
      {Array.from({ length: 5 }).map((_, i) => {
        return <span className={styles.char} key={i} />;
      })}
    </div>
  );
}
