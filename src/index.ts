import server from "./server"
import mongoose from "mongoose"

const PORT = process.env.PORT

mongoose.set("returnOriginal", false)
mongoose
  .connect(process.env.MONGO_STRING!)
  .then(() => server.listen(PORT, () => console.log("Server running on port " + PORT)))
  .catch(err => console.log(err.message))
