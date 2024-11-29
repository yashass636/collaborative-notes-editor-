import React, { useContext, useEffect } from 'react'
import Plus from './plus.png'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';
import { v4 as uuidV4 } from 'uuid'
import Noteitem from './Noteitem';

const Home = (props) => {
    const getContext = useContext(noteContext)
    // console.log(getContext)
    const { notes, getNotes, user, fetchUser, addNote } = getContext;
    let navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchUser();
            getNotes();

        } else {
            // console.log(localStorage.getItem('token'))
            navigate('/login')
        }
    }, [])
    const handle = async () => {
        let docId = uuidV4();
        let title = window.prompt("Enter Page Title")
        await addNote(docId,title,"");
        navigate(`/documents/${docId}`)
    }

    const updateNote = (note) => {
            console.log("hello from update",note);
            navigate(`/documents/${note}`)
      }
    return (
        <div className='container my-4'>
            <div className='container'>
                <div className='container my-3' style={{ height: 210, width: 120 }}>
                    <button className='btn btn-outline-secondary' data-toggle="tooltip" data-placement="top" title="Create new document" onClick={handle} style={{ borderRadius: 10, borderColor: "grey" }}>
                        <img src={Plus} alt="" style={{ height: 210, width: 120, borderRadius: 10 }} />
                    </button>
                </div>
            </div>
            <div className='container'>
                <div className="row my-3">
                    <h1>Your Notes </h1>
                </div>
                {
                    notes.map((note) => {
                        return <Noteitem key={note._id} note={note} updateNote={updateNote}/>
                        
                    })
                }
            </div>
        </div>
    )
}

export default Home
