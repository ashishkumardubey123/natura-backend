export {};
const app = require("./src/app");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is running on ${port} `);
});