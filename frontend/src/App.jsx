import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import ChatProvider from "./Context/ChatProvider";
import "./App.css"; // Import the CSS file

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/userChats" element={<ChatPage />} />
            {/* Add a route for the Login page if needed */}
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
