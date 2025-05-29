import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.group('API Request')
    console.log('Method:', config.method.toUpperCase())
    console.log('URL:', config.url)
    console.log('Headers:', config.headers)
    if (config.data) {
      console.log('Request Data:', config.data)
    }
    console.groupEnd()
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.group('API Response')
    console.log('URL:', response.config.url)
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    console.groupEnd()
    return response
  },
  error => {
    console.group('API Error')
    console.log('URL:', error.config?.url)
    console.log('Status:', error.response?.status)
    console.log('Error:', error.message)
    console.log('Response Data:', error.response?.data)
    console.groupEnd()
    return Promise.reject(error)
  }
)

// Add a request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data)
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Login failed')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const signup = async (data) => {
  try {
    const response = await api.post('/auth/signup', data)
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Signup failed')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/auth/forgot-password', data)
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Request failed')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getQuizzes = async (params = {}) => {
  try {
    const response = await api.get('/quizzes', { params })
    
    // Handle both array response and object response
    let quizzes = []
    if (Array.isArray(response.data)) {
      quizzes = response.data
    } else if (response.data && response.data.data) {
      quizzes = response.data.data
    } else {
      throw new Error('Invalid response format from server')
    }

    return {
      success: true,
      count: quizzes.length,
      data: quizzes.map(quiz => ({
        ...quiz,
        questionsCount: quiz.questions?.length || 0
      }))
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getQuiz = async (id) => {
  try {
    console.log(`Fetching quiz with ID: ${id}`)
    const response = await api.get(`/quizzes/${id}`)
    console.log('Quiz API Response:', JSON.stringify(response.data, null, 2))
    
    if (!response.data || !response.data.success) {
      console.error('Invalid quiz response:', response.data)
      throw new Error(response.data?.message || 'Failed to fetch quiz')
    }
    
    if (!response.data.data) {
      console.error('No quiz data in response:', response.data)
      throw new Error('No quiz data received')
    }
    
    return response.data
  } catch (error) {
    console.error('Error in getQuiz:', error)
    throw new Error(error.response?.data?.message || error.message || 'Failed to load quiz')
  }
}

export const createQuiz = async (data) => {
  try {
    const response = await api.post('/quizzes/create', data)
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Failed to create quiz')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const submitQuiz = async (quizId, answers, timeTaken) => {
  try {
    // Format answers as expected by backend
    const formattedAnswers = Array.isArray(answers)
      ? answers
      : Object.entries(answers).map(([questionId, answer]) => ({ questionId, selectedAnswer: answer }))
    const response = await api.post(`/quizzes/${quizId}/attempt`, {
      responses: formattedAnswers,
      timeTaken: timeTaken || 0 // Include timeTaken in the request body
    })
    
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Failed to submit quiz')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getUserHistory = async () => {
  try {
    const response = await api.get('/users/history')
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Failed to fetch history')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile')
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Failed to fetch profile')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getUserQuizzes = async () => {
  try {
    const response = await api.get('/users/quizzes')
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Failed to fetch user quizzes')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const getUserAnalytics = async () => {
  try {
    const response = await api.get('/users/analytics')
    if (!response.data || !response.data.success) throw new Error(response.data?.message || 'Failed to fetch analytics')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message)
  }
}