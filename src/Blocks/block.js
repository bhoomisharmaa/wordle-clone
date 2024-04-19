import { useEffect, useState } from "react";
import "./block.css";

export default function Blocks({
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
  onScreenInput,
  canAnimateRow,
  setCanAnimateRow,
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

  useEffect(() => {
    if (rowIndex <= 5) {
      const handleKeyPress = (event) => {
        const key = event.key.toUpperCase();
        if (
          /[A-Z]/.test(key) &&
          event.keyCode >= 65 &&
          event.keyCode <= 90 &&
          !onScreenInput
        ) {
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
              guesses[i][j] ? "var(--color-tone-2)" : "var(--color-tone-4)"
            }`,
            color: winningClassName
              ? "var(--color-tone-7)"
              : "var(--color-tone-1)",
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
      <div
        className={`row ${
          canAnimateRow && i === rowIndex ? "row-animate" : ""
        }`}
        key={i}
        onAnimationEnd={() => setCanAnimateRow(false)}
      >
        {blocks}
      </div>
    );
    blocks = [];
  }

  return <>{rows}</>;
}
