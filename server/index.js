const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");

const userRouter = require('./routes/user');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use('/api/user', userRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server started");
})