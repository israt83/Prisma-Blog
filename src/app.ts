import express from "express";
import { postRoute } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRoute } from "./modules/comment/comment.route";


const app = express();
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,

}));

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));




app.use("/posts", postRoute);
app.use("/comments", commentRoute);

app.get("/", (req, res) =>{
    res.send("Hello, World!");
})


export default app;
