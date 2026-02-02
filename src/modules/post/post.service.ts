import {
  Payload,
  PostWhereInput,
} from "./../../../generated/prisma/internal/prismaNamespace";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status : PostStatus | undefined;
  authorId : string | undefined;
  page : number;
  limit : number;
  skip : number;
  sortBy : string;
  sortOrder : string 
}) => {
  const andCondition: PostWhereInput[] = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if(typeof isFeatured === "boolean"){
    andCondition.push({
        isFeatured
    })
  }

  if(status){
    andCondition.push({
        status
    })
  }
  if(authorId){
    andCondition.push({
        authorId
    })
  }
  const result = await prisma.post.findMany({
    take : limit,
    skip ,
    where: {
      AND: andCondition,
    },
    orderBy : {
      [sortBy] : sortOrder 
    },
    include : {
      _count : {
        select : {
          comments : true
        }
      }
    }
  });

  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    }
  })
  return {data: result,
    pagination : {
      total,
      page,
      limit,
      totalPages : Math.ceil(total/limit)
    }
  }
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async(tx)=>{
     await tx.post.update({
    where: {
      id: postId,
    },
    data: {
      views :{
        increment : 1
      }
    }
  })
  const postData= await tx.post.findUnique({
    where: {
      id: postId,
    },
    include :{
    comments : {
      where :{
        parentCommentId : null,
        status : CommentStatus.APPROVED
      },
      orderBy : {
        createdAt : "desc"
      },
      include :{
        replies:{
          where :{
            status : CommentStatus.APPROVED
          },
          orderBy : {
            createdAt : "desc"
          },
          include :{
            replies : {
              where :{
                status : CommentStatus.APPROVED
              },
              orderBy : {
                createdAt : "desc"
              },
            },
          }
        }
      }
    },
    _count : {
      select : {
        comments : true
      }
    }
    }
  });
  return postData;
  })

  return result;
};

const getMyPosts = async(authorId : string)=>{
   await prisma.user.findUniqueOrThrow({
    where :{
      id : authorId,
      status : "ACTIVE"
    },
    select :{
      id : true,
     
    }
  })



  const result = await prisma.post.findMany({
    where:{
      authorId
    },
    orderBy :{
      createdAt : "desc"
    },
    include :{
      _count : {
        select:{
          comments : true
        }
      }
    }
  })

// post count using count method

  const total = await prisma.post.count({
    where:{
      authorId
    }
  })

    // post count using aggregate
  // const total = await prisma.post.aggregate({
  //   _count :{
  //     id : true
  //   },
  //   where :{
  //     authorId
  //   }
  // })

  return {data : result, total};
}

const updatePost = async(postId:string,data:Partial<Post>,authorId : string ,isAdmin : boolean)=>{

  const postData = await prisma.post.findUniqueOrThrow({
    where:{
      id : postId,
    },
    select:{
      id : true,
      authorId : true
    }
  })
  if( !isAdmin && (postData.authorId !== authorId)){
    throw new Error("You are not authorized to update this post")
  }

  if(!isAdmin){
    delete data.isFeatured;
  }

  const result = await prisma.post.update({
    where:{
      id : postId
    },
    data
  })

  return result;

}

const deletePost = async(postId: string ,authorId:string,isAdmin:boolean) =>{
    const postData = await prisma.post.findUniqueOrThrow({
    where:{
      id : postId,
    },
    select :{
      id : true,
      authorId : true
    }
    })

    if(!isAdmin && (postData.authorId !== authorId)){
      throw new Error("You are not authorized to delete this post")
    }

    return await prisma.post.delete({
      where:{
        id : postId
      }
    })
}

export const PostService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost
};
