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
  const [setFinished] = useState(false)
  const [phase, setPhase] = useState('greeting')
  const [timer, setTimer] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [userAnswers, setUserAnswers] = useState([])

  const quizList = {
    1: [
      { type: 'multiple', question: 'What is the basic unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Organ'], correct: 'Cell' },
      { type: 'multiple', question: 'Which organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correct: 'Mitochondria' },
      { type: 'multiple', question: 'Which structure controls cell activities?', options: ['Cell wall', 'Ribosome', 'Nucleus', 'Cytoplasm'], correct: 'Nucleus' },
      { type: 'multiple', question: 'Which is found only in plant cells?', options: ['Chloroplast', 'Ribosome', 'Lysosome', 'Mitochondria'], correct: 'Chloroplast' },
      { type: 'multiple', question: 'What surrounds and protects the cell?', options: ['Cell wall', 'Cytoplasm', 'Membrane', 'Nucleus'], correct: 'Membrane' },
      { type: 'truefalse', question: 'True or False: Animal cells have a cell wall.', correct: 'False' },
      { type: 'truefalse', question: 'True or False: Ribosomes produce proteins.', correct: 'True' },
      { type: 'truefalse', question: 'True or False: DNA is found in the cytoplasm.', correct: 'False' },
      { type: 'truefalse', question: 'True or False: Chloroplasts help with photosynthesis.', correct: 'True' },
      { type: 'truefalse', question: 'True or False: The cell membrane is selectively permeable.', correct: 'True' },
      { type: 'identification', question: 'Name the cell structure that contains genetic material.', correct: 'Nucleus' },
      { type: 'identification', question: 'What is the jelly-like substance inside the cell?', correct: 'Cytoplasm' },
      { type: 'identification', question: 'Which part acts as the cell’s boundary with its environment?', correct: 'Cell membrane' },
      { type: 'identification', question: 'Which organelle makes proteins?', correct: 'Ribosome' },
      { type: 'identification', question: 'Which part stores water in plant cells?', correct: 'Vacuole' }
    ]
  }

  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) setUsername(savedUsername)
    else alert('No username found. Please log in.')
  }, [])

  useEffect(() => {
    const phaseDurations = {
      greeting: 5,
      intro: 5,
      countdown: 3,
      question: 10,
      answer: 3,
      correct: 3
    }
    setTimer(phaseDurations[phase] || 0)
  }, [phase])

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    if (timer === 0) nextPhase()
  }, [timer])

  const nextPhase = () => {
    const currentQuestion = quizList[id][current]
    const userAnswer = selected?.toString().trim().toLowerCase()
    const correctAnswer = currentQuestion?.correct?.toString().trim().toLowerCase()

    switch (phase) {
      case 'greeting': return setPhase('intro')
      case 'intro': return setPhase('countdown')
      case 'countdown': return setPhase('question')
      case 'question': return setPhase('answer')
      case 'answer':
        setIsCorrect(userAnswer === correctAnswer)
        if (userAnswer === correctAnswer) setScore(prev => prev + 2)
        setUserAnswers(prev => [...prev, {
          question: currentQuestion.question,
          answer: selected,
          correct: currentQuestion.correct
        }])
        return setPhase('correct')
      case 'correct':
        if (current + 1 < quizList[id].length) {
          setCurrent(prev => prev + 1)
          setSelected(null)
          setIsCorrect(null)
          return setPhase('countdown')
        } else {
          submitScore()
          setFinished(true)
          return setPhase('finished')
        }
      default: break
    }
  }

  const submitScore = async () => {
    try {
      await push(ref(database, 'leaderboard'), {
        username,
        points: score,
        lessonId: id,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error(err)
    }
  }

  const currentQuestion = quizList[id][current]

  const renderProgressBar = (duration) => (
    <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden mb-4">
      <div
        className={`h-full rounded-full transition-[width] duration-[0ms] ${phase === 'question' ? 'bg-blue-500' : 'bg-yellow-400'}`}
        style={{
          width: `${((duration - timer) / duration) * 100}%`,
          transitionDuration: `${(timer === duration) ? '0ms' : '1000ms'}`
        }}
      />
    </div>
  )

  const renderPhase = () => {
    switch (phase) {
      case 'greeting': return <p className="text-3xl text-blue-600 animate-bounce">👋 Welcome {username}!</p>
      case 'intro': return <p className="text-xl text-gray-800 animate-fade-in">Get ready! Multiple question types await. Good luck!</p>
      case 'countdown': return <p className="text-2xl text-purple-600 font-bold animate-pulse">Starting in... {timer}s</p>
      case 'question':
        return (
          <div className="w-full animate-fade-in">
            {renderProgressBar(10)}
            <div className="text-left mb-4">
              <p className="text-sm text-gray-500">Question {current + 1} of {quizList[id].length}</p>
              <p className="text-lg font-bold text-black">{currentQuestion.question}</p>
            </div>
            {currentQuestion.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(option)}
                    className={`py-2 px-4 border rounded-xl transition-colors duration-300 ease-in-out ${selected === option ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-100'}`}
                  >{option}</button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={selected || ''}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Type your answer here"
              />
            )}
            <p className="mt-4 text-sm text-gray-500">You have {timer}s to answer</p>
            <button
              onClick={nextPhase}
              disabled={!selected}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold disabled:bg-gray-400"
            >Submit Answer</button>
          </div>
        )
      case 'answer':
        return (
          <div className="w-full">
            {renderProgressBar(3)}
            <p className="text-yellow-600 font-bold animate-pulse">⏳ Checking answer...</p>
          </div>
        )
      case 'correct':
        return (
          <div className="text-xl font-bold animate-fade-in space-y-4">
            {isCorrect
              ? <p className="text-green-600">✅ Correct!</p>
              : <p className="text-red-600">❌ Incorrect. Correct answer: {currentQuestion.correct}</p>}
            {currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, i) => {
                  const lowerOption = option.toLowerCase()
                  const lowerCorrect = currentQuestion.correct.toLowerCase()
                  const lowerSelected = selected?.toLowerCase()
                  let bg = 'bg-white'
                  if (lowerOption === lowerCorrect) bg = 'bg-green-300'
                  else if (lowerOption === lowerSelected) bg = 'bg-red-300'
                  return (
                    <div
                      key={i}
                      className={`py-2 px-4 border rounded-xl transition-colors duration-300 ease-in-out ${bg}`}
                    >{option}</div>
                  )
                })}
              </div>
            )}
          </div>
        )
      case 'finished':
        return (
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-green-700">🎉 Quiz Completed!</p>
            <p className="text-lg">Score: <span className="font-bold text-black">{score} / {quizList[id].length * 2}</span></p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => (window.location.href = '/leaderboard/' + id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold">View Leaderboard</button>
              <button onClick={() => setShowAnswers(!showAnswers)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold">{showAnswers ? 'Hide' : 'Show'} Your Answers</button>
              <button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold">🔄 Try Again</button>
            </div>
            {showAnswers && (
              <div className="text-left mt-4 text-sm bg-gray-50 border border-gray-200 rounded-lg p-4">
                {userAnswers.map((a, i) => (
                  <div key={i} className="mb-2">
                    <strong>Q{i + 1}:</strong> {a.question}<br />
                    <span className="ml-4">Your Answer: <span className="text-blue-700">{a.answer}</span></span><br />
                    <span className="ml-4">Correct: <span className="text-green-700">{a.correct}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold mb-2 text-blue-700">Lesson {id} - Quiz</h2>
        <p className="mb-2 text-gray-700">👤 {username}</p>
        <p className="mb-6 text-gray-700">🏆 Score: {score} / {quizList[id].length * 2}</p>
        <div className="min-h-[200px] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out">
          {renderPhase()}
        </div>
      </div>
    </div>
  )
}

export default Activity
