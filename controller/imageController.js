const cloudinary = require('cloudinary')
const fs = require('fs')
const { StatusCodes } = require('http-status-codes')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
// to remove temp 
const removeTemp = (path) => {
    fs.unlinkSync(path)
}

const imageController = {
    uploadProfileImage: async (req,res) => {
        try{
            if(!req.files || Object.keys(req.files).length === 0)
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "NO file were attached"})

            const file = req.files.profileImg 
            // res.json({ file })


            // validate file size
            if(file.size > 3 * 1024 * 1024){
                removeTemp(file.tempFilePath)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: `file size must be less then 3MB.. `})
            }

            //validete  image type
            if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg'){
                removeTemp(file.tempFilePath)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Only allow jpg & png format of images"})
            }

            // upload logic
            await cloudinary.v2.uploader.upload(file.tempFilePath, {folder: 'profile_image'}, (err,result) => {
                if(err) res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message})
                removeTemp(file.tempFilePath)
                return res.status(StatusCodes.OK).json({ 
                    public_id: result.public_id,
                    url:result.secure_url
                })

            })

        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    },
    deleteProfileImage: async (req,res) => {
        try{
            const {public_id} = req.body
            if(!public_id)
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "No publice id found"})

            await cloudinary.v2.uploader.destroy(public_id, (err,result) => {
                if(err)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message})
                res.status(StatusCodes.OK).json({ msg: "Image Successfully deleted.."})
            })
        }catch(err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
        }
    }
}

module.exports = imageController