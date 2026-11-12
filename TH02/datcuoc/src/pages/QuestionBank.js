import {useState} from "react";
import { Link } from 'react-router-dom';
import {LEVELS, MULTIPLIERS, formatMultiplier} from '../data';
const QuestionBank=({questions, bookmarks, toggleBookmark}) => {
    const [selectedLevels, setSelectedLevels] = useState([1, 2, 3]);
    const [onlyBookmarked, setOnlyBookmarked] = useState(false);
    const [searchText, setSearchText] = useState('');
    const handleLevelChange = (level) => {
        if (selectedLevels.includes(level)) {
            setSelectedLevels(selectedLevels.filter(items => items !== level))
        } else {
            setSelectedLevels([...selectedLevels, level])
        }
    };
    const handleBookmarkShift=(event) => {
        setSearchText(event.target.value)
    };
    const filteredQuestions = questions.filter(question => {
        const matchLevel = selectedLevels.includes(question.level);
        const matchBookmark = !onlyBookmarked || bookmarks.includes(question.id);
        const matchSearch = question.question.toLowerCase()
            .includes(searchText.toLowerCase());
        return matchLevel && matchBookmark && matchSearch
    });
    return(
        <div><h1>Ngân hàng câu hỏi</h1>
        <div>
            {Object.entries(LEVELS).map(([level, name]) => (
                <label key={level}>
                    <input type="checkbox"
                        checked={selectedLevels.includes(Number(level))}
                        onChange={() => handleLevelChange(Number(level))}/>
                        {name}
                </label>
            ))}
        </div>
        <div>
            <label>
                <input type="checkbox"
                    checked={onlyBookmarked}
                    onChange={(event) => setOnlyBookmarked(event.target.checked)}/>
                    Chỉ hiện câu đã đánh dấu
            </label>
        </div>
        <div>
            <input type="text"
                placeholder="Tìm kiếm"
                value={searchText}
                onChange={handleBookmarkShift}/>
        </div>
        <p>Có {filteredQuestions.length} câu hỏi</p>
        <p>Đã đánh dấu: {bookmarks.length} câu</p>
        <table border="1">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Chủ đề</th>
                    <th>Mức độ</th>
                    <th>Hệ số</th>
                    <th>Câu hỏi</th>
                    <th>Đánh dấu</th>
                </tr>
            </thead>
            <tbody>
                {filteredQuestions.map((question, index) => (
                    <tr key={question.id}>
                        <td>{index + 1}</td>
                        <td>{question.topic}</td>
                        <td>{LEVELS[question.level]}</td>
                        <td>{formatMultiplier(MULTIPLIERS[question.level])}</td>
                        <td><Link to={`/questions/${question.id}`}>{question.question}</Link></td>
                        <td>
                            <button type="button" onClick={() => toggleBookmark(question.id)}>
                                    {bookmarks.includes(question.id) ? '★' : '☆'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}
export default QuestionBank