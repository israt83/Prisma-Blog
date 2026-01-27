import { Router } from "express";
import { PostController } from "./post.controller";

import auth, { Role } from "../../middleware/auth";

const router = Router();

router.get('/' ,PostController.getAllPost)

router.get('/:postId',PostController.getPostById);

router.post("/", auth(Role.USER), PostController.createPost);

export const postRoute = router;
