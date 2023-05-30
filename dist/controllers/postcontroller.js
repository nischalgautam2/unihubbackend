"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosts = exports.getSavedPosts = exports.unsavePost = exports.savePost = exports.unlikepost = exports.getonepost = exports.getHomePosts = exports.likepost = exports.createPost = void 0;
const postmodel_1 = __importDefault(require("../models/postmodel"));
const usermodel_1 = __importDefault(require("../models/usermodel"));
const getonepost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const result = yield postmodel_1.default.findOne({ _id: id }).populate({
            path: "userId",
            select: "_id username lastName firstName  ",
        });
        if (!result) {
            return res.status(404).json("cannot find the post");
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});
exports.getonepost = getonepost;
const getHomePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const userid = req.query.userid;
    const postsQuery = postmodel_1.default.find().populate({
        path: "userId",
        select: "_id username lastName firstName",
    });
    //TODO : SEND likes and comment count sepertely
    const limit = 20;
    const skip = (page - 1) * limit;
    const postsQueryPaginated = postsQuery.skip(skip).limit(limit);
    const toreturn = yield postsQueryPaginated.exec();
    const modifiedPosts = toreturn.map((post) => {
        const modifiedPost = post.toObject();
        modifiedPost.commentsCount = post.comments.length;
        modifiedPost.likesCount = post.likes.length;
        modifiedPost.hasLiked = post.likes.includes(userid);
        delete modifiedPost.comments;
        delete modifiedPost.likes;
        return modifiedPost;
    });
    res.status(200).json({ msg: modifiedPosts });
});
exports.getHomePosts = getHomePosts;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const insert = yield usermodel_1.default.findOneAndUpdate({ _id: req.body.id }, {
            $push: { saved: req.params.id },
        });
        if (!insert) {
            return res.status(400).json({ err: "unable to save post" });
        }
        return res.status(200).send("saved post");
    }
    catch (err) {
        console.log(err);
    }
});
exports.savePost = savePost;
const unsavePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const remove = yield usermodel_1.default.findOneAndUpdate({ _id: req.body.id }, {
            $pull: { saved: req.params.id },
        });
        if (!remove) {
            return res.status(400).json({ err: "unable to unsave post" });
        }
        return res.status(200).send("saved post");
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
exports.unsavePost = unsavePost;
const getSavedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const userid = req.params.id;
    const limit = 20;
    const skip = (page - 1) * limit;
    const savedposts = usermodel_1.default
        .findOne({ _id: req.params.id })
        .populate({ path: "saved" })
        .skip(skip);
    const toreturn = yield savedposts.exec();
    const modifiedPosts = toreturn.saved.map((post) => {
        const modifiedPost = post.toObject();
        modifiedPost.commentsCount = post.comments.length;
        modifiedPost.likesCount = post.likes.length;
        modifiedPost.hasLiked = post.likes.includes(userid);
        delete modifiedPost.comments;
        delete modifiedPost.likes;
        return modifiedPost;
    });
    res.status(200).json({ msg: modifiedPosts });
});
exports.getSavedPosts = getSavedPosts;
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { userId, description } = req.body;
        const result = yield postmodel_1.default.create({
            description: description,
            userId,
        });
        if (result) {
            res.status(200).json("Posted sucessfully");
        }
        else {
            res.status(500).json({ msg: "unable to create a new post" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});
exports.createPost = createPost;
const unlikepost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postid = req.params.id;
        const userid = req.body.userid;
        if (!userid) {
            return res.status(400).json("userid must be provided");
        }
        const post = yield postmodel_1.default.findOneAndUpdate({ _id: req.params.id, likes: userid }, {
            $pull: { likes: userid },
        }, { new: true });
        if (!post) {
            return res
                .status(500)
                .json("unable to find or unlike post as you have not liked it ");
        }
        else {
            res.status(200).json("unliked the post");
        }
    }
    catch (err) {
        res.status(500).json({ err: err });
    }
});
exports.unlikepost = unlikepost;
const likepost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.body.userid;
        console.log(typeof userid);
        if (!userid) {
            return res.status(500).json("userid must be sent");
        }
        const { id } = req.params;
        const post = yield postmodel_1.default.findOne({
            _id: id,
            likes: userid,
        }, { new: true });
        if (post) {
            return res.status(500).json("you have already liked this post");
        }
        else {
            const posttolike = yield postmodel_1.default.findOneAndUpdate({ _id: id }, {
                $push: { likes: userid },
            }, { new: true });
            if (!posttolike) {
                res.status(500).json({ err: "unable to like the post" });
            }
            else {
                res.status(200).json("liked the post");
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.likepost = likepost;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.params.page) || 1;
        const userId = req.params.id;
        const postsQuery = postmodel_1.default.find({ userId: userId }).populate({
            path: "userId",
            select: "_id username lastName firstName",
        });
        //TODO : SEND likes and comment count sepertely
        const limit = 20;
        const skip = (page - 1) * limit;
        const postsQueryPaginated = postsQuery.skip(skip).limit(limit);
        const toreturn = yield postsQueryPaginated.exec();
        const modifiedPosts = toreturn.map((post) => {
            const modifiedPost = post.toObject();
            modifiedPost.commentsCount = post.comments.length;
            modifiedPost.likesCount = post.likes.length;
            modifiedPost.hasLiked = post.likes.includes(userId);
            delete modifiedPost.comments;
            delete modifiedPost.likes;
            return modifiedPost;
        });
        res.status(200).json({ msg: modifiedPosts });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getUserPosts = getUserPosts;
