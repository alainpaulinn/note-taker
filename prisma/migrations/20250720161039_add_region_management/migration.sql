-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "regionId" TEXT;

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "bounds" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionDataSource" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "dataSourceType" TEXT NOT NULL,
    "apiEndpoint" TEXT,
    "apiKey" TEXT,
    "apiHeaders" JSONB,
    "apiMethod" TEXT DEFAULT 'GET',
    "scraperUrl" TEXT,
    "scraperConfig" JSONB,
    "fileUrl" TEXT,
    "fileType" TEXT,
    "dataMapping" JSONB,
    "updateFrequency" TEXT DEFAULT 'daily',
    "lastUpdated" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionDataSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Region_parentId_idx" ON "Region"("parentId");

-- CreateIndex
CREATE INDEX "Region_type_idx" ON "Region"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegionDataSource_regionId_key" ON "RegionDataSource"("regionId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionDataSource" ADD CONSTRAINT "RegionDataSource_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
