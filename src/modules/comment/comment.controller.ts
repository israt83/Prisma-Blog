import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async(req:Request , res : Response) =>{
    try {
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await commentService.createComment(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({message : "Internal Server Error", error});
    }
}

const getCommentById = async(req:Request , res : Response) =>{
    try {
        const {commentId} = req.params;
        const result = await commentService.getCommentById(commentId as string);
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({message : "Internal Server Error", error});
    }
}

const getCommentByAuthorId = async(req:Request , res : Response) =>{
    try {
        const {authorId} = req.params;
        const result = await commentService.getCommentByAuthorId(authorId as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message : "Internal Server Error", error});
    }
}

const deleteComment = async(req:Request , res : Response) =>{
    try {
        const user = req.user;
        const {commentId} = req.params;
        const result = await commentService.deleteComment(commentId as string, user?.id as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message : "Comment delete failed ", error});
    }
}

const updateComment = async(req:Request , res : Response) =>{
    try {
        const user = req.user;
        const {commentId} = req.params;
        const result = await commentService.updateComment(commentId as string, req.body, user?.id as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message : "Comment update failed", error});
    }
}

export const CommentController ={
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment
}