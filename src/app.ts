import express from "express";
import { postRoute } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRoute } from "./modules/comment/comment.route";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";


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

app.use(notFound);

app.use(errorHandler);



export default app;
