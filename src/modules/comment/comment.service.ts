import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComment = async( payload:{
    content : string,
    authorId : string,
    postId : string,
    parentCommentId ?: string
})=>{
    await prisma.post.findUniqueOrThrow({
        where : {
            id : payload.postId
        }
    })

    if(payload.parentCommentId){
     await prisma.comment.findUniqueOrThrow({
            where : {
                id : payload.parentCommentId
            }
        })
    }
     return await prisma.comment.create({
        data : payload
    })
}

const getCommentById = async(id : string)=>{
    return await prisma.comment.findUnique({
        where : {
            id
        },
        include : {
            post : {
                select :{
                    id : true,
                    title : true,
                    views : true
                }
            },
        }
    })
}

const getCommentByAuthorId = async(authorId : string)=>{
    return await prisma.comment.findMany({
        where : {
            authorId
        },
        orderBy:{
            createdAt : "desc"
        },
        include : {
            post : {
                select :{
                    id : true,
                    title : true,
                }
            }
        }
    })
}

const deleteComment = async(id : string, authorId : string)=>{
    const commentData = await prisma.comment.findFirst({
        where :{
            id,
            authorId
        },
        select:{
            id : true
        }
    })
    if(!commentData){
        throw new Error("Comment not found or you are not authorized to delete this comment");
    }
    return await prisma.comment.delete({
        where : {
            id,
            authorId
        }
    })
}

const updateComment = async(commentId : string, data : {content? : string , status?:CommentStatus}, authorId : string) => {
    const commentData = await prisma.comment.findFirst({
        where :{
            id : commentId,
            authorId
        },
        select:{
            id : true
        }
    })
    if(!commentData){
        throw new Error("Comment not found or you are not authorized to update this comment");
    }

    return await prisma.comment.update({
        where : {
            id : commentId,
            authorId
        },
        data
    })
}

export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment
}