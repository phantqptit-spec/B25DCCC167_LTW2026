
import {useParams, useNavigate} from 'react-router-dom';
import {LEVELS, MULTIPLIERS, LETTERS, formatMultiplier} from '../data';
const QuestionDetail = ({ questions = [], bookmarks = [], toggleBookmark }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const questionId = Number(id);
    const question = questions.find(item => item.id === questionId);
    if (!question) {
        return (
            <div>
                <h2>Không tìm thấy câu hỏi</h2>
                <button onClick={() => navigate(-1)}>Quay lại</button>
            </div>
        );
    }
    const isBookmarked = bookmarks.includes(question.id);
    return (
        <div>
            <h1>Câu hỏi số {question.id} - {question.topic} · {LEVELS[question.level]} ({formatMultiplier(MULTIPLIERS[question.level])})</h1>
            <h3>{question.question}</h3>
            <div>
                {question.options.map((option, index) => (
                    <p
                        key={index}
                        style={{
                            backgroundColor: index === question.answer ? '#00f800' : 'transparent',
                            padding: '10px'
                        }}
                    >
                        {LETTERS[index]}. {option}
                        {index === question.answer && ' (Đáp án đúng)'}
                    </p>
                ))}
            </div>
            <p>Gợi ý: {question.hint}</p>
            <button onClick={() => toggleBookmark(question.id)}>
                {isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
            </button>
            <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    )
}

export default QuestionDetail
