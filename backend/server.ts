export {};
const app = require("./src/app");
const dotenv = require("dotenv");
const db = require("./src/config/dbconnection");

dotenv.config();

// const port = process.env.PORT;

// app.listen(port, () => {
//   console.log(`app is running on ${port} `);
// });

db.getConnection()
  .then(connection => {
    console.log("MySQL Database connected successfully! ✅");
    connection.release();
  })
  .catch(err => {
    console.error("Database connection failed! ❌", err.message);
  });


const port = process.env.PORT || 5000;

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});