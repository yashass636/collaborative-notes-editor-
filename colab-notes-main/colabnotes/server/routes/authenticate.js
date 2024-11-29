const express = require('express')
const router = express.Router()
const User = require('../models/User')
const {body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = "thisiscolabeditorys"


//Route 1
router.post('/createuser',[
    body('email').isEmail(),
    body('name').isLength({min:3})
],async (req,res)=>{
    
    const err = validationResult(req);
    if(!err.isEmpty()){
        const success = false
        return res.status(400).json({success, errors: "errors.array()"});
    }
    try{
        console.log(req.body)
        // const user = User(req.body);
        // user.save()
        let user = await User.findOne({email: req.body.email})
        if(user){
            const success = false
            return res.status(400).json({success,error: "Email used before"})
        }
        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        // .then(user => res.json(user))
        // .catch(err => console.log(err))

        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(jwtData)
        const success = true
        res.json({success, authToken})
        // res.send("hello")
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Some err occured")
    }

})

//Route 2
// Authenticate a user using : POST "/api/auth/login"

router.post('/login',[
    body('email').isEmail(),
    body('password').exists()
],async (req,res)=>{

    const err = validationResult(req);
    if(!err.isEmpty()){
        const success = false
        return res.status(400).json({success, errors: err.array()});
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            const success = false
            return res.status(400).json({success,errors: "Please try to login with correct credentials"});
        }

        const passwordCompare = (password === user.password) 
        
        if(!passwordCompare){
            const success = false
            return res.status(400).json({success,errors: "Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        const success = true
        res.json({success, authToken})


    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some err occured")
    }

})


//Route 3

    router.post('/getuser',fetchuser,async (req,res)=>{
        try {
            
            const userId = req.user.id
            const obUser = await User.findById(userId).select("-password")
            res.send(obUser)
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Some err occured")
        }

    })


module.exports = router