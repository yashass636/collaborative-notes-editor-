const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Document')
const {body, validationResult} = require('express-validator')

//get all notes of a user
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)    
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some err occured")
    }
    
})

//delete
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    
    try {
        //find the note
        var note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Notes Not found")
        }

        if(req.user.id !== note.user.toString()){
            return res.status(401).send("ur not owner")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"message":"Deleted!!",note})    
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some err occured")
    }

})


//getting perticular note
router.get('/getnote/:id',fetchuser,async (req,res)=>{
    
    try {
        //find the note
        var note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).json({"message":false,msg:"Notes not found"}) 
        }

        res.json({"message":true,note})    
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some err occured")
    }

})

router.post('/addnote/:id',fetchuser,async (req,res)=>{

    try {
        const { title, description} = req.body;
        const err = validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        var nte = await Notes.findById(req.params.id)
        if(nte){
            return res.status(404).json({"message":false,msg:"Notes already found"}) 
        }
        const note = await Notes.create({
            _id: req.params.id,
            headline: title,
            data: description, 
            user: req.user.id
        })
        res.json(note)    
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some err occured")
    }

    
})

module.exports = router