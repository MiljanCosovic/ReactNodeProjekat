import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Nije u procesu",
      enum: ["Nije u procesu", "U procesu", "Poslato", "Isporucen", "Ponisten"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);