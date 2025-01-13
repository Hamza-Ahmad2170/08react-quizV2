import { createContext, useEffect, useReducer } from "react";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  index: 0,
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "newAnswer":
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === state.questions.at(state.index).correctOption
            ? state.points + state.questions.at(state.index).points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highScore: state.highScore,
        status: "ready",
      };

    default:
      throw new Error("Action unknown ");
  }
}

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((preValue, currValue) => {
    return preValue + currValue.points;
  }, 0);

  function fetchData() {
    if (!import.meta.env.MODE === "development") {
      return fetch("http://localhost:8000/questions");
    }
    return fetch(import.meta.env.VITE_NPOINT_URL);
  }

  useEffect(() => {
    fetchData()
      .then((res) => res.json())
      .then((data) => {
        if (!import.meta.env.MODE === "development") {
          return dispatch({ type: "dataReceived", payload: data });
        }

        return dispatch({
          type: "dataReceived",
          payload: data.questions,
        });
      })
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export { QuizProvider, QuizContext };
