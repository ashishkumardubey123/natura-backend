import app from "./src/app.ts"
import dotenv from "dotenv";

dotenv.config();

const port =  process.env.PORT

app.listen( port, () => {
      console.log( `app is running on ${port} ` )
} )