import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

        const options = paginationSortingHelper(req.query);

        const {page , limit , skip , sortBy , sortOrder} = options;

        const result = await PostService.getAllPost({search: searchString , tags , isFeatured , status ,authorId , page , limit , skip , sortBy , sortOrder})
        res.status(200).json(result);
    } catch (error) {
         res.status(500).json({ message: "Internal Server Error", error });
    }
}

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const result = await PostService.getPostById(postId);

    if (!result) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const PostController ={
    createPost,
    getAllPost,
    getPostById,
}