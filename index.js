import express from "express";
import multer from "multer";

import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import checkAuth from "./utils/checkAuth.js";   
import handleValidationErrors from "./utils/handleValidationErrors.js";

import { UserController, PostController } from "./controllers/index.js";    

import dotenv from 'dotenv';
dotenv.config();

mongoose
    .connect(
        process.env.MONGO_URL,
        )
    .then(() => {console.log('DB ok')})
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_,__,cb) => {
        cb(null, 'uploads');
    },
    filename: (_,file,cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.fille.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server Ok");
});