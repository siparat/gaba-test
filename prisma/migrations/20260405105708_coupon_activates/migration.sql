-- CreateTable
CREATE TABLE "CouponActivate" (
    "email" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponActivate_pkey" PRIMARY KEY ("email","couponId")
);

-- AddForeignKey
ALTER TABLE "CouponActivate" ADD CONSTRAINT "CouponActivate_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
