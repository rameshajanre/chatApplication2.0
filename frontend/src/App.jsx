import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Router,Routes } from "react-router-dom";
import Homepage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
     <Routes>
      <Route path="/" Component={Homepage} exact />
      <Route path="/chat" Component={ChatPage}/>
    </Routes>
    </div>
   
  )
}

export default App
