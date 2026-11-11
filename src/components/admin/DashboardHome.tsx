import React from 'react'
import type { Payload } from 'payload'

type Props = {
  payload: Payload
  user?: { name?: string | null; email?: string | null } | null
}

const icons = {
  inbox: 'M3 13l2.5-7h13L21 13M3 13v5a1 1 0 001 1h16a1 1 0 001-1v-5M3 13h5l1.5 2.5h5L16 13h5',
  tag: 'M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9zm5-4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  plus: 'M12 5v14M5 12h14',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9.5a1 1 0 100-2 1 1 0 000 2z',
  page: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
  gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  box: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',
}

function Icon({ d }: { d: string }) {
  return (
    <svg className="wf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const actions = [
  { href: '/admin/collections/equipment', icon: icons.tag, title: 'Rental inventory & prices', note: 'Change prices, add photos, hide gear' },
  { href: '/admin/collections/equipment/create', icon: icons.plus, title: 'Add a piece of gear', note: 'Create a new rental item' },
  { href: '/admin/collections/gallery/create', icon: icons.image, title: 'Upload photos or video', note: 'Add to the Photos page and home page' },
  { href: '/admin/collections/rental-packages', icon: icons.box, title: 'Packages', note: 'Sound + DJ room packages' },
  { href: '/admin/globals/home-page', icon: icons.page, title: 'Home page text', note: 'Headline, hero video, highlights' },
  { href: '/admin/globals/site-settings', icon: icons.gear, title: 'Phone, email & menu', note: 'Shown on every page' },
]

export async function DashboardHome({ payload, user }: Props) {
  const [newInquiries, liveGear, hiddenGear, gallery] = await Promise.all([
    payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'equipment', where: { available: { equals: true } } }),
    payload.count({ collection: 'equipment', where: { available: { equals: false } } }),
    payload.count({ collection: 'gallery' }),
  ])
  const firstName = (user?.name || '').trim().split(/\s+/)[0]
  const hasNew = newInquiries.totalDocs > 0

  const stats = [
    {
      label: 'New inquiries',
      value: newInquiries.totalDocs,
      href: '/admin/collections/inquiries?where[status][equals]=new',
      highlight: hasNew,
    },
    { label: 'Gear on the site', value: liveGear.totalDocs, href: '/admin/collections/equipment' },
    {
      label: 'Hidden gear',
      value: hiddenGear.totalDocs,
      href: '/admin/collections/equipment?where[available][equals]=false',
    },
    { label: 'Photos & videos', value: gallery.totalDocs, href: '/admin/collections/gallery' },
  ]

  return (
    <section className="wf-home">
      <header className="wf-home__head">
        <div>
          <p className="wf-eyebrow">Evo Live Pro · Site CMS</p>
          <h1 className="wf-home__title">{firstName ? `Welcome back, ${firstName}` : 'Welcome back'}</h1>
          <p className="wf-home__sub">
            {hasNew
              ? `You have ${newInquiries.totalDocs} new ${newInquiries.totalDocs === 1 ? 'inquiry' : 'inquiries'} waiting.`
              : 'Everything you change here shows on the website as soon as you save.'}
          </p>
        </div>
        <a className="wf-btn wf-btn--primary" href="/admin/collections/inquiries">
          <Icon d={icons.inbox} />
          Open inbox
        </a>
      </header>

      <div className="wf-stats">
        {stats.map((stat) => (
          <a key={stat.label} href={stat.href} className={`wf-stat${stat.highlight ? ' wf-stat--highlight' : ''}`}>
            <span className="wf-stat__value">{stat.value}</span>
            <span className="wf-stat__label">{stat.label}</span>
          </a>
        ))}
      </div>

      <h2 className="wf-section-label">Quick actions</h2>
      <div className="wf-actions">
        {actions.map((action) => (
          <a key={action.href} href={action.href} className="wf-action">
            <span className="wf-action__icon">
              <Icon d={action.icon} />
            </span>
            <span className="wf-action__text">
              <span className="wf-action__title">{action.title}</span>
              <span className="wf-action__note">{action.note}</span>
            </span>
            <span className="wf-action__chevron" aria-hidden="true">
              ›
            </span>
          </a>
        ))}
      </div>

      <h2 className="wf-section-label">All collections</h2>
    </section>
  )
}
