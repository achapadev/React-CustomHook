import React, { useEffect, useState } from 'react'

import Tasks from './components/Tasks/Tasks'
import NewTask from './components/NewTask/NewTask'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tasks, setTasks] = useState([])

  const fetchTasks = async (taskText) => {
    // in this component and NewTasks we are managing a loading and error state and setting them similarly
    // because we have some code duplication and it contains other react hooks/state a reg function won't do trick we will use custom hook to outsource http logic

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        'https://react-http-c03a9-default-rtdb.firebaseio.com/tasks.json'
      )

      if (!response.ok) {
        throw new Error('Request failed!')
      }

      const data = await response.json()

      const loadedTasks = []

      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text })
      }

      setTasks(loadedTasks)
    } catch (err) {
      setError(err.message || 'Something went wrong!')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task))
  }

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  )
}

export default App
