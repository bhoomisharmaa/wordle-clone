import { useState } from "react";
import "./App.css";
import Keyboard from "./Keyboard/Keyboard";
import Blocks from "./Blocks/block";
import HowToPlay from "./Lil-Intro/howToPlay";
import Settings from "./Settings/settings";
let keyLetters = []; //stores letters entered in wordle guesses
let keyColors = []; //stores colors of keys of virtual on screen keyboard

async function checkIsLetterValid(word) {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/dictionary?word=${word}`,
      {
        headers: {
          "X-Api-Key": process.env.REACT_APP_API_KEY,
        },
      }
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} ${errorMessage}`);
    }
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error("Request failed:", error);
  }
}

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
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrastMode, setHighConstrastMode] = useState(false);
  const [onScreenInput, setOnScreenInput] = useState(false);
  const [canAnimateRow, setCanAnimateRow] = useState(false);
  const [remarkMessage, setRemarkMessage] = useState("");

  const checkAnswer = (letter, letterIndex) => {
    // Checks the answer input by the user
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

    if (
      checksIfLetterIsPresent(
        wordArray,
        letter,
        setWordArray,
        letterIndex,
        guesses[rowIndex]
      )
    ) {
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
    // handle letter key input by the player(screen keyboard and the og one)
    if (canEnter && !hasWon[0] && !isGuideVisible && !isSettingsVisible) {
      const newGuesses = [...guesses];
      newGuesses[rowIndex][blockIndex] = letter;
      setGuesses(newGuesses);
      setBlockIndex(blockIndex + 1);

      // player can't enter if all the blocks in the row is filled
      if (blockIndex >= 4) {
        setCanEnter(false);
      }
    }
  };

  const handleBackSpaceClick = () => {
    // this little man hanldes backspace key input
    if (blockIndex > 0 && !hasWon[0] && !isSettingsVisible && !isGuideVisible) {
      const newGuesses = [...guesses];
      newGuesses[rowIndex][blockIndex - 1] = "";
      setGuesses(newGuesses);
      setBlockIndex(blockIndex - 1);
      setCanEnter(true);
    }
  };

  const handleEnterClick = async () => {
    // bro handles enter key input
    let guessedWord = "";
    guesses[rowIndex].map((letter) => {
      guessedWord += letter.toLowerCase();
    });
    const letterValid = await checkIsLetterValid(guessedWord);
    const winningRemark = [
      "Slaying",
      "W!",
      "Einstein Who?",
      "Legend",
      "Mad Props",
      "Phew",
    ];
    if (
      blockIndex > 4 &&
      !hasWon[0] &&
      !isSettingsVisible &&
      !isGuideVisible &&
      letterValid
    ) {
      let newAnimate = [...canAnimate];
      newAnimate[rowIndex] = true;
      setCanAnimate(newAnimate);
      guesses[rowIndex].map((letter, index) => {
        checkAnswer(letter, index);
        if (index >= 4) {
          // (bool array) checks if all the letters are correct an in correct order
          const isCorrect = wordArray.map((letter, index) => {
            return guesses[rowIndex][index] === letter[0];
          });

          setHasWon([!isCorrect.includes(false), rowIndex]);
          setRowIndex(rowIndex + 1);
          setWordArray(word.split("").map((char) => [char.charAt(0), true]));
          if (!isCorrect.includes(false)) {
            setRemarkMessage(winningRemark[rowIndex]);
          }

          if (rowIndex >= 5 && isCorrect.includes(false)) {
            setRemarkMessage(word);
          }
        }
      });
    } else {
      setCanAnimateRow(true);
      if (blockIndex <= 4) {
        setRemarkMessage("Not Enough Letters");
      } else {
        setRemarkMessage("Not in Word List");
      }
    }
  };

  return (
    <body
      className={`${darkMode ? "dark" : ""} ${
        highContrastMode ? "colorblind" : ""
      }`}
    >
      <header>
        <div>--</div>
        <h1 className="">Wordle</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsGuideVisible(true);
            }}
          >
            ?
          </button>
          <button
            onClick={() => {
              setIsSettingsVisible(true);
            }}
          >
            @
          </button>
        </div>
      </header>
      <div className="main-screen relative">
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
            onScreenInput={onScreenInput}
            canAnimateRow={canAnimateRow}
            setCanAnimateRow={setCanAnimateRow}
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
        {isGuideVisible ? (
          <HowToPlay setCanShowGuide={setIsGuideVisible} />
        ) : null}
        {isSettingsVisible ? (
          <Settings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            highContrastMode={highContrastMode}
            setHighContrastMode={setHighConstrastMode}
            onScreenInput={onScreenInput}
            setOnScreenInput={setOnScreenInput}
            setIsSettingsVisible={setIsSettingsVisible}
          />
        ) : null}
        {canAnimateRow || hasWon[0] || rowIndex > 5 ? (
          <div className="remark">{remarkMessage}</div>
        ) : (
          ""
        )}
      </div>
    </body>
  );
}

function checksIfLetterIsPresent(
  wordArray,
  letter,
  setWordArray,
  letterIndex,
  guesses
) {
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
    for (let j = letterIndex + 1; j <= 4; j++) {
      if (guesses[j] === wordArray[j][0]) {
        letterAageHaiKya = true;
      }
    }

    if (letterAageHaiKya) return false;
    else return true;
  }
}

export default App;
