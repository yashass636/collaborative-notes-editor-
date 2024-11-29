import react, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=>{
    const notesInitial = []
    const usr = {}
    const [notes, setNotes] = useState(notesInitial)
    const [user, setUser] = useState(usr)
    const getNotes = async ()=>{
        //todo : API call
        //API call
        console.log(JSON.parse(localStorage.getItem('authToken')))
        const response = await fetch(`http://localhost:5000/api/notes/fetchallnotes`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json();
        // console.log('new note added',title,description,tag)
        // console.log(json)
        setNotes(json)
    }

    const fetchUser = async ()=>{

        const response = await fetch(`http://localhost:5000/api/auth/getuser`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json();
        // console.log(typeof(json))
        setUser(json)
    }

    //delete a note
    const deleteNote = async (id)=>{
        const response = await fetch(`http://localhost:5000/api/notes/deletenote/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });

        const json = await response.json();
        console.log(json);

        console.log('deleteing note with id : ',id)
        var newNotes = notes.filter((note)=>{
            return note._id !== id
        }) 
        setNotes(newNotes)
    }

    //get note
    const getNote = async (id)=>{
        const response = await fetch(`http://localhost:5000/api/notes/getnote/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            }
        });

        const json = await response.json();
        console.log(json);
        return json.message;
    }
    
    //add note

    const addNote = async (id,title, description)=>{
        //todo : API call
        //API call
        const response = await fetch(`http://localhost:5000/api/notes/addnote/${id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, description})
        });
        const json = await response.json();
        console.log(json)
        const note = json
        setNotes(notes.concat(note))
    }

    // const [state,setState] = useState("hello")
    return (
        <NoteContext.Provider value={{notes, getNotes,user, fetchUser, deleteNote, getNote, addNote}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState;