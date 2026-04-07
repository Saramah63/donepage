ALTER TABLE "Order"
RENAME COLUMN "customerName" TO "clientName";

UPDATE "Order"
SET "email" = COALESCE("email", 'unknown@donepage.co'),
    "amount" = COALESCE("amount", 0),
    "status" = COALESCE(NULLIF("status", ''), 'pending');

ALTER TABLE "Order"
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;
