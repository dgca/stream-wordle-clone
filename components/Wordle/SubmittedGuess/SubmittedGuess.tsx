import styles from "./submittedGuess.module.css";

import type { GuessType, PuzzleWordCharCountType } from "../types";

type SubmittedGuessProps = {
  puzzleWord: string;
  guess: GuessType;
  puzzleWordCharCount: PuzzleWordCharCountType;
};

type GuessedCharStatus = "correct" | "incorrect" | "present";

function useGuessChecker(
  charMap: PuzzleWordCharCountType,
  word: string,
  guess: GuessType
) {
  const charMapWithCorrectGuesses = { ...charMap };

  guess.forEach((guessChar, i) => {
    const isCorrect = word[i] === guessChar;
    if (isCorrect) {
      charMapWithCorrectGuesses[guessChar] -= 1;
    }
  });

  const checkedGuess = guess.map(
    (
      char,
      i
    ): {
      status: GuessedCharStatus;
      char: string;
    } => {
      const isCorrect = char === word[i];
      let isPresent = false;

      if (!isCorrect && charMapWithCorrectGuesses[char]) {
        charMapWithCorrectGuesses[char] -= 1;
        isPresent = true;
      }

      return {
        status: isCorrect ? "correct" : isPresent ? "present" : "incorrect",
        char,
      };
    }
  );

  return checkedGuess;
}

export default function SubmittedGuess({
  guess,
  puzzleWord,
  puzzleWordCharCount,
}: SubmittedGuessProps) {
  const checkedGuess = useGuessChecker(puzzleWordCharCount, puzzleWord, guess);

  return (
    <div className={styles.submittedGuess}>
      {checkedGuess.map(({ status, char }, i) => {
        const isCorrect = status === "correct";
        const isPresent = status === "present";
        return (
          <span
            className={`${styles.char} ${isCorrect ? styles.correctChar : ""} ${
              isPresent ? styles.presentChar : ""
            } ${styles.guessedChar}`}
            key={i}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
