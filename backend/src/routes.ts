import { Router } from "express";
import { DASHBOARD_ROLES } from "@nosa/contracts";
import { requireAuth, requireRole } from "@/shared/middlewares/auth";
import { analyticsDashboardRoutes } from "@/modules/analytics/analytics.dashboard.routes";
import { authRoutes } from "@/modules/auth/auth.routes";
import { cmsDashboardRoutes, cmsRoutes } from "@/modules/cms/cms.routes";
import { customOrdersDashboardRoutes, customOrdersRoutes } from "@/modules/custom-orders/custom-orders.routes";
import { reviewsDashboardRoutes, reviewsRoutes } from "@/modules/reviews/reviews.routes";
import { wishlistRoutes } from "@/modules/wishlist/wishlist.routes";
import { cartRoutes } from "@/modules/cart/cart.routes";
import { couponsDashboardRoutes } from "@/modules/coupons/coupons.dashboard.routes";
import { ordersDashboardRoutes } from "@/modules/orders/orders.dashboard.routes";
import { ordersRoutes } from "@/modules/orders/orders.routes";
import { shippingDashboardRoutes, shippingRoutes } from "@/modules/shipping/shipping.routes";
import { categoriesDashboardRoutes } from "@/modules/categories/categories.dashboard.routes";
import { categoriesRoutes } from "@/modules/categories/categories.routes";
import { healthRoutes } from "@/modules/health/health.routes";
import { mediaRoutes } from "@/modules/media/media.routes";
import { productsDashboardRoutes } from "@/modules/products/products.dashboard.routes";
import { productsRoutes } from "@/modules/products/products.routes";
import { settingsDashboardRoutes, settingsRoutes } from "@/modules/settings/settings.routes";
import { usersDashboardRoutes } from "@/modules/users/users.dashboard.routes";

/** Every module registers its router here, once. */
export const apiRouter = Router();

apiRouter.use("/health", healthRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/categories", categoriesRoutes);
apiRouter.use("/products/:slug/reviews", reviewsRoutes);
apiRouter.use("/products", productsRoutes);
apiRouter.use("/settings", settingsRoutes);
apiRouter.use("/media", mediaRoutes);
apiRouter.use("/shipping", shippingRoutes);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/orders", ordersRoutes);
apiRouter.use("/wishlist", wishlistRoutes);
apiRouter.use("/custom-orders", customOrdersRoutes);
apiRouter.use("/cms", cmsRoutes);

/** Staff only. Finer role checks live on each route. */
const dashboard = Router();
dashboard.use(requireAuth, requireRole(...DASHBOARD_ROLES));
dashboard.use("/users", usersDashboardRoutes);
dashboard.use("/categories", categoriesDashboardRoutes);
dashboard.use("/products", productsDashboardRoutes);
dashboard.use("/settings", settingsDashboardRoutes);
dashboard.use("/shipping", shippingDashboardRoutes);
dashboard.use("/coupons", couponsDashboardRoutes);
dashboard.use("/orders", ordersDashboardRoutes);
dashboard.use("/custom-orders", customOrdersDashboardRoutes);
dashboard.use("/reviews", reviewsDashboardRoutes);
dashboard.use("/cms", cmsDashboardRoutes);
dashboard.use("/analytics", analyticsDashboardRoutes);

apiRouter.use("/dashboard", dashboard);
