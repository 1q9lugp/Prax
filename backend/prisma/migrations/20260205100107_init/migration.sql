-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "emial" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emial_key" ON "User"("emial");
