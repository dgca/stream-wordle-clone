import { useEffect, useMemo, useState } from "react";
import styles from "./wordle.module.css";

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

export default function Wordle() {
  const [submittedGuesses, setSubmittedGuesses] = useState<string[][]>([]);
  const [guess, setGuess] = useState<string[]>([]);

  const wordOfTheDay = useWordOfTheDay();

  useEffect(() => {
    function handleKeyDown({ key }: { key: string }) {
      console.log(key);

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
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess.length, guess]);

  const puzzleWordCharCount = useMemo(() => {
    if (wordOfTheDay === null) {
      return {};
    }
    return wordOfTheDay
      .split("")
      .reduce<Record<string, number>>((acc, char) => {
        if (!acc.hasOwnProperty(char)) {
          acc[char] = 1;
        } else {
          acc[char] += 1;
        }
        return acc;
      }, {});
  }, [wordOfTheDay]);

  if (wordOfTheDay === null) {
    return <p>Loading...</p>;
  }

  const isCorrect =
    submittedGuesses.length > 0 &&
    submittedGuesses[submittedGuesses.length - 1].join("") === wordOfTheDay;

  const isFailure = !isCorrect && submittedGuesses.length === totalGuessMax;

  return (
    <div className={styles.wordle}>
      <div className={styles.wordleBoard}>
        <SubmittedGuesses
          submittedGuesses={submittedGuesses}
          puzzleWord={wordOfTheDay}
          puzzleWordCharCount={puzzleWordCharCount}
        />
        {!isFailure && !isCorrect && <CurrentGuess guess={guess} />}

        {Array.from({
          length: totalGuessMax - submittedGuesses.length - (isCorrect ? 0 : 1),
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
  );
}

type SubmittedGuessesProps = {
  submittedGuesses: string[][];
  puzzleWord: string;
  puzzleWordCharCount: Record<string, number>;
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

function SubmittedGuess({
  guess,
  puzzleWord,
  puzzleWordCharCount,
}: GuessProps & {
  puzzleWord: string;
  puzzleWordCharCount: Record<string, number>;
}) {
  const charMap = { ...puzzleWordCharCount };

  guess.forEach((guessChar, i) => {
    const isCorrect = puzzleWord[i] === guessChar;
    if (isCorrect) {
      charMap[guessChar] -= 1;
    }
  });

  return (
    <div className={styles.submittedGuess}>
      {guess.map((guessChar, i) => {
        const puzzleChar = puzzleWord[i];
        const isCorrect = guessChar === puzzleChar;

        let isPresent = false;

        if (!isCorrect && charMap[guessChar]) {
          isPresent = true;
          charMap[guessChar] -= 1;
        }

        return (
          <span
            className={`${styles.char} ${isCorrect ? styles.correctChar : ""} ${
              isPresent ? styles.presentChar : ""
            } ${styles.guessedChar}`}
            key={i}
          >
            {guessChar}
          </span>
        );
      })}
    </div>
  );
}

function CurrentGuess({ guess }: GuessProps) {
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
type GuessProps = {
  guess: string[];
};
