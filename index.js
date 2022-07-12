require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const app = express();

app.use(express.json());
// app.use(express.urle)


const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    avatar:String
});

const Users = mongoose.model("Users", schema);

connection()


app.use("/file", upload);


app.get("/users/", async (req,res) => {
    const users = await Users.find();
    return res.json({status:200, data:users});
})

app.post("/users/", async (req,res) => {
    const saveUser = new Users(req.body);
    const savedUser = await saveUser.save();
    return res.json({status:201, data:savedUser})
})

app.delete("/users/:id", async (req,res) => {
    const deleted = await Users.findOneAndDelete(req.params.id);
    return res.json({status:200, message:"deleted", data:deleted})
})



// media routes
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

const port =  8080;
app.listen(port, console.log(`Listening on port ${port}...`));
