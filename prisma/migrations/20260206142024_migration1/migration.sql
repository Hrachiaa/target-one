-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "password" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avatar" TEXT NOT NULL DEFAULT 'https://cdn/first-login.png',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
