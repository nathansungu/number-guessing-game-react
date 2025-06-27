import React, { useReducer, useState } from "react";
import "./App.css";

import { Button, TextField } from "@mui/material";

type GameStateType = {
  guess: number;
  gameStatus: boolean | null;
  trials: number;
  generatedNumber: number;
  disableBtn: boolean;
  error:boolean;
  
};

type ActionType = { type: "guess" | "newgame"; payload: number };

const initialState: GameStateType = {
  guess: 0,
  gameStatus: null,
  trials: 0,
  generatedNumber: 0,
  disableBtn: false,
  error:false
};

function reducerFunction(state: GameStateType, action: ActionType) {
  if (action.type === "newgame") {
    return {
      guess: 0,
      gameStatus: null,
      disableBtn: true,
      trials: 10,
      generatedNumber: Math.floor(Math.random() * 100),
      error:false,
      
    };
  }

  if (action.type === "guess") {
    const input = action.payload
    if (input<=100 && input>=0) {
      const isCorrect   = action.payload === state.generatedNumber;

      const trialsLeft = isCorrect ? state.trials : state.trials - 1;
      return {
        ...state,
        error:false,
        guess: action.payload,
        gameStatus: isCorrect,
        trials: trialsLeft,
        disableBtn: isCorrect || trialsLeft <= 0 ? false : true,
        
      };
    }else{
      return {
        ...state,
        guess: action.payload,
        disableBtn: false,
        error: true
        
      };

    }
  }

  return state;
}

function HandleForm({
  dispatch,
  trials,
  gameStatus,
  disableBtn,
  
}: {
  dispatch: React.Dispatch<ActionType>;
  guess: number | null;
  trials: number;
  gameStatus: boolean | null;
  disableBtn: boolean;
  
  
}) {
  const [inputValue, setInputValue] = useState("");

  function handleGuess(e: React.MouseEvent) {
    e.preventDefault();
    const playerGuess = Number(inputValue);
    dispatch({ type: "guess", payload: playerGuess });
    setInputValue("");
  }

  return (
    <>
      <div className="header">number guessing game</div>
      <div className="startbutton">
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => dispatch({ type: "newgame", payload: 0 })}
          disabled={disableBtn}
        >
          New Game
        </Button>
      </div>

      <form>
        <div className="inputSection">
          <TextField
            label="number"
            variant="standard"
            helperText=" Input should be between 1 and 100."
            type="number"
            id="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={trials <= 0 || gameStatus === true}
          >
            {" "}
          </TextField>
        </div>

        {/* <input
          type="number"
          id="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={trials <= 0 || gameStatus === true}
        /> */}
        <Button
          variant="contained"
          size="small"
          color="success"
          type="button"
          onClick={handleGuess}
          disabled={trials <= 0 || gameStatus === true}
        >
          Guess
        </Button>
      </form>
    </>
  );
}

function HandleResults({
  gameStatus,
  trials,
  generatedNumber,
  guess,
  error,
}: {
  gameStatus: boolean | null;
  trials: number;
  generatedNumber: number;
  guess: number;
  error:boolean;
}) {
  return (
    <div className="results">
      {gameStatus === true && (
        <div className="win">You won with {trials * 10}% score</div>
      )}
      {gameStatus === false && trials >0 && !error &&(
        <>
          {guess > generatedNumber && (
            <div className="wrong">
              {guess} is greater than the secret number. {trials} trials
              remaining.
            </div>
          )}
          {guess < generatedNumber && (
            <div className="wrong">
              {guess} is less than the secret number. {trials} remaining.
            </div>
          )}
        </>
      )}

      {trials <= 0 && gameStatus === false && (
        <div className="lost">
          Ooops! You lost. The secrete number was {generatedNumber}.
        </div>
      )}
      {trials === 10 && !error && <div>New game. 10 Trials remaining</div>}
      {trials >0 && error && <div>Value should be between 1 and 100</div>}
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducerFunction, initialState);

  return (
    <>
      <HandleForm
        dispatch={dispatch}
        guess={state.guess}
        trials={state.trials}
        gameStatus={state.gameStatus}
        disableBtn={state.disableBtn}
        
      />
      <HandleResults
        gameStatus={state.gameStatus}
        trials={state.trials}
        generatedNumber={state.generatedNumber}
        guess={state.guess}
        error={state.error}
        
      />
    </>
  );
}

export default App;
