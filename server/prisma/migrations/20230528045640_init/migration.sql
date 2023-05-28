-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "cheatmealSchedule" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("userId","token")
);

-- CreateTable
CREATE TABLE "TrainerClientPair" (
    "trainerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "TrainerClientPair_pkey" PRIMARY KEY ("trainerId","clientId")
);

-- CreateTable
CREATE TABLE "TrainerClientRequest" (
    "trainerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "TrainerClientRequest_pkey" PRIMARY KEY ("trainerId","clientId")
);

-- CreateTable
CREATE TABLE "PartnerPair" (
    "partnerId1" TEXT NOT NULL,
    "partnerId2" TEXT NOT NULL,

    CONSTRAINT "PartnerPair_pkey" PRIMARY KEY ("partnerId1","partnerId2")
);

-- CreateTable
CREATE TABLE "PartnerRequest" (
    "requester" TEXT NOT NULL,
    "requestee" TEXT NOT NULL,

    CONSTRAINT "PartnerRequest_pkey" PRIMARY KEY ("requester","requestee")
);

-- CreateTable
CREATE TABLE "SnitchEvent" (
    "snitchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lon" DECIMAL(65,30) NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "restaurantLat" DECIMAL(65,30) NOT NULL,
    "restaurantLon" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "SnitchEvent_pkey" PRIMARY KEY ("snitchId")
);

-- CreateTable
CREATE TABLE "CheatMealEvent" (
    "cheatMealId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lon" DECIMAL(65,30) NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "restaurantLat" DECIMAL(65,30) NOT NULL,
    "restaurantLon" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "CheatMealEvent_pkey" PRIMARY KEY ("cheatMealId")
);
