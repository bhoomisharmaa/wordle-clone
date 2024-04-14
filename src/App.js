import { useEffect, useState } from "react";
import "./App.css";
import Keyboard from "./Keyboard";

let keyLetters = [];
let keyColors = [];

function App() {
  const word = "MOIST";

  // stores all guesses of the player
  const [guesses, setGuesses] = useState([
    Array(word.length).fill(""),
    Array(word.length).fill(""),
    Array(word.length).fill(""),
    Array(word.length).fill(""),
    Array(word.length).fill(""),
    Array(word.length).fill(""),
  ]);
  const [blockIndex, setBlockIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [canEnter, setCanEnter] = useState(true);
  // ['letter', ispresent]
  const [wordArray, setWordArray] = useState(
    word.split("").map((char) => [char.charAt(0), true])
  );
  const [canAnimate, setCanAnimate] = useState(Array(6).fill(false));
  const [animationName, setAnimationName] = useState([
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
    Array(5).fill(""),
  ]);
  const [hasWon, setHasWon] = useState([false, 0]);
  const [letterIsPresentInKey, setLetterIsPresentInKey] = useState(false);
  let letterChecked = 0;

  const checkAnswer = (letter, letterIndex) => {
    let newBgColor = [...animationName];
    let returnColor = "";

    if (wordArray[letterIndex][0] === letter) {
      let newWordArray = [...wordArray];
      newWordArray[letterIndex][1] = false;
      setWordArray(newWordArray);
      newBgColor[rowIndex][letterIndex] = "flip-in-correct";
      setAnimationName(newBgColor);
      returnColor = "flip-in-correct";
      keyLetters.push(letter);
      keyColors.push("var(--color-correct)");
    }

    if (checksIfLetterIsPresent(wordArray, letter, setWordArray, letterIndex)) {
      returnColor = "flip-in-present";
      if (!keyLetters.includes(letter)) {
        keyLetters.push(letter);
        keyColors.push("var(--color-present)");
      }
    } else if (wordArray[letterIndex][0] !== letter) {
      returnColor = "flip-in-absent";
      if (!keyLetters.includes(letter)) {
        keyLetters.push(letter);
        keyColors.push("var(--color-absent)");
      }
    }
    newBgColor[rowIndex][letterIndex] = returnColor;
    setAnimationName(newBgColor);
  };

  const handleLetterClick = (letter) => {
    if (canEnter && !hasWon[0]) {
      const newGuesses = [...guesses];
      newGuesses[rowIndex][blockIndex] = letter;
      setGuesses(newGuesses);
      setBlockIndex(blockIndex + 1);

      if (blockIndex >= 4) {
        setCanEnter(false);
      }
    }
  };

  const handleBackSpaceClick = () => {
    if (blockIndex > 0 && !hasWon[0]) {
      const newGuesses = [...guesses];
      newGuesses[rowIndex][blockIndex - 1] = "";
      setGuesses(newGuesses);
      setBlockIndex(blockIndex - 1);
      setCanEnter(true);
    }
  };

  const handleEnterClick = () => {
    if (blockIndex > 4 && !hasWon[0]) {
      let newAnimate = [...canAnimate];
      newAnimate[rowIndex] = true;
      setCanAnimate(newAnimate);
      guesses[rowIndex].map((letter, index) => {
        checkAnswer(letter, index);
        if (index >= 4) {
          const isCorrect = wordArray.map((letter, index) => {
            return guesses[rowIndex][index] === letter[0];
          });

          setHasWon([!isCorrect.includes(false), rowIndex]);
          setRowIndex(rowIndex + 1);
          setWordArray(word.split("").map((char) => [char.charAt(0), true]));
        }
      });
    }
  };

  return (
    <>
      <header>
        <h1 className="">Wordle</h1>
      </header>
      <div className="main-screen">
        <div className="center-board">
          <Blocks
            hanldeOnClick={handleLetterClick}
            handleBackSpaceClick={handleBackSpaceClick}
            handleEnterClick={handleEnterClick}
            guesses={guesses}
            rowIndex={rowIndex}
            setBlockIndex={setBlockIndex}
            setCanEnter={setCanEnter}
            wordArray={wordArray}
            canAnimate={canAnimate}
            setCanAnimate={setCanAnimate}
            animationName={animationName}
            setAnimationName={setAnimationName}
            hasWon={hasWon}
          />
        </div>
        <div className="keyboard">
          <Keyboard
            hanldeOnClick={handleLetterClick}
            handleBackSpaceClick={handleBackSpaceClick}
            handleEnterClick={handleEnterClick}
            animationName={animationName}
            guesses={guesses}
            rowIndex={rowIndex}
            keysColor={keyColors}
            keysLetter={keyLetters}
          />
        </div>
      </div>
    </>
  );
}

function Blocks({
  hanldeOnClick,
  handleBackSpaceClick,
  handleEnterClick,
  guesses,
  rowIndex,
  setBlockIndex,
  setCanEnter,
  wordArray,
  canAnimate,
  setCanAnimate,
  animationName,
  hasWon,
}) {
  let blocks = [];
  let rows = [];

  const [canCheckRow, setCanCheckRow] = useState(Array(6).fill(false));

  const [isWord, setIsWord] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState([
    Array(5).fill(false),
    Array(5).fill(false),
    Array(5).fill(false),
    Array(5).fill(false),
    Array(5).fill(false),
    Array(5).fill(false),
  ]);

  async function checkIfWordisValid(searchWord) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`).then(
      async (response) => {
        const data = await response.json();
        return Array.isArray(data);
      }
    );
  }

  useEffect(() => {
    if (rowIndex <= 5) {
      const handleKeyPress = (event) => {
        const key = event.key.toUpperCase();
        if (/[A-Z]/.test(key) && event.keyCode >= 65 && event.keyCode <= 90) {
          hanldeOnClick(key);
        } else if (key === "BACKSPACE") {
          handleBackSpaceClick();
        } else if (key === "ENTER") {
          handleEnterClick();
        }
      };

      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [guesses, rowIndex, wordArray, canCheckRow]);

  const animationDelay = ["0ms", "200ms", "400ms", "600ms", "800ms"];
  const [winningClassName, setWinningClassName] = useState("");
  const handleAnimationEnd = (i, j) => {
    let newAnimation = [...isAnimationFinished];
    newAnimation[i][j] = true;
    setIsAnimationFinished(newAnimation);
    if (j === 4) {
      const newCheckArray = [...canCheckRow];
      newCheckArray[rowIndex] = true;
      setCanCheckRow(newCheckArray);
      setBlockIndex(0);
      setCanEnter(true);
      if (hasWon[0]) {
        setWinningClassName("winningRow");
        let newAnimate = [...canAnimate];
        newAnimate[rowIndex - 1] = false;
        setCanAnimate(newAnimate);
        // const newAnimation = [...animationName];
        // newAnimation[i][j] = "winningJump";
        // setAnimationName(newAnimation);
      }
    }
  };

  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 4; j++) {
      blocks.push(
        <div
          className={`block ${i === hasWon[1] ? winningClassName : ""}`}
          key={j}
          onAnimationEnd={() => handleAnimationEnd(i, j)}
          style={{
            border: `2px solid ${
              guesses[i][j] ? "var(--color-tone-3)" : "var(--color-tone-4)"
            }`,
            color: winningClassName ? "var(--color-tone-7)" : "black",
            animation: canAnimate[i]
              ? `${animationName[i][j]} 1s ${animationDelay[j]} ease forwards`
              : hasWon[0] && i === hasWon[1]
              ? `winningJump 0.4s ${animationDelay[j]} ease forwards`
              : "",
          }}
        >
          {guesses[i][j]}
        </div>
      );
    }
    rows.push(
      <div className="row" key={i}>
        {blocks}
      </div>
    );
    blocks = [];
  }

  return <>{rows}</>;
}

function checksIfLetterIsPresent(wordArray, letter, setWordArray, letterIndex) {
  let ispresent = false;

  for (let i = 0; i <= 4; i++) {
    if (wordArray[i].includes(letter) && wordArray[i][1]) {
      let newWordArray = [...wordArray];
      newWordArray[i][1] = false;
      setWordArray(newWordArray);
      ispresent = true;
    }
  }

  if (ispresent) {
    let letterAageHaiKya = false;
    for (let j = letterIndex; j <= 4; j++) {
      if (wordArray[j][0] === letter) {
        console.log(wordArray[j][0] + " " + letter + " " + letterIndex);
        letterAageHaiKya = true;
      }
    }

    if (letterAageHaiKya) return false;
    else return true;
  }
}

export default App;
