import { useEffect, useState } from 'react';
import { Trophy, User, ArrowLeft } from 'lucide-react';
import { database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const leaderboardRef = ref(database, 'leaderboard');
    const unsubscribe = onValue(
      leaderboardRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log('Leaderboard raw data:', data);

        if (!data) {
          setUsers([]);
          setLoading(false);
          return;
        }

        let results = [];

        // Handle both object or array data shape
        if (typeof data === 'object' && !Array.isArray(data)) {
          results = Object.values(data);
        } else if (Array.isArray(data)) {
          results = data;
        }

        // Normalize fields & filter
        results = results
          .map(user => ({
            name: user.name || user.username || 'Unknown',
            score: user.score || user.points || 0,
          }))
          .filter(user => user.score > 0);

        // Sort descending by score
        results.sort((a, b) => b.score - a.score);

        setUsers(results);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase read failed:', error);
        setUsers([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-gray-600 text-center text-xl">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-green-600 hover:text-green-800 transition"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6 text-yellow-500 justify-center">
          <Trophy className="w-6 h-6" />
          <h2 className="text-3xl font-bold">Leaderboard</h2>
        </div>

        {users.length > 0 ? (
          <ul className="space-y-3">
            {users.map((user, index) => (
              <li
                key={user.name + index}
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-5 py-3 rounded-lg shadow-sm transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getMedal(index + 1)}</span>
                  <span className="text-gray-800 font-medium">
                    {index + 1}. {user.name}
                  </span>
                </div>
                <span className="text-green-600 font-semibold">{user.score} pts</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center mt-6">
            No scores submitted yet. Be the first to shine! ✨
          </p>
        )}

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <User className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-1">Your Progress</h3>
            <p className="text-sm text-blue-600">
              Keep going! The more lessons you complete, the higher your score. 🧠📈
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
