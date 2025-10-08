# A Pokémon Hangman Game

# Author

**Author**: Gloria Paita  
**Email**: gloria.paita@edu-its.it  
**Course**: Web Developer 2024-2026

<br>

# Code Overview

This project transforms a basic word guessing game into a fully interactive **Pokémon-themed Hangman**.

It uses HTML/CSS/JavaScript to simulate:

* A graphical hangman (via images).
* Lives represented as hearts.
* Letter validation and feedback.
* Score tracking and custom player naming.
* Input disabling and button-based game progression.

The game selects a random starter Pokémon name as the target word. The player has 10 attempts to guess it correctly, letter by letter.

<br>

# Structure and Logic

## 1. 🧱 HTML Setup

The interface includes:

* A start screen to input the player’s name.
* A game screen with:

  * Score and badge counter
  * Letter input box
  * A live-updating hangman image
  * Remaining tries displayed as hearts
  * A list of previous guesses
  * Buttons: `Continue`, `Reset`, and `Start Game`

### Key HTML snippet:

```html
<input type="text" maxlength="1" pattern="[A-Za-z]" id="player1-input">
```

This ensures the input field only accepts single alphabetic characters.

<br>

## 2. 🎮 Game Flow

### Start the game

```js
gameStartButton.addEventListener("click", () => {
    p1.setName();
    // ...
    p1.pickWord(starterPokemon);
    registerP1Letters();
});
```

* When the start button is clicked, the player’s name is saved.
* A random Pokémon is selected from `starterPokemon`.
* All relevant elements are made visible and reset.

<br>

## 3. 💡 Word Selection and Display

```js
p1.pickWord = function (listOfWords) {
    const pickedWordIndex = Math.floor((Math.random() * listOfWords.length));
    this.pickedWord = listOfWords[pickedWordIndex].toUpperCase();
    this.pickedWordArray = this.pickedWord.split("");
    this.blankSpacesArray = this.pickedWord.replace(/[A-Z]/gi, "_").split("");
    this.updateBlanks();
};
```

* Chooses a word at random from a predefined list.
* Converts it into two arrays: one for the actual letters, one for blanks (`_`).

<br>

## 4. ⌨️ Letter Input Logic

```js
function handleP1Keyup(event) {
    let pressedKey = event.key.toUpperCase();
    // Input validation
    if (/^[A-Z]$/i.test(pressedKey)) {
        if (p1.alreadyGuessedLetters.includes(pressedKey)) {
            p1.msgToThePlayer("You've already caught that letter!");
        } else {
            p1.alreadyGuessedLetters.push(pressedKey);
            p1.isInWord();
        }
    }
    // Other invalid keys
}
```

* Verifies that only letters are accepted.
* Prevents duplicate guesses.
* Delegates logic to `isInWord`.

<br>

## 5. 🧠 Word Evaluation

### If correct:

```js
if (this.pickedWordArray.indexOf(selectedLetter) !== -1) {
    this.blankSpacesArray[index] = selectedLetter;
    this.updateBlanks();
    this.msgToThePlayer(...);
    this.didPlayerWin();
}
```

### If wrong:

```js
this.removeHearts();
this.wrongGuesses++;
this.updateHangman(hangmanStages);
this.didPlayerLose();
```

Correct guesses reveal letters; wrong ones update the hangman image and remove a heart.

<br>


## 6. 🎯 Win / Lose Conditions

### Winning:

```js
if (this.pickedWordArray.join("") === this.blankSpacesArray.join("")) {
    this.msgToThePlayer("Victory!");
    this.giveAPoint();
    heartP.textContent = "VICTORY";
    disableAllInputs();
    enableContinueBtn();
}
```

### Losing:

```js
if (this.wrongGuesses === 9) {
    this.msgToThePlayer("You lost!");
    heartP.textContent = "DEFEAT";
    document.querySelector("#player1-input").disabled = true;
}
```

The game disables inputs when the match ends, showing appropriate messages and visuals.

<br>


## 7. 🖼️ Visual Feedback

Each incorrect guess updates a graphic stored in `hangmanStages[]`:

```js
this.updateHangman = function (hangmanArray) {
    this.currentHangmanStage = hangmanArray[this.wrongGuesses];
    const hangmanNode = document.querySelector("#p1-hangman");
    hangmanNode.src = this.currentHangmanStage;
};
```

Hearts are updated by manipulating an array of `❤` characters:

```js
this.totalHearts = ["❤", "❤", ...];
```

<br>


## 8. 🧼 Game Reset and Continuation

Players can either:

* Continue: reset only the current match
* Reset: full game reset (including score)

```js
function continueForSinglePlayer(player1) {
    player1.resetHearts();
    player1.resetHangman();
    player1.resetGuessedLetters();
    resetP1LetterHistory();
    player1.pickWord(starterPokemon);
    registerP1Letters();
}
```

```js
function resetForSinglePlayer(player1) {
    player1.resetScore();
    continueForSinglePlayer(player1);
}
```

<br>

# Additional Features

✓  Hearts instead of simple counters for remaining guesses
 
✓  Live score tracking (Pokémon badges)
 
✓  Letter history display
 
✓  Hangman illustrations in Pokémon style
 
✓  Input restrictions and keyboard event validation
 
✓  Dynamic narration messages from "Trainer 1"

<br>

# Example Outputs

* After a correct guess of `A`:

  > GOTCHA, letter "A" was caught!

* After a wrong guess of `Z`:

  > Oh no, the letter "Z" ran away!

* After a win:

  > Victory! You gained +1 gym badges!

* After a loss:

  > Oh no, you lost! Want a rematch?
