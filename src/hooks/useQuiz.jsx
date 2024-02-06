import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";


function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

export default useQuiz;
