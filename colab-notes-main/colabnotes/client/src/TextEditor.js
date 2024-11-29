// /*
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom'
import noteContext from './context/notes/noteContext'
const QuillCursors = require('quill-cursors')

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  //useState manages state
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const { id: documentId } = useParams()
  const getContext = useContext(noteContext);
  const { user, fetchUser,  getNote} = getContext;
  const [title, setTitle] = useState("");
  let navigate = useNavigate();
  // const [user, setUser] = useState({});
  /* allows to perform side effects in your components. like fetching data useEffect runs on every render.*/
  const getCurUser = async () => {
    await fetchUser();
  }

  const onChange = (e)=>{
    // setTitle(e.target.value)
  }
  useEffect(() => {
    if(localStorage.getItem('token') === null){
      navigate('/login')
    }
    getCurUser();
    // console.log(user._id)
    const s = io("http://localhost:3001")
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  // for saving on db
  useEffect(() => {
    if (socket == null || quill == null) return
    getCurUser();
    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents(), user,title)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  //this use effect will run every time socket, or quill or documentId changes
  useEffect(() => {
    if (socket == null || quill == null) return
    getCurUser();
    socket.once("load-document", (document,headline) => {
      quill.setContents(document)
      quill.enable()
      setTitle(headline)
    })

    socket.emit("get-document", documentId, user, title)
  }, [socket, quill, documentId])



  useEffect(() => {
    if (socket == null || quill == null) return
    getCurUser();
    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])


  useEffect(() => {
    if (socket == null || quill == null) return
    getCurUser();
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta, user)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])


  const wrapperRef = useCallback(wrapper => {
    if(localStorage.getItem('token') === null){
      navigate('/login')
    }else{
      if (wrapper == null) return
    getCurUser();
    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { 
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS }, 
    })
    setQuill(q)
    // var etitle = window.prompt("Enter Page Title")
    // setTitle(etitle)
    
    }
    
  }, [])


  return (
    <>
      
      <div className='container mt-2'>
        <div className="input-group mb-3">
          
          <h4 className=''>{title}</h4>
          
        </div>
      </div>
      <div className="container" ref={wrapperRef}></div>
    </>

  )
}



// */


