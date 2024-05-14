import React, { useEffect, useState } from 'react'
import axios from "axios";

const ChatPage = () => {
   const[chats,setChats] = useState([])
    const fatchChats = async ()=>{
       const {data} = await axios.get("http://127.0.0.1:5000/chat")
       console.log("data=",data);
       setChats(data.data)
       console.log("chats=",chats)
    }
useEffect(()=>{
    fatchChats()
},[])

  return (
    <div>
        {chats.map((data)=>(<h1>{data?.chatName }</h1>))}
    </div>
  )
}

export default ChatPage