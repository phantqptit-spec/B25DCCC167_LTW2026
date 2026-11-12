
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
const App = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    useEffect(() => {
        const controller = new AbortController();
        const getQuestions = async () => {
            try {
              const response = await axios.get('/data/questions.json', {
                signal: controller.signal
              });
              setQuestions(response.data);
            } catch (err) {
              if (axios.isCancel(err)) {
                return;
              }
                setError(true);
            } finally {
              if (!controller.signal.aborted) {
                setLoading(false);
              }
            }
        };
        getQuestions();
        return () => {
            controller.abort();
        };
    }, []);
    const toggleBookmark = (id) => {
        setBookmarks(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }

            return [...prev, id];
        });
    };
    const questionContent = loading ? (
        <p>Đang tải câu hỏi</p>
    ) : error ? (
        <p>Không tải được câu hỏi.</p>
    ) : null;
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />}/>
                <Route
                  path="questions"
                  element={
                    questionContent || (
                      <QuestionBank
                        questions={questions}
                        bookmarks={bookmarks}
                        toggleBookmark={toggleBookmark}/>
                    )
                  }
                />
                <Route
                  path="questions/:id"
                  element={
                    questionContent || (
                      <QuestionDetail
                        questions={questions}
                        bookmarks={bookmarks}
                        toggleBookmark={toggleBookmark}/>
                    )
                  }
                />
                <Route path="history" element={<h2>Lịch sử</h2>}/>
                <Route path="*" element={<NotFound />}/>
            </Route>
        </Routes>
    )
}

export default App
