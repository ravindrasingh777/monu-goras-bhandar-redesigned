DROP INDEX "order_addresses_order_id_idx";--> statement-breakpoint
DROP INDEX "order_items_order_id_idx";--> statement-breakpoint
DROP INDEX "order_items_product_id_idx";--> statement-breakpoint
DROP INDEX "orders_status_idx";--> statement-breakpoint
DROP INDEX "orders_email_idx";--> statement-breakpoint
DROP INDEX "orders_created_at_idx";--> statement-breakpoint
DROP INDEX "orders_order_id_idx";--> statement-breakpoint
DROP INDEX "payment_details_order_id_idx";--> statement-breakpoint
DROP INDEX "payment_details_transaction_id_idx";--> statement-breakpoint
DROP INDEX "payment_details_status_idx";--> statement-breakpoint
DROP INDEX "shipping_details_order_id_idx";--> statement-breakpoint
DROP INDEX "shipping_details_tracking_number_idx";--> statement-breakpoint
DROP INDEX "shipping_details_status_idx";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "tags" SET DEFAULT '{""}';--> statement-breakpoint
CREATE INDEX "order_addresses_order_id_idx" ON "order_addresses" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "orders_order_id_idx" ON "orders" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "payment_details_order_id_idx" ON "payment_details" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "payment_details_transaction_id_idx" ON "payment_details" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "payment_details_status_idx" ON "payment_details" USING btree ("payment_status" enum_ops);--> statement-breakpoint
CREATE INDEX "shipping_details_order_id_idx" ON "shipping_details" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "shipping_details_tracking_number_idx" ON "shipping_details" USING btree ("tracking_number" text_ops);--> statement-breakpoint
CREATE INDEX "shipping_details_status_idx" ON "shipping_details" USING btree ("shipment_status" enum_ops);