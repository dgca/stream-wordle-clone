import { useMemo } from "react";
import styles from "./keyboard.module.css";

type KeyPressHandlerType = (key: string) => void;

type KeyboardProps = {
  keyPressHandler: KeyPressHandlerType;
};

export default function Keyboard({ keyPressHandler }: KeyboardProps) {
  const top = useMemo(() => {
    return "qwertyuiop".split("").map((char) => {
      return (
        <Key keyPressHandler={keyPressHandler} key={char} keyName={char} />
      );
    });
  }, [keyPressHandler]);

  const middle = useMemo(() => {
    return "asdfghjkl".split("").map((char) => {
      return (
        <Key keyPressHandler={keyPressHandler} key={char} keyName={char} />
      );
    });
  }, [keyPressHandler]);

  const bottom = useMemo(() => {
    const letters = "zxcvbnm".split("").map((char) => {
      return (
        <Key keyPressHandler={keyPressHandler} key={char} keyName={char} />
      );
    });
    const enterKey = (
      <Key
        small
        keyPressHandler={keyPressHandler}
        key="Enter"
        keyName="Enter"
      />
    );
    const backspaceKey = (
      <Key
        small
        keyPressHandler={keyPressHandler}
        key="Backspace"
        keyName="Backspace"
      />
    );
    return [enterKey, ...letters, backspaceKey];
  }, [keyPressHandler]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>{top}</div>
      <div className={styles.row}>{middle}</div>
      <div className={styles.row}>{bottom}</div>
    </div>
  );
}

type KeyProps = {
  small?: boolean;
  keyName: string;
  keyPressHandler: KeyPressHandlerType;
};

function Key({ keyName, keyPressHandler, small }: KeyProps) {
  return (
    <span
      className={`${styles.key} ${small ? styles.smallKey : ""}`}
      onClick={() => {
        keyPressHandler(keyName);
      }}
    >
      {keyName}
    </span>
  );
}
