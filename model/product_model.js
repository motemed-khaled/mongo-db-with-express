import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "product title required"],
        minlength: [3, "to short product title"],
        maxlength: [35, "to long product title"],
        lowercase: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    descreption: {
        type: String,
        required: [true, "product description is required"],
        minlength: [10, "to short product title"],
        maxlength: [100, "to long product title"],
    },
    price: {
        type: Number,
        required: [true, "product price is required"],
        maxlength: [200000, "to long product price"]
    },
    priceAfterDiscount: Number,
    imageCover: {
        type: String,
        required: [true, "product imageCover is required"]
    }
}, { timestamps: true  });

const setImgUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/uploads/product/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
}
productSchema.post("init", doc => {
    setImgUrl(doc);
});

productSchema.post("save", doc => {
    setImgUrl(doc);
});

export const productModel = mongoose.model("product", productSchema, "producties");