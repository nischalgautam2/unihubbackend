"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
    },
    profilepic: {
        type: String,
    },
    googleId: String,
    password: {
        type: String,
    },
    firstName: {
        type: String,
    },
    email: {
        type: String,
    },
    lastName: {
        type: String,
    },
    gender: {
        type: String,
        default: "Male",
    },
    followers: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    saved: [{ type: mongoose_1.default.Types.ObjectId, ref: "Post" }],
}, { timestamps: true });
const usermodel = mongoose_1.default.model("User", User);
exports.default = usermodel;
