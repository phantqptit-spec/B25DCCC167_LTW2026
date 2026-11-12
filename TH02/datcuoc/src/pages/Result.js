import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getResult } from '../utils';
const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    if (!data) return <Navigate to="/" replace />;
    const { name, finalScore, correctCount, played, reason } = data;
    const evaluation = getResult(finalScore);
    return (
        <div>
            <h2>{reason}</h2>
            <p>Người chơi: {name}</p>
            <p>Số câu trả lời đúng: {correctCount}/{played}</p>
            <p>Điểm cuối: {finalScore.toLocaleString('vi-VN')} điểm</p>
            <p>Đánh giá: {evaluation}</p>

            <h3>Biểu đồ điểm</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', gap: '15px', borderBottom: '2px solid black', paddingBottom: '5px' }}>
                {data.rounds && data.rounds.map((round, idx) => {
                    const heightPx = Math.max(10, Math.min(200, (round.scoreAfter / 3000) * 200));
                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px' }}>{round.scoreAfter}</span>
                            <div style={{ width: '30px', height: `${heightPx}px`, background: round.correct ? 'green' : 'red' }}></div>
                            <span style={{ fontSize: '12px' }}>{idx + 1}</span>
                        </div>
                    );
                })}
            </div>

            <br />
            <button onClick={() => navigate("/play", { replace: true })}>Chơi lại</button>
            <button onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
    );
};

export default Result;