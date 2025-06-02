import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy } from 'lucide-react';
import { database } from '../../firebaseConfig';
import { ref, set, get } from 'firebase/database';

const Home = () => {
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setLoggedInUser(savedUsername);
    } else {
      openModal();
    }
  }, []);

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10); // delay for transition
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 300); // match transition duration
  };

  const handleSubmit = async () => {
    if (!username.trim()) return;
    try {
      const userRef = ref(database, 'users/' + username);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        await set(userRef, { username, points: 0 });
      }
      localStorage.setItem('username', username);
      setLoggedInUser(username);
      closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setLoggedInUser('');
    setUsername('');
    openModal();
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={loggedInUser ? handleLogout : openModal}
        className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        {loggedInUser ? 'Logout' : 'Login'}
      </button>

      {/* Modal with transition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`bg-white text-black rounded-lg p-6 shadow-xl w-80 transform transition-all duration-300 ease-in-out
              ${animateModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          >
            <h2 className="text-lg font-bold mb-4 text-center text-green-700">Enter Your Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., BioMaster123"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Submit
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">🌱 Gamified Biology</h1>
        {loggedInUser && (
          <p className="text-xl text-gray-700 text-center mb-6">
            Hello, <span className="font-bold text-green-800">{loggedInUser}</span>!
          </p>
        )}
        <p className="text-gray-700 mb-6 text-center">
          Choose a lesson to start learning and earning points!
        </p>
        <ul className="space-y-4">
          <li><Link to="/lesson/1" className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg font-medium transition duration-200"><BookOpen className="w-5 h-5" />Lesson 1: Cells</Link></li>
          <li><Link to="/lesson/2" className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg font-medium transition duration-200"><BookOpen className="w-5 h-5" />Lesson 2: Genetics</Link></li>
          <li><Link to="/lesson/3" className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg font-medium transition duration-200"><BookOpen className="w-5 h-5" />Lesson 3: Heredity</Link></li>
          <li><Link to="/leaderboard" className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-3 rounded-lg font-medium transition duration-200"><Trophy className="w-5 h-5" />View Leaderboard</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
