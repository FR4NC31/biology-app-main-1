import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { database } from '../../firebaseConfig'
import { ref, push } from 'firebase/database'

const Activity = () => {
  const { id } = useParams()
  const [username, setUsername] = useState('')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

  // Quiz data per lesson id
  const quizList = {
  1: [
    // Multiple Choice
    {
      type: 'multiple',
      question: 'Which of the following is NOT part of the Cell Theory?',
      options: [
        'All living things are made of cells',
        'Cells are the basic unit of life',
        'All cells come from pre-existing cells',
        'Cells can live forever without dividing'
      ],
      correct: 'Cells can live forever without dividing'
    },
    // True or False
    {
      type: 'truefalse',
      question: 'True or False: The mitochondria is responsible for protein synthesis.',
      correct: 'False'
    },
    // Identification
    {
      type: 'identification',
      question: 'Identify the cell part responsible for energy production.',
      correct: 'Mitochondria'
    },
    // Multiple Choice
    {
      type: 'multiple',
      question: 'Which structure controls what enters and leaves the cell?',
      options: ['Nucleus', 'Cytoplasm', 'Cell membrane', 'Vacuole'],
      correct: 'Cell membrane'
    },
    // True or False
    {
      type: 'truefalse',
      question: 'True or False: Prokaryotic cells have no nucleus.',
      correct: 'True'
    },
    // Identification
    {
      type: 'identification',
      question: 'What type of cell has a cell wall made of chitin?',
      correct: 'Fungal cell'
    },
    // Multiple Choice
    {
      type: 'multiple',
      question: 'Which cell structure is found only in plant cells?',
      options: ['Ribosome', 'Nucleus', 'Chloroplast', 'Mitochondria'],
      correct: 'Chloroplast'
    },
    // True or False
    {
      type: 'truefalse',
      question: 'True or False: All eukaryotic cells lack membrane-bound organelles.',
      correct: 'False'
    },
    // Identification
    {
      type: 'identification',
      question: 'Name the small finger-like projections that increase surface area for absorption.',
      correct: 'Microvilli'
    },
    // Multiple Choice
    {
      type: 'multiple',
      question: 'Which cell structure is responsible for photosynthesis?',
      options: ['Mitochondria', 'Nucleus', 'Golgi body', 'Chloroplast'],
      correct: 'Chloroplast'
    }
  ]
}

  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      setUsername(savedUsername)
    } else {
      alert('No username found. Please log in.')
    }
  }, [])

  // If quizList is undefined (invalid id), render an error message
  if (!quizList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Invalid lesson ID or quiz not found.</p>
      </div>
    )
  }

  const handleAnswerSelect = (option) => {
    if (answerSubmitted) return // Prevent changing answer after submission
    setSelected(option)
  }

  const handleSubmit = async () => {
    if (selected === null) return // no option selected

    if (!answerSubmitted) {
      // Submit the answer and update score if correct
      if (selected === quizList[current].correct) {
        setScore((prev) => prev + 2)
      }
      setAnswerSubmitted(true)
    } else {
      // Move to next question or finish
      if (current + 1 < quizList.length) {
        setCurrent(current + 1)
        setSelected(null)
        setAnswerSubmitted(false)
      } else {
        setFinished(true)
        if (username) {
          try {
            await push(ref(database, 'leaderboard'), {
              username,
              points: score,
              lessonId: id,
              timestamp: new Date().toISOString(),
            })
            console.log('Score saved to leaderboard.')
          } catch (error) {
            console.error('Error saving score:', error)
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-3xl text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-blue-700">
          Quiz Activity - Lesson {id}
        </h2>
        <p className="mb-6 text-black text-sm sm:text-base">
          👤 Logged in as: <span className="font-bold">{username}</span>
        </p>

        {!finished ? (
          <>
            <p className="text-lg text-black sm:text-xl font-semibold mb-6">
              {quizList[current].question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {quizList[current].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answerSubmitted}
                  className={`py-3 px-6 rounded-xl font-semibold border text-black hover:bg-blue-100 transition duration-200 ${
                    selected === option ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition duration-200 text-sm sm:text-base"
            >
              {!answerSubmitted ? 'Submit Answer' : current === quizList.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </>
        ) : (
          <div className="mt-10 text-center space-y-4">
            <p className="text-xl sm:text-2xl font-bold text-green-700">🎉 Quiz Completed!</p>
            <p className="text-lg sm:text-xl">
              Your Score: <span className="font-bold  text-black">{score} / {quizList.length * 2}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">🏅 Player:</span>{' '}
              <span className="text-blue-700 font-bold">{username}</span>
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => window.location.href = '/leaderboard/'}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition duration-200 text-sm sm:text-base"
              >
                View Leaderboard
              </button>

              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition duration-200 text-sm sm:text-base"
              >
                {showAnswers ? 'Hide Answers' : 'Show Correct Answers'}
              </button>
            </div>

            {showAnswers && (
              <div className="mt-6 text-left bg-gray-50 border border-gray-200 p-4 rounded-xl max-w-xl mx-auto">
                <h3 className="text-lg font-bold mb-2 text-gray-800">✔️ Correct Answers:</h3>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                  {quizList.map((q, i) => (
                    <li key={i}>
                      <strong>Q{i + 1}:</strong> {q.question}<br />
                      <span className="ml-4 text-green-700">Correct Answer: {q.correct}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Activity
