/*
  Warnings:

  - You are about to drop the column `billing` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `collaboration` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `designComplete` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `marketing` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smsNotifications` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyReports` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `maxOrganizations` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usedOrganizations` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `units` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegionDataSource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOrganization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAccess" DROP CONSTRAINT "ProjectAccess_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAccess" DROP CONSTRAINT "ProjectAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAsset" DROP CONSTRAINT "ProjectAsset_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvitation" DROP CONSTRAINT "ProjectInvitation_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvitation" DROP CONSTRAINT "ProjectInvitation_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInvitation" DROP CONSTRAINT "ProjectInvitation_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_parentId_fkey";

-- DropForeignKey
ALTER TABLE "RegionDataSource" DROP CONSTRAINT "RegionDataSource_regionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganization" DROP CONSTRAINT "UserOrganization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganization" DROP CONSTRAINT "UserOrganization_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "billing",
DROP COLUMN "collaboration",
DROP COLUMN "designComplete",
DROP COLUMN "marketing",
DROP COLUMN "smsNotifications",
DROP COLUMN "weeklyReports",
ADD COLUMN     "newNotebookShared" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weeklyDigest" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "company",
DROP COLUMN "jobTitle",
DROP COLUMN "maxOrganizations",
DROP COLUMN "role",
DROP COLUMN "usedOrganizations",
ALTER COLUMN "timezone" SET DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "units",
ADD COLUMN     "defaultNotebookColor" TEXT NOT NULL DEFAULT '#3b82f6';

-- DropTable
DROP TABLE "ApiKey";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationInvitation";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectAccess";

-- DropTable
DROP TABLE "ProjectAsset";

-- DropTable
DROP TABLE "ProjectInvitation";

-- DropTable
DROP TABLE "Region";

-- DropTable
DROP TABLE "RegionDataSource";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "UserOrganization";

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#3b82f6',
    "icon" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "tags" TEXT[],
    "category" TEXT,
    "userId" TEXT NOT NULL,
    "notebookId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB,
    "drawingData" JSONB,
    "type" TEXT NOT NULL DEFAULT 'text',
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "notebookId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notebook_userId_idx" ON "Notebook"("userId");

-- CreateIndex
CREATE INDEX "Notebook_isPublic_idx" ON "Notebook"("isPublic");

-- CreateIndex
CREATE INDEX "Material_userId_idx" ON "Material"("userId");

-- CreateIndex
CREATE INDEX "Material_notebookId_idx" ON "Material"("notebookId");

-- CreateIndex
CREATE INDEX "Material_category_idx" ON "Material"("category");

-- CreateIndex
CREATE INDEX "Page_userId_idx" ON "Page"("userId");

-- CreateIndex
CREATE INDEX "Page_notebookId_idx" ON "Page"("notebookId");

-- CreateIndex
CREATE INDEX "Page_type_idx" ON "Page"("type");

-- CreateIndex
CREATE INDEX "Page_isPinned_idx" ON "Page"("isPinned");

-- CreateIndex
CREATE INDEX "Page_isArchived_idx" ON "Page"("isArchived");

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
