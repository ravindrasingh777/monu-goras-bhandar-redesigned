import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  price: varchar("price", { length: 256 }).notNull(),
  final_price: varchar("final_price", { length: 256 }),
  bannerImage: varchar("banner_image", { length: 256 }),
  remarks: varchar("remarks", { length: 256 }),
  is_active: boolean("is_active").default(true).notNull(),
  stock: integer("stock").default(1).notNull(),
  tags: text("tags").array().default([]).notNull(),
  sku: varchar("sku", { length: 256 }).notNull(),
  length: varchar("length", { length: 256 }).notNull(),
  width: varchar("width", { length: 256 }).notNull(),
  height: varchar("height", { length: 256 }).notNull(),
  weight: real("weight").default(0.5),
  long_description: text("long_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  bannerImage: varchar("banner_image", { length: 256 }),
  is_active: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "verified",
  "rejected",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cod",
  "upi",
  "bank_transfer",
  "qr_code",
]);

export const addressTypeEnum = pgEnum("address_type", ["shipping", "billing"]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "pending",
  "ready_to_ship",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),

    email: varchar("email", { length: 256 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),

    updatesOnEmail: boolean("updates_on_email").default(false).notNull(),

    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),

    discountAmount: numeric("discount_amount", {
      precision: 10,
      scale: 2,
    })
      .default("0")
      .notNull(),

    shippingFee: numeric("shipping_fee", {
      precision: 10,
      scale: 2,
    })
      .default("0")
      .notNull(),

    taxAmount: numeric("tax_amount", {
      precision: 10,
      scale: 2,
    })
      .default("0")
      .notNull(),

    totalAmount: numeric("total_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),

    couponCode: varchar("coupon_code", { length: 100 }),

    currency: varchar("currency", { length: 3 }).default("INR").notNull(),

    status: orderStatusEnum("status").default("pending").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("orders_status_idx").on(table.status),
    index("orders_email_idx").on(table.email),
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_order_id_idx").on(table.id),
  ],
);

export const orderAddresses = pgTable(
  "order_addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    addressType: addressTypeEnum("address_type").notNull(),

    country: varchar("country", { length: 100 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),

    address: text("address").notNull(),
    apartment: varchar("apartment", { length: 255 }),

    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    pincode: varchar("pincode", { length: 20 }).notNull(),

    phone: varchar("phone", { length: 20 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("order_address_type_unique").on(table.orderId, table.addressType),
    index("order_addresses_order_id_idx").on(table.orderId),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),

    productName: varchar("product_name", { length: 256 }).notNull(),

    productImage: text("product_image"),

    sku: varchar("sku", { length: 100 }),

    quantity: integer("quantity").notNull(),

    unitPrice: numeric("unit_price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    totalPrice: numeric("total_price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
  ],
);

export const paymentDetails = pgTable(
  "payment_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    paymentMethod: paymentMethodEnum("payment_method").notNull(),

    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),

    amount: numeric("amount", {
      precision: 10,
      scale: 2,
    }).notNull(),

    transactionId: varchar("transaction_id", { length: 255 }),

    paymentImage: text("payment_image"),

    nameOfSender: varchar("name_of_sender", { length: 150 }),

    paymentVerified: boolean("payment_verified").default(false).notNull(),

    verifiedBy: uuid("verified_by"),

    verifiedAt: timestamp("verified_at"),

    paymentGateway: varchar("payment_gateway", { length: 100 }),

    gatewayPaymentId: varchar("gateway_payment_id", {
      length: 255,
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("payment_details_order_id_idx").on(table.orderId),
    index("payment_details_transaction_id_idx").on(table.transactionId),
    index("payment_details_status_idx").on(table.paymentStatus),
  ],
);

export const shippingDetails = pgTable(
  "shipping_details",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    shippingProvider: varchar("shipping_provider", { length: 150 }),
    // This is courier_company_id
    shippingPlatformId: varchar("shipping_platform_id", { length: 255 }),
    awbCode: varchar("awb_code", { length: 100 }),
    shiprocketOrderId: varchar("shiprocket_order_id", { length: 100 }),
    shipmentId: varchar("shipment_id", { length: 100 }),

    shippingMethod: varchar("shipping_method", { length: 100 }),

    trackingNumber: varchar("tracking_number", { length: 255 }),

    trackingUrl: text("tracking_url"),

    shippingCost: numeric("shipping_cost", {
      precision: 10,
      scale: 2,
    }),

    shipmentStatus: shipmentStatusEnum("shipment_status")
      .default("pending")
      .notNull(),

    expectedDelivery: date("expected_delivery"),

    shippedAt: timestamp("shipped_at"),

    deliveredAt: timestamp("delivered_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("shipping_details_order_id_idx").on(table.orderId),
    index("shipping_details_tracking_number_idx").on(table.trackingNumber),
    index("shipping_details_status_idx").on(table.shipmentStatus),
  ],
);

