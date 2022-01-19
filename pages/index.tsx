import type { NextPage } from "next";
import Wordle from "../components/Wordle/Wordle";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <Wordle />
      <style jsx global>{`
        :root {
          --black: #141414;
          --white: #eef0f2;
          --yellow: #eec643;
          --green: #419d78;

          background-color: var(--black);
          color: var(--white);
        }
      `}</style>
    </div>
  );
};

export default Home;
