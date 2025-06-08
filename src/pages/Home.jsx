import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../firebaseConfig';
import { ref, set, get, child } from 'firebase/database';

const Home = () => {
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userList, setUserList] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setLoggedInUser(savedUsername);
    } else {
      openUserListModal();
    }
  }, []);

  useEffect(() => {
    if (showModal && inputRef.current) inputRef.current.focus();
  }, [showModal]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openUserListModal = async () => {
    try {
      const snapshot = await get(child(ref(database), 'users'));
      if (snapshot.exists()) {
        setUserList(Object.keys(snapshot.val()));
      } else {
        setUserList([]);
      }
      setShowUserListModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeUserListModal = () => setShowUserListModal(false);

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
      setShowModal(false);
      setShowUserListModal(false); // close user list if open
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (user) => {
    localStorage.setItem('username', user);
    setLoggedInUser(user);
    closeUserListModal();
  };

  const handleLogout = () => {
    if (confirm('Switch user?')) {
      localStorage.removeItem('username');
      setLoggedInUser('');
      setUsername('');
      openUserListModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center justify-center p-4 relative">
      {/* Top Right Button */}
      <button
        onClick={loggedInUser ? handleLogout : openUserListModal}
        className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        {loggedInUser ? 'Switch User' : 'Login'}
      </button>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 animate-scaleIn">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">Create New User</h2>
            <input
              ref={inputRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g., BioMaster123"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-green-500"
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

      {/* User List Modal */}
      {showUserListModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 max-h-[70vh] overflow-y-auto animate-scaleIn">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">Select User</h2>
            <ul className="space-y-2">
              {userList.map((user) => (
                <li key={user}>
                  <button
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-green-100 rounded transition"
                  >
                    👤 {user}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  closeUserListModal();
                  openModal();
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 pr-6 rounded-lg transition"
              >
                ➕ Create New User
              </button>

              <button
                onClick={closeUserListModal}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
              >
                ❌ Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full text-center animate-fadeIn">
        <h1 className="text-4xl font-bold text-green-700 mb-4">🌱 BIO-QUEST ACADEMY</h1>

        {loggedInUser && (
          <p className="text-xl text-gray-700 mb-4">
            Welcome back, <span className="font-bold text-green-800">{loggedInUser}</span>! 🎉
          </p>
        )}

        <p className="text-gray-700 mb-6">Choose a lesson to start learning and earning points!</p>

        <div className="space-y-4">
          <Link
            to="/lesson"
            className="block bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg font-medium transition duration-200"
          >
            🧫 Lesson 1: The Cell — Structure and Function
          </Link>

          <Link
            to="/leaderboard"
            className="block bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-3 rounded-lg font-medium transition duration-200"
          >
            🔬 View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
