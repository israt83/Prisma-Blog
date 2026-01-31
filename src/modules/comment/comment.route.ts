import { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { Role } from "../../middleware/auth";


const router = Router();

router.get("/author/:authorId", CommentController.getCommentByAuthorId);

router.get("/:commentId", CommentController.getCommentById);

router.delete("/:commentId",auth(Role.USER,Role.ADMIN), CommentController.deleteComment);

router.post("/",
    auth(Role.USER,Role.ADMIN),
     CommentController.createComment);

export const commentRoute = router;
