import PropTypes from "prop-types";
import useQuiz from "../hooks/useQuiz";

Options.propTypes = {
  question: PropTypes.object,
};

function Options({ question }) {
  const { answer, dispatch } = useQuiz();

  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          key={option}
          disabled={hasAnswered}
          className={`btn btn-option  ${index === answer ? "answer" : ""}  ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
