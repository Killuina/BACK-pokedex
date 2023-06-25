import mongoose from "mongoose";

const connectDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);
  mongoose.set("debug", true);

  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, returnedObject) {
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

  await mongoose.connect(url);
};

export default connectDatabase;
