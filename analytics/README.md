# Analytics: Google Tag Manager + GA4

This is how the website reports what visitors do, so you can see what's working and double down on it (SWFT Method, Step 3: Flow & Build).

## The big idea

- The **website** shouts out small messages called **events** whenever someone does something important, like "clicked Book Evo in the hero" or "added the RCF EVOX 12 to their quote".
- **Google Tag Manager (GTM)** is the post office. It listens for those messages and forwards them.
- **Google Analytics 4 (GA4)** is the scoreboard. It counts the events, sessions and visitors, and shows you reports.

The website code already sends every event. You only need to connect GTM and GA4 once.

**No personal details are ever sent.** Names, emails and phone numbers stay in the dashboard's Inbox. Analytics only gets the shape of a request, like "booking, wedding, $5,500 – $8,500".

## One-time setup (about 15 minutes)

1. **Create GA4.** At [analytics.google.com](https://analytics.google.com), create a property for Evo Live Pro, then add a **Web** data stream for the site's address. Copy the **Measurement ID** (looks like `G-ABC123XYZ`).
2. **Create GTM.** At [tagmanager.google.com](https://tagmanager.google.com), create a container (type **Web**). Copy the **container ID** (looks like `GTM-ABC1234`).
3. **Import the ready-made setup.** In GTM go to **Admin → Import Container**, choose `analytics/gtm-container-import.json`, pick the default workspace, and choose **Merge → Rename conflicting**.
4. **Paste the Measurement ID.** In GTM open **Variables → GA4 Measurement ID** and replace `G-XXXXXXXXXX` with your real one.
5. **Turn it on in the website.** In the website dashboard open **Pages & Content → Site Settings → Tracking**, paste the `GTM-…` ID and press **Save**. (Only Admins can change this field.)
6. **Test it.** In GTM click **Preview**, enter the website address, and click a few buttons. You should see the events below appear in the Tag Assistant window, and the "GA4 Event - Evo site events" tag fire for each.
7. **Publish** the GTM container (top right, **Submit → Publish**).
8. **In GA4**, open **Admin → Events** after a day of traffic and mark these as **key events** (conversions): `generate_lead`, `begin_quote_request`, `contact_click`.
9. **In GA4**, open **Admin → Custom definitions** and add event-scoped custom dimensions for the details you want in reports. Good first picks: `cta_id`, `location`, `item_name`, `item_category`, `lead_type`, `event_type`, `method`.

> The import file was written to the standard GTM format but has not been imported into a real container yet. If GTM rejects it, the manual version is: a **Google tag** with your Measurement ID on **Initialization – All Pages**, plus one **GA4 Event** tag with event name `{{Event}}`, fired by a **Custom Event** trigger whose event name matches the regex in the import file, with the parameters listed below as Data Layer Variables.

## Event dictionary

Every event also includes `page_path` (which page it happened on).

| Event | When it fires | Details sent |
| --- | --- | --- |
| `cta_click` | Any main button: Book Evo, Rent gear, Quote, packages, "see all" links, Instagram after a lead | `cta_id` (which button, e.g. `hero_book`, `sticky_rent`), `location` (hero, header, sticky_bar, closing…), `cta_text` |
| `add_to_quote` | "+ Quote" on a rental item or package | `item_name`, `item_type` (equipment/package), `item_category`, `price_label`, `quote_size` |
| `remove_from_quote` | Removing something from the quote | same as above |
| `begin_quote_request` | "Send quote request" on the Rentals page | `item_count`, `location` |
| `filter_category` | Picking a rental category | `category` |
| `search` | Typing in rental search (sent once they stop typing) | `search_term`, `results` |
| `form_start` | First time someone types in the contact form | `form_type` (booking/rental) |
| `select_inquiry_type` | Switching between Book Evo and Rent equipment on the form | `form_type` |
| `generate_lead` | **A booking or rental request was sent successfully** | `lead_type`, `event_type`, `budget`, `fulfillment`, `item_count`, `has_date` |
| `form_error` | The form failed to send | `form_type`, `reason` |
| `contact_click` | Tapping the phone number, email or Instagram link | `method` (phone/email/instagram), `location` |
| `faq_open` | Opening a question in "Good to know" | `question` |
| `gallery_filter` | Picking a tab on the Photos page | `category` |
| `gallery_open` | Opening a photo or video | `item_title`, `category`, `is_video` |

Sessions, page views, scroll depth and outbound clicks come from GA4's **Enhanced measurement** (on by default in the data stream).

## What to look at on "CEO Day"

Once a month (SWFT Method, Step 4):

- **Leads:** how many `generate_lead` events, split by `lead_type`.
- **Where leads start:** `cta_click` by `cta_id`. Which buttons actually get pressed?
- **Rental demand:** `add_to_quote` by `item_name` and `item_category`. What do people want most?
- **Drop-off:** `begin_quote_request` vs. `generate_lead`. If many start but few finish, the form needs work.
- **Searches with 0 results:** `search` where `results` = 0 shows gear people want that the site doesn't list.

## For developers

- Send events with `track('event_name', { ... })` from `src/lib/analytics.ts`, or add `data-track="event_name"` plus `data-track-*` attributes to any link or button (`data-track-cta-id="hero_book"` becomes `cta_id: "hero_book"`). The listener is `src/components/TrackClicks.tsx`.
- GTM only loads when a valid ID is saved in Site Settings (`src/components/GoogleTagManager.tsx`). The dashboard (`/admin`) never loads it.
- If you add a new event name, add it to the trigger regex in GTM (or re-import an updated container file) and to the table above.
- GA4 allows at most 25 parameters per event. The import file sends 24.
