
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')



const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        cb(null, `${timestamp}-${baseName}${fileExtension}`);
    }
})

const multerFilefilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({ message: 'Unsuported file format' }, false);
    }
}


const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilefilter,
    limits: { fileSize: 2 * 1024 * 1024 }
})



async function productImagesResize(req, res, next) {
    if (!req.files) return next()
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/Product/${file.filename}`)
    }))
    next()
}


const BlogImagesResize = async (req, res, next) => {
    if (!req.files) return next()
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/Blog/${file.filename}`)
    }))
    next()
}


const CategoryImagesResize = async (req, res, next) => {
    if (!req.file) return next()
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/Category/${file.filename}`)
    }))
    next()
}

const BrandImagesResize = async (req, res, next) => {
    if (!req.file) return next()
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/Brand/${file.filename}`)
    }))
    next()
}

const BlogCategoryImagesResize = async (req, res, next) => {
    if (!req.file) return next()
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/BlogCategory/${file.filename}`)
    }))
    next()
}




module.exports = { uploadPhoto, productImagesResize, BlogImagesResize, CategoryImagesResize, BrandImagesResize, BlogCategoryImagesResize }