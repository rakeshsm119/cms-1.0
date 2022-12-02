require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser= require('cookie-parser')
const assert =require('assert')
const fileUpload = require('express-fileupload')
const {StatusCodes} = require('http-status-codes')
const connectDB = require('./db')
const path = require('path')


//port
const PORT =process.env.PORT

//ref
const app= express()

//body parser
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

//middlewares
app.use(cors())
app.use(cookieParser(process.env.TOKEN_SECRET)) // pass token only for signed cookies
app.use(fileUpload({
    useTempFiles: true
}))

//route
const authRoute = require('./route/authRoute')
const userRoute = require('./route/userRoute')
const imageRoute= require('./route/imageRoute')
const mailRoute= require('./route/mailRoute')

//primary route
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/image',imageRoute)
app.use('/api/v1/mail',mailRoute)

//default route
app.all('*', (req,res) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "The Requested route path Not found"})
})

if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'){
    app.use(express.static(`client/build`))
    app.get('*', (req,res) => {
        res.sendFile(path.join(_dirname + `client/build/index.html`))
    })
}

const start = async () => {
    try{
        await connectDB()

        app.listen(PORT, () => {
            console.log(`Server is listening @ http://localhost:${PORT}`)
        })
    }catch(err){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}
start()