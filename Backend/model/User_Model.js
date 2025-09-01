import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:
    {
        type:String,
        required: true,
        unique:true,
        lowercase: true, // store in lowercase
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"] // regex validation
    },
    password:
    {
        type:String,
        required:true,
        minlength:6
    }
});

const Users = mongoose.model('Users',userSchema);

export default Users;