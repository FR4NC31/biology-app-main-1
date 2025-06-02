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
  const [submitted, setSubmitted] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

  const quizList = {
    1: [
      { question: 'What is the basic unit of life?', options: ['Atom', 'Cell', 'Tissue', 'Organelle'], correct: 'Cell' },
      { question: 'Which type of cell does not have a nucleus?', options: ['Plant cell', 'Animal cell', 'Eukaryotic cell', 'Prokaryotic cell'], correct: 'Prokaryotic cell' },
      { question: 'What is the function of the mitochondria?', options: ['Store genetic material', 'Produce energy', 'Digest food', 'Make proteins'], correct: 'Produce energy' },
      { question: 'Where is DNA found in a eukaryotic cell?', options: ['Cytoplasm', 'Cell membrane', 'Nucleus', 'Ribosomes'], correct: 'Nucleus' },
      { question: 'Which organelle is responsible for photosynthesis?', options: ['Ribosomes', 'Mitochondria', 'Chloroplast', 'Golgi body'], correct: 'Chloroplast' },
    ],
    2: [
      { question: 'Who is known as the Father of Modern Genetics?', options: ['Charles Darwin', 'Louis Pasteur', 'Gregor Mendel', 'Rosalind Franklin'], correct: 'Gregor Mendel' },
      { question: 'What is the genetic material that carries instructions for life?', options: ['RNA', 'Protein', 'Carbohydrates', 'DNA'], correct: 'DNA' },
      { question: 'Which describes a dominant allele?', options: ['Only shows effect when two copies are present', 'Is weaker than a recessive allele', 'Shows effect even if only one copy is present', 'Only appears in males'], correct: 'Shows effect even if only one copy is present' },
      { question: 'What tool is used to predict genetic outcomes?', options: ['Microscope', 'Gene scanner', 'Punnett Square', 'Chromosome map'], correct: 'Punnett Square' },
      { question: 'What combination of sex chromosomes does a male have?', options: ['XX', 'XY', 'YY', 'XO'], correct: 'XY' },
    ],
    3: [
      { question: 'What is heredity?', options: ['Cell division', 'The passing of traits from parents to offspring', 'Mutation of genes', 'Growth of an organism'], correct: 'The passing of traits from parents to offspring' },
      { question: 'Which molecule carries genetic information?', options: ['RNA', 'ATP', 'DNA', 'Protein'], correct: 'DNA' },
      { question: 'Who discovered the basic principles of heredity?', options: ['Isaac Newton', 'Gregor Mendel', 'Albert Einstein', 'Louis Pasteur'], correct: 'Gregor Mendel' },
      { question: 'What term describes a trait influenced by multiple genes?', options: ['Dominant trait', 'Recessive trait', 'Polygenic trait', 'Single-gene trait'], correct: 'Polygenic trait' },
      { question: 'Which of the following is a hereditary disorder?', options: ['Flu', 'Diabetes Type 2', 'Cystic Fibrosis', 'Allergy'], correct: 'Cystic Fibrosis' },
    ],
  }[id]

  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      setUsername(savedUsername)
    } else {
      alert('No username found. Please log in.')
    }
  }, [])

  const handleSubmit = async () => {
    if (selected == null) return

    if (!submitted) {
      setSubmitted(true)
      if (selected === quizList[current].correct) {
        setScore((prev) => prev + 2)
      }
    } else {
      if (current + 1 < quizList.length) {
        setCurrent(current + 1)
        setSelected(null)
        setSubmitted(false)
      } else {
        setFinished(true)

        if (username) {
          try {
            await push(ref(database, 'leaderboard'), {
              username,
              points: score,
              lessonId: id,
              timestamp: new Date().toISOString()
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
                  onClick={() => {
                    if (!submitted) {
                      setSelected(option)
                      setSubmitted(true)
                      if (option === quizList[current].correct) {
                        setScore((prev) => prev + 2)
                      }
                    }
                  }}
                  className={`py-3 px-6 rounded-xl font-semibold border text-white bg- black hover:bg-blue-100 transition duration-200 ${
                    selected === option ? 'bg-blue-500 text-white' : ''
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
              {submitted
                ? current === quizList.length - 1
                  ? 'Finish Quiz'
                  : 'Next Question'
                : 'Submit Answer'}
            </button>
          </>
        ) : (
          <div className="mt-10 text-center space-y-4">
            <p className="text-xl sm:text-2xl font-bold text-green-700">🎉 Quiz Completed!</p>
            <p className="text-lg sm:text-xl">
              Your Score: <span className="font-bold text-black">{score} / {quizList.length * 2}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">🏅 Player:</span>{' '}
              <span className="text-blue-700 font-bold">{username}</span>
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => window.location.href = '/leaderboard'}
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
