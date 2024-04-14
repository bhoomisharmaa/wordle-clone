import { useState } from "react";
import "./keyboard.css";

export default function Keyboard({
  hanldeOnClick,
  handleBackSpaceClick,
  handleEnterClick,
  keysColor,
  keysLetter,
}) {
  const letters_in_QWERT_format = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  let letterRow1 = [];
  let letterRow2 = [];
  let letterRow3 = [];
  const allRows = [letterRow1, letterRow2, letterRow3];

  //Splits each character and stores in respective array
  letters_in_QWERT_format.map((row, index) => {
    row.split("").map((char) => allRows[index].push(char));
  });

  const setBgColor = (letter) => {
    let keyColor;
    keysLetter.map((key, index) => {
      if (key.includes(letter)) {
        keyColor = keysColor[index];
      }
    });
    return keyColor;
  };

  let keyboardRow1 = [];
  letterRow1.map((letter) =>
    keyboardRow1.push(
      <button
        className="letter-button"
        key={letter}
        onClick={() => hanldeOnClick(letter)}
        style={{
          backgroundColor: setBgColor(letter)
            ? setBgColor(letter)
            : "var(--key-bg)",
        }}
      >
        {letter}
      </button>
    )
  );
  let keyboardRow2 = [];
  letterRow2.map((letter) =>
    keyboardRow2.push(
      <button
        className="letter-button"
        key={letter}
        onClick={() => hanldeOnClick(letter)}
        style={{
          backgroundColor: setBgColor(letter)
            ? setBgColor(letter)
            : "var(--key-bg)",
        }}
      >
        {letter}
      </button>
    )
  );
  let keyboardRow3 = [];
  letterRow3.map((letter) =>
    keyboardRow3.push(
      <button
        className="letter-button"
        key={letter}
        onClick={() => hanldeOnClick(letter)}
        style={{
          backgroundColor: setBgColor(letter)
            ? setBgColor(letter)
            : "var(--key-bg)",
        }}
      >
        {letter}
      </button>
    )
  );

  return (
    <>
      <div className="row1">{keyboardRow1}</div>
      <div className="row2">{keyboardRow2}</div>
      <div className="row3">
        <button
          className="enter-button"
          key={"Enter"}
          onClick={handleEnterClick}
        >
          ENTER
        </button>
        {keyboardRow3}
        <button
          className="letter-button"
          key={"Backspace"}
          onClick={handleBackSpaceClick}
          style={{ backgroundColor: "var(--key-bg)" }}
        >
          BKSP
        </button>
      </div>
    </>
  );
}
