import { useEffect, useState } from 'react';
import { Trophy, User, ArrowLeft } from 'lucide-react';
import { database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  const { lessonId } = useParams();
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem('username');

  useEffect(() => {
    const leaderboardRef = ref(database, 'leaderboard');

    const unsubscribe = onValue(
      leaderboardRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const filteredUsers = Object.values(data)
          .map(user => ({
            name: user.username || 'Unknown',
            score: Number(user.points) || 0,
            lessonId: String(user.lessonId),
          }))
          .filter(user => user.lessonId === String(lessonId) && user.score > 0)
          .sort((a, b) => b.score - a.score);

        setUsers(filteredUsers);

        const rankIndex = filteredUsers.findIndex(
          u => u.name.toLowerCase() === currentUsername?.toLowerCase()
        );
        setUserRank(rankIndex !== -1 ? rankIndex + 1 : null);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to read from Firebase:', error);
        setUsers([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [lessonId, currentUsername]);

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-gray-600 text-xl">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-green-600 hover:text-green-800 transition"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
          <Trophy className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Lesson {lessonId} Leaderboard</h2>
        </div>

        <div className="rounded-xl border p-6 bg-white shadow-md">
          {users.length > 0 ? (
            <ul className="space-y-3">
              {users.map((user, index) => {
                const isCurrentUser = user.name.toLowerCase() === currentUsername?.toLowerCase();
                return (
                  <li
                    key={user.name + index}
                    className={`flex justify-between items-center px-5 py-3 rounded-lg transition shadow-sm ${
                      isCurrentUser
                        ? 'bg-blue-100 border border-blue-300 font-semibold'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    title={isCurrentUser ? "That's you! 💪" : `Rank #${index + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getMedal(index + 1)}</span>
                      <span className="text-gray-800">
                        {index + 1}. {user.name}
                      </span>
                    </div>
                    <span
                      className="text-green-600 font-semibold"
                      title="Great job!"
                    >
                      {user.score} pts
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center mt-6">
              No scores submitted yet. Be the first to shine! ✨
            </p>
          )}
        </div>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <User className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-1">Your Progress</h3>
            <p className="text-sm text-blue-600">
              Keep learning and improve your rank by scoring high on quizzes! 🚀
            </p>
          </div>
        </div>

        {userRank && (
          <div className="mt-6 text-center">
            <p className="text-base text-gray-700 font-medium">
              🔢 You are ranked{' '}
              <span className="font-bold text-blue-700">#{userRank}</span> out of{' '}
              {users.length} players.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
