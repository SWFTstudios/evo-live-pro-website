# Evo Live Pro Website

The website for **Evo Live Pro**, a DJ, sound, lighting and LED video company in Lyndhurst, NJ. Designed and built by [SWFT Studios](https://swftstudios.com).

This guide explains how everything works in plain words. You do not need to be a programmer to understand the first half.

**Jump to:**
[The big idea](#the-big-idea) ·
[For Tim and Dom: using the dashboard](#for-tim-and-dom-using-the-dashboard) ·
[For developers: running it](#for-developers-running-it-on-your-computer) ·
[Putting it on the internet](#putting-it-on-the-internet-first-deploy) ·
[Changing what the dashboard can edit](#changing-what-the-dashboard-can-edit) ·
[Troubleshooting](#troubleshooting) ·
[Word list](#word-list)

---

## The big idea

Think of a restaurant.

- The **dining room** is what guests see: the tables, the lights, the menu. That is the **website**.
- The **kitchen** is where the staff works. Guests never see it. That is the **dashboard**.
- The **pantry and the fridge** are where the food and ingredients are stored. That is the **database** and the **photo storage**.

When Tim changes a price in the kitchen, the dining-room menu changes right away. Nobody has to write code.

```
   A visitor's phone or laptop
              │
              ▼
   ┌─────────────────────────┐        ┌──────────────────────────┐
   │  THE WEBSITE            │        │  THE DASHBOARD  (/admin) │
   │  Home, Rentals, Events, │        │  Tim and Dom log in here │
   │  Photos, About, Contact │        │  to change anything      │
   └───────────┬─────────────┘        └────────────┬─────────────┘
               │      both are one app (Payload)   │
               └────────────────┬──────────────────┘
                                ▼
              ┌──────────────────────────────────┐
              │  Cloudflare                      │
              │  • D1  = the filing cabinet      │
              │         (text, prices, items)    │
              │  • R2  = the photo box           │
              │         (images and videos)      │
              └──────────────────────────────────┘
```

Everything runs on **Cloudflare**, which is the company that keeps websites online. One login, one bill, one place to look.

### The tools, in kid-friendly terms

| Tool | What it is | The restaurant version |
| --- | --- | --- |
| **Payload CMS** | The dashboard where you edit the site. "CMS" means *content management system*, a fancy name for "the place where you edit your website's stuff." It is free and open source. | The kitchen |
| **Next.js** | The tool that builds the pages visitors see. | The dining room |
| **Cloudflare Workers** | The computers that run the website, spread all over the world so it loads fast. | The building |
| **D1** | A small database. It remembers every item, price and sentence. | The filing cabinet |
| **R2** | A storage box for pictures and videos. | The photo box |
| **GitHub** | Where the code is saved, with a history of every change. | The recipe book |

---

## For Tim and Dom: using the dashboard

You edit the website at **`your-website-address/admin`**. For example, if the site lives at `example.com`, you go to `example.com/admin`. Log in with your email and password.

**The rule of the dashboard:** change something, press **Save**, and refresh the website. That's it.

### Where do I go to change...?

| I want to... | Go to this section | What to do |
| --- | --- | --- |
| Change a rental price | **Rentals → Equipment (Inventory)** | Click the item. Change **Price shown on the website**. Save. |
| Add a new piece of gear | **Rentals → Equipment (Inventory)** | Click **Create New**. Fill in the name, pick a category, type a price. Save. |
| Hide gear we can't rent right now | **Rentals → Equipment (Inventory)** | Open the item and uncheck **Available**. Save. It disappears from the site but is not deleted. Check it again to bring it back. |
| Add a picture to a piece of gear | **Rentals → Equipment (Inventory)** | Open the item. Use **Image**. Pick **Choose from existing** or **Create New** to upload. |
| Add or rename a category (like "Lighting") | **Rentals → Equipment Categories** | Add or edit it. The **Sort order** number controls the order. |
| Change the room-size packages | **Rentals → Sound + DJ Packages** | Edit the name, guest count, price or what's included. |
| Change a wedding package | **Events & Pricing → Wedding Packages** | Edit it. Each bullet under "What is included" is its own line. |
| Change an add-on price | **Events & Pricing → À la carte Pricing** | Edit the price or add a new row. |
| Add photos or videos to the gallery | **Library → Photos & Videos** | Click **Create New**, upload the file, pick a category. Tick **Show in "Recent setups"** to put it on the home page. |
| Change words on a page | **Pages & Content → Home Page / About Page / Events Page / Contact Page** | Click the page, change the text, Save. |
| Change the phone number, email or menu | **Pages & Content → Site Settings** | Edit the tabs, Save. It changes on every page. |
| Add a brand to "Brands we've produced for" | **Pages & Content → Brands We Produced For** | Create New. A logo is optional. |
| Add a team member | **Pages & Content → Team** | Create New. Add a photo if you have one. |
| Read messages from customers | **Inbox → Inquiries (Form Submissions)** | Every Contact form and rental quote lands here. Change **Status** to keep track (New, In progress, Quoted, Booked, Closed). |
| Add someone who can log in | **Accounts → Users** (admins only) | Create New. Choose **Editor** for normal editing or **Admin** for full control. |

### Tips that save you from headaches

- **Sort order:** every list has a "Sort order" number. Smaller numbers show first. Use 10, 20, 30 so you can squeeze something new between them (like 15).
- **Price boxes are just text.** Type the price exactly how customers should see it: `From $1,200`, `(2) $600`, or `Price on quote`.
- **Pictures:** every photo needs a short description in the **Alt** box (for example, "DJ booth with two CDJ-3000 players"). It helps blind visitors and Google.
- **Best image for gear:** a transparent PNG on a plain background.
- **Videos:** MP4 files work best. Keep them short. For longer videos, paste an Instagram or YouTube link into **Video link** instead.
- **The red `*`** means a box can't be empty.
- **Deleting is permanent.** If you just want something gone for now, hide it (uncheck **Available**) instead of deleting it.
- Pages show **placeholder boxes** (grey stripes with a label) wherever a photo has not been uploaded yet. Upload one and the box turns into a picture.

---

## For developers: running it on your computer

### What you need first

1. **Node.js** version `22.23.4` or newer (or `24.22.1` or newer). Payload asks for these. In testing, an older 24.x printed a warning but still worked.
2. **pnpm** (the package manager). The easy way: `corepack enable`. If that is blocked on your computer, run `npm install -g pnpm`.
3. **Git**.

### Setup

```bash
git clone https://github.com/SWFTstudios/evo-live-pro-website.git
cd evo-live-pro-website

pnpm install
cp .env.example .env
```

Open `.env` and fill in the secret. Make one with:

```bash
openssl rand -hex 32
```

Paste the result after `PAYLOAD_SECRET=`. This is the password Payload uses to lock its login cookies. **Never share it or commit it.** (`.env` is already ignored by git.)

Then load the starter content and start the site:

```bash
pnpm seed      # fills the local database with Tim's inventory, pricing and page text
pnpm dev       # starts the website at http://localhost:3000
```

Open **http://localhost:3000/admin**. The very first account you create becomes an **Admin** automatically.

You do not need a Cloudflare account to work locally. Wrangler (Cloudflare's tool) pretends to be D1 and R2 on your computer. Your local data lives in the `.wrangler/` folder, which git ignores. To start over from scratch, stop the server, delete `.wrangler/state`, and run `pnpm seed` again.

### Commands you will use

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs the site and dashboard locally |
| `pnpm seed` | Loads starter content. Skips if content already exists. |
| `SEED_RESET=true pnpm seed` | Wipes the seeded content and loads it again |
| `pnpm generate:types` | Rewrites the TypeScript types after you change the data model |
| `pnpm payload migrate:create <name>` | Saves your data-model changes as a migration file |
| `pnpm exec tsc --noEmit` | Checks the code for type mistakes. Use this as the main safety check. |
| `pnpm lint` | Meant to check code style, but currently crashes inside the template's ESLint setup ("circular structure"). Not yet fixed. |
| `pnpm test` | Runs the tests (needs a browser installed for the end-to-end ones) |
| `pnpm run deploy` | Runs migrations, builds and publishes to Cloudflare |

### What is in the folders

```
evo-live-pro-website/
├── src/
│   ├── payload.config.ts     The control center. Lists every collection and global.
│   ├── collections/          Lists of things: Equipment, Packages, Photos, Team, Inquiries...
│   ├── globals/              Single-page settings: Home Page, About Page, Site Settings...
│   ├── access/               Who is allowed to do what (login rules)
│   ├── fields/               Small reusable pieces (the "sort order" box, price box)
│   ├── lib/                  Helpers (fetching data, the quote cart, URL slugs)
│   ├── components/           Pieces of the website (header, footer, rentals browser, form...)
│   ├── app/(frontend)/       The public website pages and their styles
│   ├── app/(payload)/        The dashboard (created by Payload, rarely edited)
│   ├── migrations/           Saved database changes, applied in order
│   └── payload-types.ts      Auto-written. Do not edit by hand.
├── scripts/seed.ts           The starter content (all of Tim's inventory and prices)
├── public/
│   ├── brand/                The logo files the site uses by default
│   └── preview/              The original clickable wireframe shown to Tim. Kept for reference.
├── tests/                    Automated tests
├── wrangler.jsonc            Tells Cloudflare which database and photo box to use
├── open-next.config.ts       Settings for running Next.js on Cloudflare
└── .env                      Your secret (never committed)
```

### Collections and globals, explained

Payload stores things in two shapes.

- A **collection** is a *list* of similar things, like all your equipment or all your photos. You can have 5 or 500 of them.
- A **global** is a *single page of settings*, like the Home Page text. There is only ever one.

| Name in the dashboard | Type | What it holds |
| --- | --- | --- |
| Inquiries | Collection | Contact form and rental quote submissions |
| Equipment Categories | Collection | Groups like Lighting, DJ Equipment |
| Equipment (Inventory) | Collection | Each rentable item: name, category, price text, image, available |
| Sound + DJ Packages | Collection | Room-sized packages on the Rentals page |
| Wedding Packages | Collection | The four wedding tiers |
| À la carte Pricing | Collection | Add-on prices |
| Event Services | Collection | Cards on the Events page |
| Team | Collection | People on the About page |
| Brands We Produced For | Collection | Brand names or logos on the home page |
| Venues We Know | Collection | Venues on the Events page |
| Photos & Videos | Collection | The gallery |
| Media | Collection | Every uploaded file (stored in R2) |
| Users | Collection | People who can log in |
| Home, About, Events, Contact Page | Global | The words and settings for each page |
| Site Settings | Global | Phone, email, menu, footer, logo, Google description |

### How a change travels

1. Tim edits a price in the dashboard and presses **Save**.
2. Payload writes it into **D1**.
3. A visitor opens the Rentals page. The page asks D1 for the newest data and builds the page.
4. The visitor sees the new price.

Pages are built fresh for every visitor (`force-dynamic`), so edits show up instantly. The cost is a tiny delay per page view. If traffic grows, this is the place to add caching.

### The rental quote cart

On the Rentals page, a visitor taps **+ Quote** on gear. The list is saved in their own browser (`localStorage`, key `evo-quote`). When they press **Send quote request** it follows them to the Contact form, which sends the list along with their dates and contact info. It arrives in **Inbox → Inquiries**.

The form has a hidden "trap" box that real people never see. If a spam bot fills it in, the submission is rejected. This is basic protection. For heavier spam, add [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/).

### Who can do what

- **Anyone** can read the website content and send a contact form.
- **Editors** can log in and change content.
- **Admins** can also add or remove users and change a user's role.
- Nobody outside the team can read the Inquiries list, because it holds customer emails and phone numbers.

The first account created on an empty database is always an Admin.

---

## Putting it on the internet (first deploy)

> **Read this before merging to `main`.** The live site today is a plain static Worker. This version is a full app that needs a database, a photo bucket and a secret before it can run. If it is deployed before those exist, the build will fail. Do the steps below first.

> **Not yet tested.** Everything in this section follows Payload's and Cloudflare's documentation. It has not been run against this project's real Cloudflare account yet. Expect to adjust.

### What it costs

Payload on Cloudflare Workers needs the **Workers Paid plan** (about $5 a month at the time of writing) because the app is bigger than the free plan's 3 MB limit. D1 and R2 have generous free allowances.

### Steps

1. **Log in to Cloudflare from your terminal**

   ```bash
   pnpm wrangler login
   ```

2. **Create the database**

   ```bash
   pnpm wrangler d1 create evo-live-pro-website
   ```

   Copy the `database_id` it prints into `wrangler.jsonc`, replacing `DATABASE_ID`.

3. **Create the photo bucket**

   ```bash
   pnpm wrangler r2 bucket create evo-live-pro-website
   ```

4. **Add the secret.** Use a *new* random value for production (not your local one):

   ```bash
   openssl rand -hex 32
   pnpm wrangler secret put PAYLOAD_SECRET
   ```

   Paste the value when asked.

5. **Make sure the migrations exist.** They are in `src/migrations/`. If you changed the data model since, create a new one (see [Changing what the dashboard can edit](#changing-what-the-dashboard-can-edit)).

6. **Deploy**

   ```bash
   pnpm run deploy
   ```

   This applies the migrations to the real database, builds the app and publishes it.

7. **Create the first account.** Open `your-site/admin`. The first person to register becomes the Admin, so do this right away yourself, then add Tim as an Editor or Admin.

8. **Load the starter content (optional).** To copy Tim's inventory and prices into the live database, run the seed against production. This needs the real database to exist and the migrations to be applied:

   ```bash
   NODE_ENV=production pnpm seed
   ```

### Auto-deploy from GitHub

If the Worker is connected to this repo in the Cloudflare dashboard (Workers Builds), change its **build command** to `pnpm run deploy`, and add `PAYLOAD_SECRET` under the Worker's variables and secrets. The build machine also needs a Cloudflare API token so it can reach D1 during the build.

### Important: `pnpm build` needs Cloudflare

A production build connects to your real Cloudflare account to learn about the database. On a laptop that is not logged in, `pnpm build` fails with "No API token found" or a remote proxy error. That is expected. For day-to-day work use `pnpm dev`, which runs fully offline.

---

## Changing what the dashboard can edit

Say Tim wants a new field, like "Weight" on equipment.

1. Open the collection file, for example `src/collections/Equipment.ts`, and add a field:

   ```ts
   { name: 'weight', type: 'text', label: 'Weight' },
   ```

2. Refresh the TypeScript types:

   ```bash
   pnpm generate:types
   ```

3. Save the change as a migration so production's database learns about it:

   ```bash
   pnpm payload migrate:create add_equipment_weight
   ```

4. Show the field on the website by editing the page that renders it (for example `src/components/RentalsBrowser.tsx`).
5. Commit the code, the new file in `src/migrations/` and `src/payload-types.ts` together. The next `pnpm run deploy` applies it.

To add a brand-new list (a "collection"), copy an existing file in `src/collections/`, change the `slug` and fields, then add it to the `collections` array in `src/payload.config.ts`. Use the `group` setting to choose where it appears in the dashboard menu.

---

## Known limits

- **No image resizing or cropping.** Cloudflare Workers can't run the `sharp` image tool. Upload images at the size you want shown.
- **GraphQL is not guaranteed on Workers.** The site uses Payload's local API and REST, which work fine.
- **Paid Workers plan** is required (3 MB size limit on the free plan).
- **No emails yet.** New inquiries wait in the dashboard. Nobody is emailed. A good next step is sending Tim an email on each new inquiry (Payload supports email adapters, and Cloudflare has an email service).
- **Spam protection is basic** (a hidden trap field). Add Turnstile if spam appears.
- **The seeded About page story is a placeholder**, and Dom's "Off the record" answers are blank. Fill them in from the dashboard.
- **The hero video, team portraits, equipment photos and event photos** are not uploaded yet. Placeholders show until they are.
- The quote cart is a *request*, not a booking. Prices marked "Price on quote" are confirmed by a person.

---

## Troubleshooting

| What you see | What it probably means | What to do |
| --- | --- | --- |
| `Unsupported engine` warning when installing | Your Node is older than Payload prefers | Update Node. It still worked in testing, so it is only a warning. |
| Dashboard says it can't find a secret | `.env` is missing or `PAYLOAD_SECRET` is empty | Create `.env` from `.env.example` and fill it in |
| The site shows no equipment | The local database is empty | Run `pnpm seed` |
| Seed says "Content already exists" | It protects you from doubling everything | Use `SEED_RESET=true pnpm seed` to wipe and reload |
| Types look wrong after editing a collection | The generated types are stale | Run `pnpm generate:types` |
| Deploy fails with a database error | The migration for your change was not created | Run `pnpm payload migrate:create <name>` and commit it |
| `pnpm build` fails with "No API token found" | Builds connect to real Cloudflare | Run `pnpm wrangler login`, or use `pnpm dev` instead |
| A form submission is rejected | The hidden trap field was filled by a bot | Normal for spam. Real people are not affected. |
| Category column shows "Loading…" in the list view | The first load in dev is still compiling | Wait a moment and refresh |

---

## Word list

- **Admin**: a person who can do everything in the dashboard, including adding users.
- **API**: a way for programs to talk to each other. Payload gives the website an API to read its data.
- **Bucket (R2)**: a folder in the cloud for files like photos and videos.
- **CMS**: content management system. A dashboard for editing a website without code.
- **Collection**: a list of similar things in Payload, like all equipment.
- **D1**: Cloudflare's small database.
- **Dashboard**: the private `/admin` area where you edit the site.
- **Deploy**: publishing your changes so the world can see them.
- **Editor**: a person who can change content but not manage users.
- **Global**: a single settings page in Payload, like the Home Page text.
- **Migration**: a saved set of instructions that updates the database's structure, so production matches your code.
- **Payload**: the open-source CMS this site uses.
- **Seed**: loading starter content into an empty database.
- **Slug**: a short, web-friendly name, like `sound-systems`.
- **Wrangler**: Cloudflare's command-line tool.
- **Worker**: a small program that runs on Cloudflare's network.

---

## Contributing

This repository is maintained by SWFT Studios. Issues and suggestions are welcome.

## License

All rights reserved by Evo Live Pro and SWFT Studios unless a license file says otherwise. Payload CMS, Next.js and the other open-source tools used here keep their own licenses.
