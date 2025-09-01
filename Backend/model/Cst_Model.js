import mongoose from "mongoose";


const cstSchema = new mongoose.Schema({
    cst:
    {
        type:String,
        required: true,
        unique:true
    }
});

const Cst = mongoose.model('Cst',cstSchema);

export default Cst;