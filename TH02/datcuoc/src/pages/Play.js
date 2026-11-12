import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, LETTERS, START_SCORE, TIME_PER_QUESTION } from '../data';
import { validateBet, calcChange } from '../utils';

const Play = ({ questions, playerName }) => {
    const navigate = useNavigate();    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(START_SCORE);
    const [bet, setBet] = useState(100);
    const [status, setStatus] = useState("betting");
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [rounds, setRounds] = useState([]);
    if (!playerName) {
        return <Navigate to="/" replace />;
    }
    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        if (status !== "answering") return;
        if (timeLeft <= 0) {
            handleAnswer(null);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const handleConfirmBet = (e) => {
        e.preventDefault();
        if (validateBet(bet, score)) return;
        setStatus("answering");
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedOption(null);
    };

    const handleAnswer = (optionIndex) => {
        if (status !== "answering") return;
        setSelectedOption(optionIndex);
        setStatus("revealed");
        const correct = optionIndex === currentQuestion.answer;
        const change = calcChange(bet, currentQuestion.level, correct, MULTIPLIERS);
        const newScore = Math.max(0, score + change);
        const currentRound = {
            id: currentQuestion.id,
            bet,
            correct,
            change,
            scoreAfter: newScore
        };
        const updatedRounds = [...rounds, currentRound];
        setRounds(updatedRounds);
        setScore(newScore);
        const timeout = setTimeout(() => {
            const isGameOver = currentIndex + 1 >= questions.length || newScore < 100;
            if (isGameOver) {
                const reason = newScore < 100 ? "Bạn đã cháy túi!" : "Bạn đã hoàn thành 12 câu";
                navigate("/result", { 
                    replace: true, 
                    state: { 
                        name: playerName, 
                        rounds: updatedRounds, 
                        finalScore: newScore, 
                        correctCount: updatedRounds.filter(r => r.correct).length, 
                        played: updatedRounds.length, 
                        reason 
                    } 
                });
            } else {
                setCurrentIndex(prev => prev + 1);
                setBet(100);
                setStatus("betting");
            }
        }, 2000);

        return () => clearTimeout(timeout);
    };

    if (!currentQuestion) return <p>Đang tải câu hỏi...</p>;

    const betError = validateBet(bet, score);

    return (
        <div>
            <h2>Câu {currentIndex + 1}/12 - {currentQuestion.topic} · {LEVELS[currentQuestion.level]} ({MULTIPLIERS[currentQuestion.level]}x)</h2>
            <p>Điểm hiện có: {score.toLocaleString('vi-VN')} điểm</p>

            {status === "betting" && (
                <form onSubmit={handleConfirmBet}>
                    <h3>Bước đặt cược</h3>
                    <label>
                        Mức cược: 
                        <input 
                            type="number" 
                            step="100" 
                            value={bet} 
                            onChange={(e) => setBet(Number(e.target.value))} 
                        />
                    </label>
                    {betError && <p style={{ color: 'red' }}>{betError}</p>}
                    <br />
                    <button type="submit" disabled={Boolean(betError)}>Đặt cược</button>
                </form>
            )}

            {(status === "answering" || status === "revealed") && (
                <div>
                    <p style={{ color: timeLeft <= 5 ? 'red' : 'black' }}>Còn {timeLeft} giây</p>
                    <p>Đang cược: {bet.toLocaleString('vi-VN')} điểm</p>
                    <h3>{currentQuestion.question}</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {currentQuestion.options.map((opt, idx) => {
                            let bg = 'white';
                            if (status === "revealed") {
                                if (idx === currentQuestion.answer) bg = '#00f800';
                                else if (idx === selectedOption) bg = 'red';
                            }
                            return (
                                <button 
                                    key={idx} 
                                    disabled={status === "revealed"}
                                    onClick={() => handleAnswer(idx)}
                                    style={{ background: bg, padding: '15px' }}
                                >
                                    {LETTERS[idx]}. {opt}
                                </button>
                            );
                        })}
                    </div>

                    {status === "revealed" && (
                        <p>{selectedOption === currentQuestion.answer ? `+${calcChange(bet, currentQuestion.level, true, MULTIPLIERS)} điểm` : `-${bet} điểm`}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Play;