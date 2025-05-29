import { useState, useEffect } from 'react'
import { getUserHistory } from '../utils/api'

function Profile() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getUserHistory()
        setHistory(response.data)
      } catch (error) {
        console.error('Error fetching history:', error)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <h2 className="text-2xl font-semibold mb-4">Quiz History</h2>
      {history.length === 0 ? (
        <p>No quizzes attempted yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((attempt) => (
            <div key={attempt._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{attempt.quizId.title}</h3>
              <p>Score: {attempt.score} / {attempt.totalMarks}</p>
              <p>Date: {new Date(attempt.timestamp).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile