import { model } from "mongoose";
import Post from "../models/Post.js";
import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const posts = await PostModel.find().populate('user').exec();

        const sorted = posts.slice(startIndex, endIndex);

        res.json({
            length: posts.length,
            posts: sorted,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try{
        const postId = req.params.id;
        
        PostModel.findOneAndUpdate({
             _id: postId,
        }, 
        {
            $inc: { viewsCount: 1 }
        }, 
        {
            returnDocument: 'after',
        }, 
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Вернуть статью не удалось',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: "Статья не найдена",
                });
            }

            res.json(doc);
        },
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Статьи получить не удалось',
        });
    }
}

export const remove = async (req, res) => { 
    try{
        const postId = req.params.id;

        PostModel.findOneAndDelete(
        {
            _id: postId,
        }, 
        (err,doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Удалить статью не удалось',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }

            res.json({
                sucress: true,
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Статьи получить не удалось',
        });
    }
}


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.title,
            ImageUrl: req.body.ImageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Статью создать не удалось',
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,          
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            ImageUrl: req.body.ImageUrl,
            user: req.userId,
            tags: req.body.tags,
        });

        res.json({
            sucress: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Статью обновить не удалось',
        });
    }
}