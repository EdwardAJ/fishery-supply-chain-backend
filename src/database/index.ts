import mongoose from "mongoose"

const init = async (): Promise<void> => {
  await mongoose.connect(
    process.env.MONGODB_URI as string,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )
  mongoose.set("debug", true)
}

export default {
  init
}
