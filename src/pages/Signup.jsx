import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic client-side validation
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      // 1. First, create the user account
      const signupResponse = await axios.post('http://localhost:5000/api/auth/signup', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      })

      // 2. If signup is successful, log the user in
      if (signupResponse.data?.success) {
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email.trim(),
          password: form.password
        })

        // 3. Store the token and redirect to dashboard
        if (loginResponse.data?.token) {
          localStorage.setItem('token', loginResponse.data.token)
          navigate('/')
        } else {
          // If login after signup fails, redirect to login page
          navigate('/login')
        }
      } else {
        setError(signupResponse.data?.message || 'Error creating account')
      }
    } catch (err) {
      console.error('Signup error:', err)
      // Handle different types of errors
      if (err.response) {
        setError(err.response.data?.message || 'Error creating account. Please try again.')
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.')
      } else {
        setError('Error creating account. Please try again.')
      }
    }
  }


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a password"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Signup