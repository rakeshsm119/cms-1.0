const { StatusCodes } = require('http-status-codes')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const { createAccessToken } = require('../util/token')
const jwt = require('jsonwebtoken')

const authController = {
    register: async (req, res) => {
       
        try {
            const { name, email, mobile, password } = req.body

            const encPassword = await bcrypt.hash(password, 10)

            const newUser = await User.create({
                name,
                email,
                mobile,
                password: encPassword
            })

            res.status(StatusCodes.OK).json({ msg: "User registered Successfully", data: newUser })


        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            //user email exists or not
            const extUser = await User.findOne({ email })
            if (!extUser)
                return res.status(StatusCodes.NOT_FOUND).json({ msg: "User doesn't exists.." })

                // compare password
                const isMatch =await bcrypt.compare(password, extUser.password)
                if(!isMatch)
                return res.status(StatusCodes.NOT_FOUND).json({ msg: "User aren't match."})

                //generater token
                const accessToken = createAccessToken({ _id: extUser._id})

                //save token in cookies 
                res.cookie('refreshToken',accessToken,{
                    httpOnly:true,
                    signed: true,
                    path: `/api/v1/auth/refreshToken`,
                    maxAge: 1 * 24 * 60 * 60 * 1000
                })

            res.json({ msg:"Login Successfully", accessToken })

        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken',{path: `/api/v1/auth/refreshToken`})

            res.json({ msg: " logout successfully" })

        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const rf= req.signedCookies.refreshToken
            if(!rf)
            return res.status(StatusCodes.BAD_REQUEST).json({msg: "Session Expried, Login Again.."})

            //valid user id or not
            jwt.verify(rf, process.env.TOKEN_SECRET, (err,user) => {
                if(err)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg:"Invalide Access Token.. Login Again.."})

            //valid token
            const accessToken = createAccessToken({ id: user._id})
                res.json({ accessToken })
            })

            // res.json({ rf })

        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            res.json({ msg: "resetPassword " })

        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    }
}

module.exports = authController