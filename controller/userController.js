const {StatusCodes} = require('http-status-codes')
const User = require('../model/userModel')

const userController ={
    getAll: async (req,res) => {
        try{
            const users = await User.find({}).select('-password')

            const filteredUsers = users.filter((item) => item.role !== 'superadmin')

            res.json({ users: filteredUsers, length: filteredUsers.length})

        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    getCurrentUser: async (req,res) => {
        try{
            const id = req.user.id 

            const users= await User.findById({_id:id})
            res.json({ users })

        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    updateUser: async (req,res) => {
        try{
            const  { name,email,mobile,image} = req.body 

            await User.findByIdAndUpdate({_id:req.user.id}, {name,email,mobile,image})


            res.status(StatusCodes.OK).json({ msg: "User data updated successfully."})

        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    deleteUser: async (req,res) => {
        try{
            const id = req.params.id 

            await User.findByIdAndDelete({_id: id})

            res.json({ msg: " User data deleted successfully "})

        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message})
        }
    },
    changeRole: async (req,res) => {
        try{
            const id = req.params.id 
            const {role} = req.body 

            await User.findByIdAndUpdate({ _id: id }, {role})

            res.json({ msg:"Role updated successfully"})
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    }
}

module.exports = userController