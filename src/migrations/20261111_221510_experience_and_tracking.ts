import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`event_type\` text,
  	\`photo_id\` integer,
  	\`published\` integer DEFAULT true,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_photo_idx\` ON \`testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`published\` integer DEFAULT true,
  	\`sort_order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`home_page_how_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_how_steps_order_idx\` ON \`home_page_how_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_how_steps_parent_id_idx\` ON \`home_page_how_steps\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`testimonials_id\` integer REFERENCES testimonials(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`faqs_id\` integer REFERENCES faqs(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`gtm_id\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`site_url\` text DEFAULT 'https://evo-live-pro-website.elombe.workers.dev';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`how_title\` text DEFAULT 'How it works';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`testimonials_title\` text DEFAULT 'What clients say';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`faq_title\` text DEFAULT 'Good to know';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`closing_headline\` text DEFAULT 'You bring the guests. We bring the night.';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`closing_text\` text DEFAULT 'Tell us the date and the vibe. We will come back with a plan and a price.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`home_page_how_steps\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "equipment_categories_id", "equipment_id", "rental_packages_id", "wedding_packages_id", "a_la_carte_id", "event_services_id", "gallery_id", "team_id", "brands_id", "venues_id", "inquiries_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "equipment_categories_id", "equipment_id", "rental_packages_id", "wedding_packages_id", "a_la_carte_id", "event_services_id", "gallery_id", "team_id", "brands_id", "venues_id", "inquiries_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`gtm_id\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`site_url\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`how_title\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`testimonials_title\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`faq_title\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`closing_headline\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`closing_text\`;`)
}
