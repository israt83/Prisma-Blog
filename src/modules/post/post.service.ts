import { Payload } from "./../../../generated/prisma/internal/prismaNamespace";
import { Post } from "../../../generated/prisma/client";
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
}: {
  search?: string | undefined;
  tags?: string[] | [];
}) => {
  const andCondition = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search ,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search ,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search ,
          },
        },
      ],
    });
  }
    if (tags.length >0){
        andCondition.push(
            {
          tags: {
            hasEvery: tags as string[],
          },
        },
        )

    }
  const result = await prisma.post.findMany({
    where: {
      AND: [
        
      ],
    },
  });
  return result;
};

export const PostService = {
  createPost,
  getAllPost,
};
