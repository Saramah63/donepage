-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "amount" INTEGER,
ADD COLUMN "draftId" TEXT,
ADD COLUMN "customerName" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Set default status for historical compatibility
ALTER TABLE "Order"
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "Order_draftId_idx" ON "Order"("draftId");

-- CreateIndex
CREATE INDEX "Order_email_idx" ON "Order"("email");
