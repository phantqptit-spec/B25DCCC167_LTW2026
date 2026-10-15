import { useState } from 'react'
import './App.css'

const initialStudents = [
  { id: 1, name: 'Trần Thị Thuý', score: 9.5, class: 'D25CQCC01' },
  { id: 2, name: 'Nguyễn Văn Đà', score: 10, class: 'D25CQCC05' },
  { id: 3, name: 'Trương Quốc Phan', score: 8, class: 'D25CQCC05' },
]

const StudentItem = ({ student, index, onDelete }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{student.name}</td>
      <td>{student.class}</td>
      <td>{student.score}</td>
      <td>
        <button
          type="button"
          onClick={() => onDelete(student.id)}>
          Xóa
        </button>
      </td>
    </tr>
  )
}

const StudentList = ({ students, onDelete }) => {
  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ và tên</th>
          <th>Lớp</th>
          <th>Điểm</th>
          <th>Thao tác</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="5">Không có sinh viên phù hợp.</td>
          </tr>
        ) : (
          students.map((student, index) => (
            <StudentItem
              key={student.id}
              student={student}
              index={index}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  )
}

const App = () => {
  const [students, setStudents] = useState(initialStudents)
  const [name, setName] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [score, setScore] = useState('')
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  const handleAdd = (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedClass = studentClass.trim()
    const numberScore = Number(score)

    if (!trimmedName || !trimmedClass || score.trim() === '') {
      setError('Vui lòng nhập đầy đủ họ tên, lớp và điểm.')
      return
    }

    if (!Number.isFinite(numberScore) || numberScore < 0 || numberScore > 10) {
      setError('Điểm phải nằm trong khoảng từ 0 đến 10.')
      return
    }

    const newStudent = {
      id: Date.now(),
      name: trimmedName,
      class: trimmedClass,
      score: numberScore,
    }

    setStudents((previousStudents) => [...previousStudents, newStudent])
    setName('')
    setStudentClass('')
    setScore('')
    setError('')
  }

  const handleDelete = (id) => {
    setStudents((previousStudents) =>
      previousStudents.filter((student) => student.id !== id)
    )
  }

  const filteredStudents = students.filter((student) => {
    if (filter === 'good') {
      return student.score >= 8
    }

    if (filter === 'failed') {
      return student.score < 5
    }

    return true
  })

  const totalStudents = students.length

  const averageScore = totalStudents === 0
    ? 0
    : students.reduce((total, student) => total + student.score, 0) / totalStudents

  return (
    <div className="app">
      <h1>Quản lý điểm sinh viên</h1>
      <p className="description">
        Quản lý thông tin và kết quả học tập của sinh viên.
      </p>

      <h2>Thêm sinh viên</h2>

      <form className="student-form" onSubmit={handleAdd}>
        <div className="form-group">
          <label htmlFor="student-name">Họ và tên</label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="form-group">
          <label htmlFor="student-class">Lớp</label>
          <input
            id="student-class"
            type="text"
            value={studentClass}
            onChange={(event) => setStudentClass(event.target.value)}
            placeholder="Nhập lớp"
          />
        </div>

        <div className="form-group">
          <label htmlFor="student-score">Điểm</label>
          <input
            id="student-score"
            type="number"
            min="0"
            max="10"
            step="any"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder="Nhập điểm"
          />
        </div>

        <button className="add-button" type="submit">
          Thêm sinh viên
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      <h2>Danh sách sinh viên</h2>

      <div>
        <button type="button" onClick={() => setFilter('all')}>
          Tất cả
        </button>{' '}
        <button type="button" onClick={() => setFilter('good')}>
          Sinh viên giỏi
        </button>{' '}
        <button type="button" onClick={() => setFilter('failed')}>
          Trượt môn 
        </button>
      </div>

      <p>
        Tổng số sinh viên: {totalStudents}
      </p>

      <p>
        Điểm trung bình: {averageScore.toFixed(2)}
      </p>

      <StudentList
        students={filteredStudents}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App
