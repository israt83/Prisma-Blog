import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) =>{
    try {
        const user = req.user;
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await PostService.createPost(req.body,user.id)

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

const getAllPost = async (req: Request, res: Response) =>{
    try {
        const {search} = req.query
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tags? (req.query.tags as string ).split(",") : [];

        const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true"? 
        true : req.query.isFeatured === 'false' ? false:undefined: undefined;

        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined

        const result = await PostService.getAllPost({search: searchString , tags , isFeatured , status ,authorId})
        res.status(200).json(result);
    } catch (error) {
         res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const PostController ={
    createPost,
    getAllPost
}