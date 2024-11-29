const mongoose = require('mongoose')
const Document = require('./models/Document')
const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')

const defVal = ""
const port = 5000
connectToMongo()
const app = express()
app.use(cors())
app.use(express.json())

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})


io.on("connection", socket => {
  socket.on("get-document", async (documentId,user, title) => {
    // console.log(user)
    const doc = await find_create_docs(documentId,user,title)

    socket.join(documentId)
    socket.emit("load-document", doc.data,doc.headline)

    socket.on("send-changes", (delta,user, title) => {
      // console.log((delta.ops[0].retain))
      // var pos = delta.ops[0].retain
      socket.broadcast.to(documentId).emit("receive-changes", delta,title)
    })

    socket.on("save-document", async (data,user, title)=>{
        // console.log(user)
        await Document.findByIdAndUpdate(documentId, {"$set": {data}})
    })
  })
})

const find_create_docs = async (id,user, title)=>{
    if(id === null) return;
    const document = await Document.findById(id);
    if(document) return document;
    return await Document.create({user:user._id ,headline: title,_id: id, data: defVal})
}

app.use('/api/auth',require('./routes/authenticate'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port,()=>{
  console.log('Listening at port',port)
});


// ------------------------------------------------------------------------------------------------------

// const mongoose = require("mongoose")
// const Document = require("./models/Document")

// mongoose.connect("mongodb+srv://yashass:ZaneZ8bc1OLZbTME@cluster0.ekync0n.mongodb.net/")

// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// })

// const defaultValue = ""

// io.on("connection", socket => {
//   socket.on("get-document", async documentId => {
//     const document = await findOrCreateDocument(documentId)
//     socket.join(documentId)
//     socket.emit("load-document", document.data)

//     socket.on("send-changes", delta => {
//       socket.broadcast.to(documentId).emit("receive-changes", delta)
//     })

//     socket.on("save-document", async data => {
//       await Document.findByIdAndUpdate(documentId, { data })
//     })
//   })
// })

// async function findOrCreateDocument(id) {
//   if (id == null) return

//   const document = await Document.findById(id)
//   if (document) return document
//   return await Document.create({user:"Me", _id: id, data: defaultValue })
// }