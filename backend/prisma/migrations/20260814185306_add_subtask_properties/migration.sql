-- AlterTable
ALTER TABLE "Subtask" ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'NO_PRIORITY';

-- CreateIndex
CREATE INDEX "Subtask_assigneeId_idx" ON "Subtask"("assigneeId");

-- CreateIndex
CREATE INDEX "Subtask_priority_idx" ON "Subtask"("priority");

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
