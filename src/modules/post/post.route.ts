import { Router } from "express";
import { PostController } from "./post.controller";

import auth, { Role } from "../../middleware/auth";

const router = Router();
router.get("/my-posts",auth(Role.USER,Role.ADMIN), PostController.getMyPosts);
router.get('/' ,PostController.getAllPost)

router.get('/:postId',PostController.getPostById);

router.post("/", auth(Role.USER,Role.ADMIN), PostController.createPost);

router.patch('/:postId',auth(Role.USER,Role.ADMIN),PostController.updatePost);

router.delete('/:postId',auth(Role.USER,Role.ADMIN),PostController.deletePost);


export const postRoute = router;
