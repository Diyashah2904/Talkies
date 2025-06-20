const { default: mongoose } = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log(e);
  });
