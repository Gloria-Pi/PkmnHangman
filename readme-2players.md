# A Pokémon Hangman Game - Competitive Version

# Author

**Author**: Gloria Paita  
**Email**: gloria.paita@edu-its.it  
**Course**: Web Developer 2024-2026  

<br>
<br>

# Approach to Solution

## 1. Creating the Core Hangman Logic

The initial logic was adapted from a single-player version of Hangman.

Please refer to the previous readme (readme.md) for more information about the code structure.

The key features added include:

* A list of Pokémon starter names used as the game's word pool.
* A visual representation of the hangman using a sequence of images.
* Validation to ensure that only single alphabetical characters are processed.
* Methods for tracking:

  * The word to guess.
  * Correct and incorrect guesses.
  * Score and round progression.

Each player is defined using an object (`p1`, `p2`) that contains all necessary data and methods to manage their own state independently.

<br>

## 2. Building the Player Interfaces

Each player has a separate game area with:

* A hangman image that updates with each wrong guess.
* A paragraph showing the word as underscores and gradually revealed letters.
* A list of previously guessed letters.
* A score counter.
* A message area for turn-by-turn feedback.

The interface also includes shared controls:

```html
<input type="text" id="player1-input" />
<input type="text" id="player2-input" />
<button id="continue-button">Continue</button>
<button id="reset-button">Reset</button>
```

Each input is wired to a keyup event that validates the input and handles the guess:

```js
inputFieldP1.addEventListener("keyup", handleP1Keyup);
inputFieldP2.addEventListener("keyup", handleP2Keyup);
```

<br>

## 3. Managing Game State

The state is controlled through modular and encapsulated methods within each player object. Each player has:

* `pickWord()` – selects a random word and initializes the display.
* `isInWord()` – validates whether the guessed letter is correct and updates the UI.
* `didPlayerWin()` and `didPlayerLose()` – determine endgame outcomes.
* `resetHearts()`, `resetGuessedLetters()`, and `resetHangman()` – utility methods to restore initial state between rounds.

Tracking turns is handled by comparing the number of guesses:

```js
function didBothPlayersHaveAGo(player1, player2) {
    if (player1.alreadyGuessedLetters.length === player2.alreadyGuessedLetters.length) {
        enableAllInputs();
    } else if (player1.alreadyGuessedLetters.length > player2.alreadyGuessedLetters.length) {
        document.querySelector("#player1-input").disabled = true;
    } else {
        document.querySelector("#player2-input").disabled = true;
    }
}
```

<br>

## 4. Adding Visual Feedback and Enhancements

### Hangman Graphics

Each incorrect guess loads a new image from the `hangmanStages` array:

```js
this.currentHangmanStage = hangmanArray[this.wrongGuesses];
hangmanNode.src = this.currentHangmanStage;
```

### Heart Display

Each player has 10 hearts shown via a string of `"❤"` symbols. These are removed progressively:

```js
this.totalHearts.splice(-1, 1);
heartP.textContent = this.totalHearts.join("");
```

When a player wins or loses, the hearts are replaced with `"VICTORY"` or `"DEFEAT"`.

### Guessed Letters

Previously guessed letters are dynamically appended to a dedicated section:

```js
const newP = document.createElement("p");
newP.textContent = this.alreadyGuessedLetters[this.alreadyGuessedLetters.length - 1];
previousPicksTitle.insertAdjacentElement("afterend", newP);
```

<br>

## 5. Game Flow and Button Logic

* `gameStartButton` triggers initial setup.
* `continue-button` lets players start a new round while retaining their scores.
* `reset-button` restores everything including scores to start fresh.

```js
continueButton.addEventListener("click", () => {
    continueForBothPlayers(p1, p2);
    disableContinueBtn();
});

resetButton.addEventListener("click", () => {
    resetForBothPlayers(p1, p2);
});
```

Inputs are disabled between turns or at the end of the game, and re-enabled appropriately:

```js
function disableAllInputs() { ... }
function enableAllInputs() { ... }
```

<br>

# Bonus Features

* Competitive 2-player mode where players alternate turns automatically.
* Poké-themed wording and narration for immersive feedback.
* Hangman images themed after classic drawing styles.
* Visual effects like flipped images for back-and-forth movement are used if extended in styling.
