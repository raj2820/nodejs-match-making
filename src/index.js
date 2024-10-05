const express = require('express')
const {connectDB} = require("./config/database")
const {UserModel} = require("./models/user")
const {validateSignupData} = require("./utils/validation")
var bcrypt = require('bcryptjs');

// create express app
const app = express()

app.use(express.json())

// Adding data to database
app.post("/signup", async (req, res) => {
    try {
        const {firstName,lastName,emailId,gender,age,password} = req.body
        validateSignupData(req)
        // const password = req.body.password
        var hash = await bcrypt.hashSync(password, 10);
        console.log("Password hash : ", hash)
        //Creating new instance of user model
        const user = new UserModel({firstName,lastName,emailId,gender,age,password:hash})
        await user.save()
        res.status(200).send("User added !")   
             
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send("User already exists")
          } else {
            res.status(400).send("somethng went wrong : " + err)
          }
    }

})

app.get("/user", async (req, res) => {
    const email = req.body.email
    try {
     const user =  await UserModel.find({emailId:email}) // pass the filter to get specfic user
     if(user.length === 0){
        res.status(404).send("User not found")
     }else{
        res.status(200).send(user)
     }  
    } catch (error) {
        res.status(500).send("Something went wrong ")
        console.log(error)
    }
})

app.get("/feed", async (req, res) => {
    const email = req.body.email
    try {
     const user =  await UserModel.find({}) // pass empty filter to get all the documents
     if(user.length === 0){
        res.status(404).send("User not found")
     }else{
        res.status(200).send(user)
     }  
    } catch (error) {
        res.status(500).send("Something went wrong ")
        console.log(error)
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await UserModel.findByIdAndDelete({_id:userId})
        console.log(user)
        res.status(200).send("user deleted successfully !")
    } catch (error) {
        res.status(500).send("Something went wrong ")
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    console.log(userId)
    const data = req.body

    try {
        if(data.skills.length > 10){
            throw new Error("Skills cannot be more than 10")
        }
        const ALLOWED_UPDATES = ["photoUrl","about","gender"]

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
    
        if(!isUpdateAllowed){
            // res.status(400).send("Update not allowed")
            throw new Error("Update not allowed " + Object.keys(req.body))
        }

        const user = await UserModel.findByIdAndUpdate({_id:userId}, data,{
            runValidators:true
        })
        if(!user){
            res.status(404).send("User not found")
        }
        res.status(200).send("user updated successfully !")
    } catch (error) {
        res.status(500).send("Update failed "+ error)
    }
})

app.post("/login", async(req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await UserModel.findOne({emailId:emailId});
        if(!user){
            throw new Error("invalid credentials")
        }

        console.log(user)

        bcrypt.compare(password, user.password, function(err, result) {
            // res === true
            if (result === true){
                res.status(200).send("Login successfull !")
            }else{
                res.status(400).send("Login Failed !" + err)
            }
            
        })
        // console.log(isPassword)
    } catch (error) {
        res.status(500).send("Login failed "+ error)
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