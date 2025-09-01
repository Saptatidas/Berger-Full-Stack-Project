import mongoose from "mongoose";


const skuSchema = new mongoose.Schema({
    sku:
    {
        type:String,
        required: true,
    },
    org:
    {
        type:String,
        required: true,
    },
    subinventory:
    {
        type:[String],
        required:true,
    },
    stock:
    {
        type:[Number],
        required:true,
    }
});

const Sku = mongoose.model('Sku',skuSchema);


export  default Sku;