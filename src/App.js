import React, { useEffect, useState } from 'react'

import Tasks from './components/Tasks/Tasks'
import NewTask from './components/NewTask/NewTask'
import useHttp from './hooks/use-http'

function App() {
  // these two states are now managed by the custom hook :)
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState(null)
  const [tasks, setTasks] = useState([])

  // assign alias to sendRequest function from custom hook
  const { isLoading, error, sendRequest: fetchTasks } = useHttp()

  // const fetchTasks = async (taskText) => {
  // in this component and NewTasks we are managing a loading and error state and setting them similarly
  // because we have some code duplication and it contains other react hooks/state a reg function
  // won't do trick we will use custom hook to outsource http logic
  // this is best of both worlds we have main logic in custom hook but the data specific logic in the component where we need the data

  //   setIsLoading(true)
  //   setError(null)
  //   try {
  //     const response = await fetch(
  //       'https://react-http-c03a9-default-rtdb.firebaseio.com/tasks.json'
  //     )

  //     if (!response.ok) {
  //       throw new Error('Request failed!')
  //     }

  //     const data = await response.json()

  //     const loadedTasks = []

  //     for (const taskKey in data) {
  //       loadedTasks.push({ id: taskKey, text: data[taskKey].text })
  //     }

  //     setTasks(loadedTasks)
  //   } catch (err) {
  //     setError(err.message || 'Something went wrong!')
  //   }
  //   setIsLoading(false)
  // }

  useEffect(() => {
    const transformTasks = (tasksObj) => {
      const loadedTasks = []

      // transform all tasks from objects which we get back from Firebase into objects that have structure we need for frontend
      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text })
      }

      setTasks(loadedTasks)
    }

    fetchTasks(
      {
        url: 'https://react-http-c03a9-default-rtdb.firebaseio.com/tasks.json',
      },
      transformTasks
    )
  }, [fetchTasks])

  // when you use a custom hook which uses state and you use hook in a component it will implicitly use that state
  // so the state configured in custom hook is attached to this component and when that state changes this component will be rerendered

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
