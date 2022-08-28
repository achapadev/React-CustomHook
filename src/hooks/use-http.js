import { useState } from 'react'

// to make hook able to send any kind of request to any kind of URl and do any kind of data transformation
// need some parameters: the request logic, theURL, the method, the body, the headers (an object)
const useHttp = (requestConfig, applyData) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  // get rid of task state because it is specific to app component ... we want this hook to be useable with any kind of data
  //   const [tasks, setTasks] = useState([])

  const sendRequest = async (taskText) => {
    // in this component and NewTasks we are managing a loading and error state and setting them similarly
    // because we have some code duplication and it contains other react hooks/state a reg function won't do trick we will use custom hook to outsource http logic

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(requestConfig.url, {
        // use ternary operator here to make this fetch dynamic for get/post requests
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      })

      if (!response.ok) {
        throw new Error('Request failed!')
      }

      const data = await response.json()
      // in the hook we are handing data off to function and function itself provided by component that uses custom hook
      applyData(data)

      //       const loadedTasks = []

      //       for (const taskKey in data) {
      //         loadedTasks.push({ id: taskKey, text: data[taskKey].text })
      //       }

      //       setTasks(loadedTasks)
    } catch (err) {
      setError(err.message || 'Something went wrong!')
    }
    setIsLoading(false)
  }
  //   return something to component where the custom hook is used
  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
  }
}

export default useHttp
