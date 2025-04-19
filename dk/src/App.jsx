import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const ll = "http://localhost:4000/uploads/bebe.jpg"

  return (
    <>
       <img
      src={`http://localhost:4000/uploads/bebe.jpg`}
      alt="Profile"
      className="ml-[13px] rounded-[50%] w-[50px] h-[50px] object-cover"
    />
    </>
  )
}

export default App
