import { Router } from "express";
import { PostController } from "./post.controller";

import auth, { Role } from "../../middleware/auth";

const router = Router();

router.post("/", auth(Role.USER), PostController.createPost);

export const postRoute = router;
