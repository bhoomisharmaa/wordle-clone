import "./settings.css";

export default function Settings({
  darkMode,
  setDarkMode,
  highContrastMode,
  setHighContrastMode,
  onScreenInput,
  setOnScreenInput,
  setIsSettingsVisible,
  setCanEnter,
}) {
  return (
    <div className="opaque-background">
      <div className="settings-panel">
        <button
          className="close-button-settings"
          onClick={() => {
            setIsSettingsVisible(false);
            setCanEnter(true);
          }}
        >
          X
        </button>
        <div className="w-full p-4">
          <p className="text-center text-xl">SETTINGS</p>
          <section>
            <div className="options">
              <p className="option-font">Dark Theme</p>
              <div
                className="button-bg"
                style={{
                  backgroundColor: darkMode
                    ? "var(--color-correct)"
                    : "var(--color-tone-3)",
                }}
              >
                <button
                  className="settings-button"
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    animation: `${
                      darkMode ? "slide-right" : "slide-left"
                    } 0.5s ease forwards`,
                  }}
                ></button>
              </div>
            </div>
            <div className="options">
              <p className="option-font">
                High Contrast Mode
                <p className="font-extralight text-[12px]">
                  Contrast and colorblindness improvements
                </p>
              </p>
              <div
                className="button-bg"
                style={{
                  backgroundColor: highContrastMode
                    ? "var(--color-correct)"
                    : "var(--color-tone-3)",
                }}
              >
                <button
                  className="settings-button"
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  style={{
                    animation: `${
                      highContrastMode ? "slide-right" : "slide-left"
                    } 0.5s ease forwards`,
                  }}
                ></button>
              </div>
            </div>
            <div className="options">
              <p className="option-font">
                Onscreen Keyboard Input Only{" "}
                <p className="font-extralight text-[12px]">
                  Ignore key input except from the onscreen keyboard. Most
                  helpful for users using speech recognition or other assistive
                  devices.
                </p>
              </p>
              <div
                className="button-bg"
                style={{
                  backgroundColor: onScreenInput
                    ? "var(--color-correct)"
                    : "var(--color-tone-3)",
                }}
              >
                <button
                  className="settings-button"
                  onClick={() => setOnScreenInput(!onScreenInput)}
                  style={{
                    animation: `${
                      onScreenInput ? "slide-right" : "slide-left"
                    } 0.5s ease forwards`,
                  }}
                ></button>
              </div>
            </div>
          </section>
          <section>
            <div className="options">
              <p className="option-font">Feedback</p>
              <a
                href="https://www.instagram.com/_bhoomisharma?igsh=b2phaWZneWhyemx5"
                target="_blank"
              >
                Instagram
              </a>
            </div>
            <div className="options">
              <p className="option-font">Report a bug</p>
              <a href="mailto: bhoomisharma404@gmail.com">Email</a>
            </div>
            <div className="options">
              <p className="option-font">Questions?</p>
              <a href="https://help.nytimes.com/hc/en-us/articles/24611727334932-Wordle">
                FAQ
              </a>
            </div>
            <div className="options">
              <p className="option-font">Community</p>
              <a href="https://www.nytimes.com/spotlight/wordle-review">
                Wordle Review
              </a>
            </div>
            <p className="text-xs font-light mt-3">© 2024 Bhoomi Sharma</p>
          </section>
        </div>
      </div>
    </div>
  );
}
