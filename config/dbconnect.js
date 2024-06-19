const  mongoose  = require("mongoose")

const connectdb = async (dburl) => {
    const dboptions = {
        dbName: 'E-commerce'
    }

    try {
        await mongoose.connect(dburl, dboptions)
        console.log("connection Succesfull")
        
    } catch (error) {
        console.log("error in connecting database")
    }
}

module.exports = connectdb