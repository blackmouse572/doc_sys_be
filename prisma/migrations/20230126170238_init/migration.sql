-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('Bi_Thu', 'Chu_Tich', 'Can_Bo_Nhan_Vien', 'Giam_Doc', 'Giao_Vu', 'Giang_Vien', 'Hieu_Truong', 'Pho_Giam_Doc_1', 'Pho_Giam_Doc_2', 'Pho_Khoa', 'Pho_Trung_Tam', 'Pho_Tong_Giam_Doc_2', 'Pho_Tong_Giam_Doc_3', 'Truong_Khoa', 'Truong_Trung_Tam', 'Tong_Giam_Doc', 'Truong_Phong');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('Cong_Van', 'Van_Ban', 'Quyet_Dinh', 'Thong_Bao', 'Thong_Tu', 'Nghien_Cuu', 'Bao_Cao', 'Tai_Lieu', 'Khac');

-- CreateEnum
CREATE TYPE "IssueMarkType" AS ENUM ('Ban_Giam_Doc', 'Tong_Cong_Ty', 'Ke_Toan_Tong_Cong_Ty', 'Ban_Quan_Tri', 'Ban_Ke_Toan', 'Phong_Tong_Hop');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "avatar" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "homeTown" TEXT,
    "currentAddress" TEXT,
    "CID" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkPlaceDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "UserWorkPlaceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Group" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocType" NOT NULL,
    "issueMark" "IssueMarkType" NOT NULL,
    "issueGroupId" TEXT NOT NULL,
    "issuePublisherId" TEXT NOT NULL,
    "issueRoleId" TEXT NOT NULL,
    "date_release" TIMESTAMP(3) NOT NULL,
    "data_available" TIMESTAMP(3) NOT NULL,
    "date_expired" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentOrganization" TEXT NOT NULL,
    "sentDepartment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentReceiveDetail" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date_receive" TIMESTAMP(3) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentReceiveDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserWorkPlaceDetails" ADD CONSTRAINT "UserWorkPlaceDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkPlaceDetails" ADD CONSTRAINT "UserWorkPlaceDetails_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkPlaceDetails" ADD CONSTRAINT "UserWorkPlaceDetails_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkPlaceDetails" ADD CONSTRAINT "UserWorkPlaceDetails_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Group" ADD CONSTRAINT "User_Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Group" ADD CONSTRAINT "User_Group_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_issueGroupId_fkey" FOREIGN KEY ("issueGroupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_issuePublisherId_fkey" FOREIGN KEY ("issuePublisherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_issueRoleId_fkey" FOREIGN KEY ("issueRoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_sentOrganization_fkey" FOREIGN KEY ("sentOrganization") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_sentDepartment_fkey" FOREIGN KEY ("sentDepartment") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReceiveDetail" ADD CONSTRAINT "DocumentReceiveDetail_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReceiveDetail" ADD CONSTRAINT "DocumentReceiveDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
