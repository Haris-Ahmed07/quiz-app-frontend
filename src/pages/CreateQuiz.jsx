import React from 'react'
import QuizForm from '../components/QuizForm'
import { ToastContainer } from 'react-toastify'

function CreateQuiz() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <QuizForm />
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  )
}

export default CreateQuiz
