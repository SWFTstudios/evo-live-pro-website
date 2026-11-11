import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`_objectkey\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`equipment_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`equipment_categories_slug_idx\` ON \`equipment_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`equipment_categories_updated_at_idx\` ON \`equipment_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`equipment_categories_created_at_idx\` ON \`equipment_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`equipment\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`subcategory\` text,
  	\`description\` text,
  	\`price_label\` text DEFAULT 'Price on quote',
  	\`image_id\` integer,
  	\`sort_order\` numeric DEFAULT 100,
  	\`available\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`equipment_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`equipment_category_idx\` ON \`equipment\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`equipment_image_idx\` ON \`equipment\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`equipment_updated_at_idx\` ON \`equipment\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`equipment_created_at_idx\` ON \`equipment\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`rental_packages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`guests_label\` text,
  	\`price_label\` text DEFAULT '$0+',
  	\`gear\` text NOT NULL,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`rental_packages_updated_at_idx\` ON \`rental_packages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rental_packages_created_at_idx\` ON \`rental_packages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`wedding_packages_includes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`wedding_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`wedding_packages_includes_order_idx\` ON \`wedding_packages_includes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`wedding_packages_includes_parent_id_idx\` ON \`wedding_packages_includes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`wedding_packages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`guests_label\` text,
  	\`price_label\` text DEFAULT '$0',
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`wedding_packages_updated_at_idx\` ON \`wedding_packages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`wedding_packages_created_at_idx\` ON \`wedding_packages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`a_la_carte\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`price_label\` text DEFAULT '$0',
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`a_la_carte_updated_at_idx\` ON \`a_la_carte\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`a_la_carte_created_at_idx\` ON \`a_la_carte\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`event_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`cta_label\` text DEFAULT 'Plan an event →',
  	\`cta_link\` text DEFAULT '/contact',
  	\`accent\` text DEFAULT 'book',
  	\`image_id\` integer,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`event_services_image_idx\` ON \`event_services\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`event_services_updated_at_idx\` ON \`event_services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`event_services_created_at_idx\` ON \`event_services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gallery\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`media_id\` integer,
  	\`video_url\` text,
  	\`is_video\` integer DEFAULT false,
  	\`large\` integer DEFAULT false,
  	\`featured_on_home\` integer DEFAULT false,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`gallery_media_idx\` ON \`gallery\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_updated_at_idx\` ON \`gallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_created_at_idx\` ON \`gallery\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`team\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`job_title\` text,
  	\`portrait_id\` integer,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`team_portrait_idx\` ON \`team\` (\`portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`team_updated_at_idx\` ON \`team\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`team_created_at_idx\` ON \`team\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`brands\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` integer,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`brands_logo_idx\` ON \`brands\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`brands_updated_at_idx\` ON \`brands\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`brands_created_at_idx\` ON \`brands\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`venues\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`venues_updated_at_idx\` ON \`venues\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`venues_created_at_idx\` ON \`venues\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text NOT NULL,
  	\`status\` text DEFAULT 'new',
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`event_type\` text,
  	\`event_date\` text,
  	\`return_date\` text,
  	\`venue\` text,
  	\`guest_count\` text,
  	\`budget\` text,
  	\`fulfillment\` text,
  	\`quote_items\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`equipment_categories_id\` integer,
  	\`equipment_id\` integer,
  	\`rental_packages_id\` integer,
  	\`wedding_packages_id\` integer,
  	\`a_la_carte_id\` integer,
  	\`event_services_id\` integer,
  	\`gallery_id\` integer,
  	\`team_id\` integer,
  	\`brands_id\` integer,
  	\`venues_id\` integer,
  	\`inquiries_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`equipment_categories_id\`) REFERENCES \`equipment_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`equipment_id\`) REFERENCES \`equipment\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`rental_packages_id\`) REFERENCES \`rental_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`wedding_packages_id\`) REFERENCES \`wedding_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`a_la_carte_id\`) REFERENCES \`a_la_carte\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`event_services_id\`) REFERENCES \`event_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gallery_id\`) REFERENCES \`gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`brands_id\`) REFERENCES \`brands\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`venues_id\`) REFERENCES \`venues\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_equipment_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`equipment_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_equipment_id_idx\` ON \`payload_locked_documents_rels\` (\`equipment_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rental_packages_id_idx\` ON \`payload_locked_documents_rels\` (\`rental_packages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_wedding_packages_id_idx\` ON \`payload_locked_documents_rels\` (\`wedding_packages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_a_la_carte_id_idx\` ON \`payload_locked_documents_rels\` (\`a_la_carte_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_event_services_id_idx\` ON \`payload_locked_documents_rels\` (\`event_services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gallery_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_id_idx\` ON \`payload_locked_documents_rels\` (\`team_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_brands_id_idx\` ON \`payload_locked_documents_rels\` (\`brands_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_venues_id_idx\` ON \`payload_locked_documents_rels\` (\`venues_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_order_idx\` ON \`site_settings_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_navigation_parent_id_idx\` ON \`site_settings_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`business_name\` text DEFAULT 'Evo Live Pro' NOT NULL,
  	\`tagline\` text DEFAULT 'Audio · Lighting · Video · DJ · Lyndhurst, NJ',
  	\`phone\` text DEFAULT '(201) 913-9558',
  	\`email\` text DEFAULT 'evolivepro@gmail.com',
  	\`location\` text DEFAULT 'Lyndhurst, NJ 07071',
  	\`instagram_handle\` text DEFAULT '@evolivepro',
  	\`instagram_url\` text DEFAULT 'https://instagram.com/evolivepro',
  	\`logo_wordmark_id\` integer,
  	\`logo_mark_id\` integer,
  	\`book_button_label\` text DEFAULT 'Book Evo',
  	\`rent_button_label\` text DEFAULT 'Rent gear',
  	\`footer_note\` text DEFAULT 'Live production for nights people remember.',
  	\`copyright\` text DEFAULT 'Evo Live Pro. All rights reserved.',
  	\`seo_title\` text DEFAULT 'Evo Live Pro | DJ, Sound, Lighting & LED Video in NJ',
  	\`seo_description\` text DEFAULT 'DJ, sound, lighting and LED video for weddings, corporate events and concerts. Book our crew or rent pro audio-visual gear in Lyndhurst, NJ.',
  	\`share_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_wordmark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_mark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_wordmark_idx\` ON \`site_settings\` (\`logo_wordmark_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_mark_idx\` ON \`site_settings\` (\`logo_mark_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_share_image_idx\` ON \`site_settings\` (\`share_image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_trust_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_trust_badges_order_idx\` ON \`home_page_trust_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_badges_parent_id_idx\` ON \`home_page_trust_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_services_order_idx\` ON \`home_page_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_services_parent_id_idx\` ON \`home_page_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_services_image_idx\` ON \`home_page_services\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Audio · Lighting · Video · DJ · Lyndhurst, NJ',
  	\`headline\` text DEFAULT 'Live production for nights people remember' NOT NULL,
  	\`subheadline\` text DEFAULT 'DJ, sound, lighting and LED video for weddings, corporate events and concerts. Book our crew, or rent the same gear we use.',
  	\`hero_video_id\` integer,
  	\`hero_image_id\` integer,
  	\`book_label\` text DEFAULT 'I''m planning an event',
  	\`book_button\` text DEFAULT 'Book Evo →',
  	\`rent_label\` text DEFAULT 'I need equipment',
  	\`rent_button\` text DEFAULT 'Browse rentals →',
  	\`what_we_do_title\` text DEFAULT 'What we do',
  	\`what_we_do_intro\` text DEFAULT 'One crew from load-in to last track. We plan the setup, bring the gear and run it on the night.',
  	\`recent_setups_title\` text DEFAULT 'Recent setups',
  	\`wedding_teaser_label\` text DEFAULT 'Wedding packages',
  	\`wedding_teaser_price\` text DEFAULT 'From $5,500',
  	\`wedding_teaser_text\` text DEFAULT 'The Architectural Essentials, The Elevated Design Experience, The Nightlife Reserve and The Bespoke Production Reserve.',
  	\`wedding_teaser_button\` text DEFAULT 'Compare packages →',
  	\`sound_teaser_label\` text DEFAULT 'Sound + DJ packages',
  	\`sound_teaser_price\` text DEFAULT 'From $1,000',
  	\`sound_teaser_text\` text DEFAULT 'Sized by room, from 100 guests to 800+. RCF speakers, CDJ-3000s, mixers, mics and a stagehand.',
  	\`sound_teaser_button\` text DEFAULT 'See rental packages →',
  	\`brands_title\` text DEFAULT 'Brands we''ve produced for',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_video_idx\` ON \`home_page\` (\`hero_video_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_hero_image_idx\` ON \`home_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_off_the_record_answers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`person_id\` integer NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`person_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_off_the_record\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_off_the_record_answers_order_idx\` ON \`about_page_off_the_record_answers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_off_the_record_answers_parent_id_idx\` ON \`about_page_off_the_record_answers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_page_off_the_record_answers_person_idx\` ON \`about_page_off_the_record_answers\` (\`person_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_off_the_record\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_off_the_record_order_idx\` ON \`about_page_off_the_record\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_off_the_record_parent_id_idx\` ON \`about_page_off_the_record\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_three_words\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_three_words_order_idx\` ON \`about_page_three_words\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_three_words_parent_id_idx\` ON \`about_page_three_words\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'About us · Our origins',
  	\`headline\` text DEFAULT 'Two founders, one warehouse, a lot of gaff tape' NOT NULL,
  	\`origin_story\` text,
  	\`group_photo_id\` integer,
  	\`group_photo_caption\` text DEFAULT 'Brandon Patrisso shoot',
  	\`crew_title\` text DEFAULT 'Meet the crew',
  	\`off_the_record_title\` text DEFAULT 'Off the record',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`group_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_group_photo_idx\` ON \`about_page\` (\`group_photo_id\`);`)
  await db.run(sql`CREATE TABLE \`events_page_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`letter\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_page_capabilities_order_idx\` ON \`events_page_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_page_capabilities_parent_id_idx\` ON \`events_page_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`events_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Events · Our capabilities',
  	\`headline\` text DEFAULT 'You bring the guests. We bring the night.' NOT NULL,
  	\`intro\` text DEFAULT 'Weddings, corporate events, concerts and private parties. We design the setup, load it in and run it live.',
  	\`services_title\` text DEFAULT 'Event services',
  	\`wedding_eyebrow\` text DEFAULT '2026 wedding packages',
  	\`wedding_title\` text DEFAULT 'Pick your night',
  	\`wedding_note\` text DEFAULT 'All include a 4-hour reception, online playlist tool and planning consultations. Plus applicable tax.',
  	\`wedding_button\` text DEFAULT 'Check my date',
  	\`ala_carte_eyebrow\` text DEFAULT 'À la carte',
  	\`ala_carte_title\` text DEFAULT 'Production & gear',
  	\`ala_carte_note\` text DEFAULT 'Everything we run on our own shows. Need it without the crew? It is all on the rentals page.',
  	\`venues_title\` text DEFAULT 'Venues we know',
  	\`venues_note\` text DEFAULT 'We have loaded in here before, so we know the power, the rules and the elevators.',
  	\`closing_headline\` text DEFAULT 'Got a date? Let''s build it.',
  	\`closing_button\` text DEFAULT 'Check availability',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`contact_page_event_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_event_types_order_idx\` ON \`contact_page_event_types\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_event_types_parent_id_idx\` ON \`contact_page_event_types\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_budget_ranges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_budget_ranges_order_idx\` ON \`contact_page_budget_ranges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_budget_ranges_parent_id_idx\` ON \`contact_page_budget_ranges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_fulfillment_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_fulfillment_options_order_idx\` ON \`contact_page_fulfillment_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_fulfillment_options_parent_id_idx\` ON \`contact_page_fulfillment_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Contact us',
  	\`headline\` text DEFAULT 'Ready to elevate your next event?' NOT NULL,
  	\`intro\` text DEFAULT 'Whether you are a venue manager looking for a full production install or a fellow professional seeking a rental, we are ready to assist.',
  	\`book_title\` text DEFAULT 'Book Evo',
  	\`book_note\` text DEFAULT 'DJ, production or a full event',
  	\`rent_title\` text DEFAULT 'Rent equipment',
  	\`rent_note\` text DEFAULT 'Pickup or delivery, setup optional',
  	\`success_message\` text DEFAULT 'Thanks! We got your request and will reply within one business day.',
  	\`side_photo_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`side_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_side_photo_idx\` ON \`contact_page\` (\`side_photo_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`equipment_categories\`;`)
  await db.run(sql`DROP TABLE \`equipment\`;`)
  await db.run(sql`DROP TABLE \`rental_packages\`;`)
  await db.run(sql`DROP TABLE \`wedding_packages_includes\`;`)
  await db.run(sql`DROP TABLE \`wedding_packages\`;`)
  await db.run(sql`DROP TABLE \`a_la_carte\`;`)
  await db.run(sql`DROP TABLE \`event_services\`;`)
  await db.run(sql`DROP TABLE \`gallery\`;`)
  await db.run(sql`DROP TABLE \`team\`;`)
  await db.run(sql`DROP TABLE \`brands\`;`)
  await db.run(sql`DROP TABLE \`venues\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_settings_navigation\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_badges\`;`)
  await db.run(sql`DROP TABLE \`home_page_services\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`about_page_off_the_record_answers\`;`)
  await db.run(sql`DROP TABLE \`about_page_off_the_record\`;`)
  await db.run(sql`DROP TABLE \`about_page_three_words\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`events_page_capabilities\`;`)
  await db.run(sql`DROP TABLE \`events_page\`;`)
  await db.run(sql`DROP TABLE \`contact_page_event_types\`;`)
  await db.run(sql`DROP TABLE \`contact_page_budget_ranges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_fulfillment_options\`;`)
  await db.run(sql`DROP TABLE \`contact_page\`;`)
}
