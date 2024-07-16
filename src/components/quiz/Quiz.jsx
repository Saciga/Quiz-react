import React, { useEffect, useRef, useState } from 'react';
import { data } from '../../assets/data'; // Adjust the import path as needed
import './Quiz.css';

const QUESTIONS_PER_PAGE = 3;

const Quiz = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [lock, setLock] = useState(Array(data.length).fill(false));
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes

    const Option1 = useRef([]);
    const Option2 = useRef([]);
    const Option3 = useRef([]);
    const Option4 = useRef([]);

    const option_array = [Option1, Option2, Option3, Option4];

    const startIndex = pageIndex * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, data.length);

    useEffect(() => {
        if (timeLeft > 0 && !result) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setResult(true);
        }
    }, [timeLeft, result]);

    const checkAns = (e, ans, index) => {
        if (!lock[startIndex + index]) {
            const newLock = [...lock];
            newLock[startIndex + index] = true;
            setLock(newLock);

            if (data[startIndex + index].ans === ans) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                option_array[data[startIndex + index].ans - 1].current[startIndex + index].classList.add("correct");
            }
        }
    };

    const nextPage = () => {
        if ((pageIndex + 1) * QUESTIONS_PER_PAGE < data.length) {
            setPageIndex(pageIndex + 1);
        } else {
            setResult(true);
        }
    };

    const prevPage = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <div className="timer">
                <h2>Time Left: {formatTime(timeLeft)}</h2>
            </div>
            <hr />
            {!result ? (
                <>
                    {data.slice(startIndex, endIndex).map((question, index) => (
                        <div key={startIndex + index}>
                            <h2>{startIndex + index + 1}. {question.question}</h2>
                            <ul>
                                <li ref={el => Option1.current[startIndex + index] = el} onClick={(e) => checkAns(e, 1, index)}>{question.option1}</li>
                                <li ref={el => Option2.current[startIndex + index] = el} onClick={(e) => checkAns(e, 2, index)}>{question.option2}</li>
                                <li ref={el => Option3.current[startIndex + index] = el} onClick={(e) => checkAns(e, 3, index)}>{question.option3}</li>
                                <li ref={el => Option4.current[startIndex + index] = el} onClick={(e) => checkAns(e, 4, index)}>{question.option4}</li>
                            </ul>
                        </div>
                    ))}
                    <div className='navigation-buttons'>
                        {pageIndex > 0 && (
                            <button onClick={prevPage}>
                                Previous
                            </button>
                        )}
                        {endIndex < data.length ? (
                            <button onClick={nextPage}>
                                Next
                            </button>
                        ) : (
                            <button onClick={() => setResult(true)}>
                                Submit
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <h2>Your final score is: {score}</h2>
            )}
        </div>
    );
};

export default Quiz;
