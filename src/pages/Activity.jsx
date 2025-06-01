import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
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
    // Optional: redirect to login page
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

  const getTileColor = (option) => {
    if (!submitted) return 'bg-blue-500 hover:bg-blue-600'
    if (option === quizList[current].correct) return 'bg-green-500'
    if (option === selected) return 'bg-red-500'
    return 'bg-gray-300'
  }

  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700">Quiz Activity - Lesson {id}</h2>
      <p className="mb-4 text-gray-600">👤 Logged in as: <span className="font-bold">{username}</span></p>

      {!finished ? (
        <>
          <p className="text-xl font-semibold mb-6">{quizList[current].question}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {quizList[current].options.map((option, index) => (
              <button
                key={index}
                onClick={() => !submitted && setSelected(option)}
                className={clsx(
                  'text-white p-4 rounded-xl transition duration-200 font-medium shadow-lg',
                  selected === option && !submitted && 'ring-4 ring-yellow-300',
                  getTileColor(option)
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition duration-200"
          >
            {submitted ? (current === quizList.length - 1 ? 'Finish Quiz' : 'Next Question') : 'Submit Answer'}
          </button>
        </>
      ) : (
        <div className="mt-10">
          <p className="text-2xl font-bold text-green-700">🎉 Quiz Completed!</p>
          <p className="text-xl mt-4">Your Score: <span className="font-bold">{score} / {quizList.length * 2}</span></p>
          <p className="mt-2">🏅 Player: <span className="text-yellow-600 font-semibold">{username}</span></p>
        </div>
      )}
    </div>
  )
}

export default Activity
