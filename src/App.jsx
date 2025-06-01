import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Activity from './pages/Activity'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/activity/:id" element={<Activity />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default App