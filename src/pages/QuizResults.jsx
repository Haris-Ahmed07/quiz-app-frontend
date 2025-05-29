import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getQuizResults } from '../utils/api';

function QuizResults() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results || null);
  const [loading, setLoading] = useState(!location.state?.results);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!results && attemptId) {
        try {
          console.log('Fetching results for attempt ID:', attemptId);
          setLoading(true);
          setError(null);
          const response = await getQuizResults(attemptId);
          console.log('API Response:', response);
          
          if (response && response.success) {
            setResults(response.data);
          } else {
            const errorMsg = response?.message || 'Failed to load results';
            console.error('API Error:', errorMsg);
            setError(errorMsg);
          }
        } catch (err) {
          console.error('Error in fetchResults:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            stack: err.stack
          });
          setError(err.response?.data?.message || 'Failed to load quiz results. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [attemptId, results]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Results</h2>
            <p className="mb-4 text-gray-700">
              {error.message || error || 'We couldn\'t load your quiz results.'}
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
                <p className="font-medium">Debug Information:</p>
                <p>Attempt ID: {attemptId}</p>
                <p>Error: {error.message || JSON.stringify(error)}</p>
                <p>API Endpoint: /quizzes/attempt/{attemptId}/results</p>
              </div>
            )}
            
            <div className="mt-6 space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { score, totalMarks, timeTaken, correctAnswers, totalQuestions, questions } = results;
  const percentage = Math.round((score / totalMarks) * 100);
  const timeInMinutes = (timeTaken / 60).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Quiz Results
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Here's how you performed
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Performance Summary
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {score} out of {totalMarks} points ({percentage}%)
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Correct Answers</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {correctAnswers} out of {totalQuestions} questions
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Time Taken</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {timeInMinutes} minutes
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Detailed Results
            </h3>
          </div>
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {questions?.map((question, index) => (
              <div key={question._id} className="px-4 py-5 sm:p-6">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {question.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {index + 1}. {question.questionText}
                    </p>
                    <p className={`mt-1 text-sm ${
                      question.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Your answer: {question.userAnswer}
                      {!question.isCorrect && (
                        <span className="block text-green-600">
                          Correct answer: {question.correctAnswer}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Marks: {question.marksAwarded} / {question.marks}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
