const express = require('express')
const {connectDB} = require("./config/database")
const {UserModel} = require("./models/user")

// create express app
const app = express()



app.post("/signup", async (req, res) => {
    // console.log("Got body ", req.body)
    // const userObj = req.body
    // console.log(userObj)
    // req.params
    const user = new UserModel({
        "firstName" :"Raj",
        "lastName":"Shinde",
        "emailId":"rajshinde0565@gmail.com",
        "gender" : "male",
        "age":26,
        "password" : "qwer123"
    })
    try {
        await user.save()
        res.status(200).send("User added !")   
             
    } catch (error) {
        res.status(500).send("somethng went wrong : ",  error)
    }

})
//establish database connection
connectDB()
.then(()=>{
    console.log("Database connection established")
}).catch(err => {
    console.log(err)
})

app.listen(7777,()=>{
    console.log("Server listining on port 7777 !")
})