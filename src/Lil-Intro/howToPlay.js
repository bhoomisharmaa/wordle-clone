import "./howToPlay.css";

export default function HowToPlay({ setCanShowGuide }) {
  return (
    <div className="opaque-background">
      <div className="intro">
        <button
          className="close-button"
          onClick={() => {
            setCanShowGuide(false);
          }}
        >
          X
        </button>
        <div className="p-4 w-full">
          <h2>How To Play</h2>
          <h3>Guess the Wordle in 6 tries.</h3>
          <ul>
            <li>Each guess must be a valid 5-letter word.</li>
            <li>
              The color of the tiles will change to show how close your guess
              was to the word.
            </li>
          </ul>
          <p>
            <strong>Examples</strong>
          </p>
          <div className="example-row">
            <div
              className="block-example"
              style={{
                border: "2px solid var(--color-correct)",
                backgroundColor: "var(--color-correct)",
                color: "var(--color-tone-7)",
                animation: "flip-in 0.8s 0.3s ease forwards",
              }}
            >
              K
            </div>
            <div className="block-example">A</div>
            <div className="block-example">N</div>
            <div className="block-example">Y</div>
            <div className="block-example">E</div>
          </div>
          <p className="font-medium">
            <strong>K</strong> is in the word and in the correct spot.
          </p>
          <div className="example-row">
            <div className="block-example">M</div>
            <div className="block-example">E</div>
            <div
              className="block-example"
              style={{
                border: "2px solid var(--color-present)",
                backgroundColor: "var(--color-present)",
                color: "var(--color-tone-7)",
                animation: "flip-in 0.8s 0.3s ease forwards",
              }}
            >
              T
            </div>
            <div className="block-example">R</div>
            <div className="block-example">O</div>
          </div>
          <p className="font-medium">
            <strong>T</strong> is in the word but in the wrong spot.
          </p>
          <div className="example-row">
            <div className="block-example">C</div>
            <div
              className="block-example"
              style={{
                border: "2px solid var(--color-absent)",
                backgroundColor: "var(--color-absent)",
                color: "var(--color-tone-7)",
                animation: "flip-in 0.8s 0.3s ease forwards",
              }}
            >
              A
            </div>
            <div className="block-example">R</div>
            <div className="block-example">T</div>
            <div className="block-example">I</div>
          </div>
          <p className="font-medium">
            <strong>A</strong> is not in the word in any spot.
          </p>
        </div>
      </div>
    </div>
  );
}
