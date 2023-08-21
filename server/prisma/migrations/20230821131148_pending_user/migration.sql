-- CreateTable
CREATE TABLE "PendingUser" (
    "pendingUserId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "PendingUser_pkey" PRIMARY KEY ("pendingUserId")
);
