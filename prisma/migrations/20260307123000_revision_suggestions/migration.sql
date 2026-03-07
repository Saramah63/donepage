-- CreateTable
CREATE TABLE "RevisionSuggestion" (
    "id" TEXT NOT NULL,
    "revisionRequestId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "originalValue" TEXT,
    "suggestedValue" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevisionSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RevisionSuggestion_projectId_idx" ON "RevisionSuggestion"("projectId");

-- CreateIndex
CREATE INDEX "RevisionSuggestion_revisionRequestId_idx" ON "RevisionSuggestion"("revisionRequestId");

-- CreateIndex
CREATE INDEX "RevisionSuggestion_createdAt_idx" ON "RevisionSuggestion"("createdAt");

-- AddForeignKey
ALTER TABLE "RevisionSuggestion" ADD CONSTRAINT "RevisionSuggestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionSuggestion" ADD CONSTRAINT "RevisionSuggestion_revisionRequestId_fkey" FOREIGN KEY ("revisionRequestId") REFERENCES "RevisionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
