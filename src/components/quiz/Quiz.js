import React, { useState, useEffect } from 'react';
import que from './questions.json';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [questionsNew, setQuestionsNew] = useState([]);
    const [dataLoaded,setDataLoaded]=useState(false)

    useEffect(() => {
        setQuestions(que)  
      }, [questions]);
   
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      useEffect(()=>{

    const shuffledQuestions = shuffleArray(questions);
  const selectedQuestions = shuffledQuestions.slice(0, 20);
  setQuestionsNew(selectedQuestions)

      },[questions])

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (answerIndex) => {
        const isCorrect = answerIndex === questionsNew[currentQuestion].correctOptionIndex;
        setUserAnswers({
            ...userAnswers,
            [currentQuestion]: {
                selected: answerIndex,
                correct: isCorrect,
            }
        });
        setScore(score + (isCorrect ? 1 : 0));

        setTimeout(() => {
            if (currentQuestion < questionsNew.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers({});
        setScore(0);
        setShowResult(false);
    };

    return (
        <div className="container mt-5 mb-5">
            {showResult ? (
                <div>
                    <h2>Quiz Result</h2>
                    <p>Your score: {score}</p>
                    <div>
                        {questionsNew.map((question, index) => (
                            <div className='bg-primary-subtle card p-2 m-2' key={index}>
                               <p className='text-primary m-0 p-0'> Question {index + 1}: {question.text}</p>
                                
                                Your Answer: {question.options[userAnswers[index]?.selected]}
                                <br />
                                Correct Answer: {question.options[question.correctOptionIndex]}
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={resetQuiz}>Restart Quiz</button>
                </div>
            ) : (
                <div>
                    <h2>Question {currentQuestion + 1}</h2>
                    <p>{questionsNew[currentQuestion]?.text}</p>
                    <ul className="list-group">
                        {questionsNew[currentQuestion]?.options.map((option, index) => (
                            <li
                                key={index}
                                className={`list-group-item ${userAnswers[currentQuestion]?.selected === index ? (index === questionsNew[currentQuestion].correctOptionIndex ? 'bg-primary text-light' : 'bg-primary text-light') : ''}`}
                                onClick={() => handleAnswer(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Quiz;
