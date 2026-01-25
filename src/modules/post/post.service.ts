import {
  Payload,
  PostWhereInput,
} from "./../../../generated/prisma/internal/prismaNamespace";
import { Post, PostStatus } from "../../../generated/prisma/client";
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
  sortBy : string | undefined;
  sortOrder : string | undefined;
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
    orderBy : sortBy && sortOrder ?  {
      [sortBy] : sortOrder 
    } : { createdAt : 'desc' }
  });
  return result;
};

export const PostService = {
  createPost,
  getAllPost,
};
