-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentCommentId_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
