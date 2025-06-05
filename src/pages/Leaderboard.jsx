import { useEffect, useState } from 'react';
import { Trophy, User, ArrowLeft } from 'lucide-react';
import { database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const currentUsername = localStorage.getItem('username');

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

      // Map all leaderboard entries into an array with lessonId, username, points
      const allUsers = Object.values(data).map(user => ({
        lessonId: String(user.lessonId),
        name: user.username || 'Unknown',
        score: Number(user.points) || 0,
      })).filter(user => user.score > 0);

      setUsers(allUsers);

      // Find rank of current user in the current lesson leaderboard
      const currentLessonUsers = allUsers
        .filter(user => user.lessonId === String(lessonId))
        .sort((a, b) => b.score - a.score);

      const foundIndex = currentLessonUsers.findIndex(
        user => user.name.toLowerCase() === currentUsername?.toLowerCase()
      );

      if (foundIndex !== -1) {
        setUserRank(foundIndex + 1);
      } else {
        setUserRank(null);
      }

      setLoading(false);
    },
    (error) => {
      console.error('Firebase read failed:', error);
      setUsers([]);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, [currentUsername, lessonId]);

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
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl w-full relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-green-600 hover:text-green-800 transition"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6 text-yellow-500 justify-center">
          <Trophy className="w-6 h-6" />
          <h2 className="text-3xl font-bold">Lesson {lessonId} Leaderboard</h2>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((lessonNum) => {
          // Filter users for this lesson
          const lessonUsers = users
            .filter(user => user.lessonId === String(lessonNum))
            .sort((a, b) => b.score - a.score);

          return (
            <div key={lessonNum} className="bg-white rounded-xl border p-6 shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Lesson {lessonNum} Leaderboard</h3>
              {lessonUsers.length > 0 ? (
                <ul className="space-y-3">
                  {lessonUsers.map((user, index) => (
                    <li
                      key={user.name + index + lessonNum}
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
            </div>
          );
        })}
      </div>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <User className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-1">Your Progress</h3>
            <p className="text-sm text-blue-600">
              Keep going! The more lessons you complete, the higher your score. 🧠📈
            </p>
          </div>
        </div>

        {userRank && (
          <div className="mt-6 text-center">
            <p className="text-base text-gray-700 font-medium">
              🔢 You are ranked <span className="font-bold text-blue-700">#{userRank}</span> out of {users.length} players.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
