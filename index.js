import express from "express";
import authRoutes from "./server/routes/authRoutes.js";

const app = express();

// Set static folder
app.use(express.static("public"));

// Parse URL-encoded bodies (as send by HTML forms)
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Parse JSON bodies (as send by API clients)
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "public/views");

app.use(authRoutes);

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
