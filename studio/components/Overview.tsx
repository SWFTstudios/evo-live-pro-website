import {useEffect, useState} from 'react'
import {useClient, useCurrentUser, useWorkspace} from 'sanity'
import {Box, Button, Card, Flex, Grid, Heading, Stack, Text} from '@sanity/ui'
import {SITE_URL, TEST_SITE_URL} from '../lib/site'

// The Studio's home screen: what needs attention, and shortcuts to the things Tim edits most.
// Ported from the old Payload dashboard (src/components/admin/DashboardHome.tsx).

type Counts = {newInquiries: number; liveGear: number; hiddenGear: number; gallery: number; drafts: number}

const COUNTS_QUERY = `{
  "newInquiries": count(*[_type == "inquiry" && status == "new" && !(_id in path("drafts.**"))]),
  "liveGear": count(*[_type == "equipment" && available != false && !(_id in path("drafts.**"))]),
  "hiddenGear": count(*[_type == "equipment" && available == false && !(_id in path("drafts.**"))]),
  "gallery": count(*[_type == "galleryItem" && !(_id in path("drafts.**"))]),
  "drafts": count(*[_id in path("drafts.**")])
}`

// Studio paths inside the current workspace (the structure IDs come from studio/structure/index.ts).
const actions = [
  {href: '/presentation', title: 'Edit the website visually', note: 'See the site, click any text to change it'},
  {href: '/structure/rentals;equipment;all', title: 'Rental inventory & prices', note: 'Change prices, add photos, hide gear'},
  {href: '/intent/create/type=equipment/', title: 'Add a piece of gear', note: 'Create a new rental item'},
  {href: '/intent/create/type=galleryItem/', title: 'Upload photos or video', note: 'Add to the Photos page and home page'},
  {href: '/intent/edit/id=homePage;type=homePage/', title: 'Home page text', note: 'Headline, hero video, highlights'},
  {href: '/intent/edit/id=siteSettings;type=siteSettings/', title: 'Phone, email & menu', note: 'Shown on every page'},
]

export function Overview() {
  const client = useClient({apiVersion: '2026-11-01'})
  const user = useCurrentUser()
  const [counts, setCounts] = useState<Counts | null>(null)
  const {basePath, dataset} = useWorkspace()
  const at = (path: string) => `${basePath.replace(/\/$/, '')}${path}`

  useEffect(() => {
    let active = true
    client
      .fetch<Counts>(COUNTS_QUERY)
      .then((result) => active && setCounts(result))
      .catch(() => active && setCounts(null))
    return () => {
      active = false
    }
  }, [client])

  const firstName = (user?.name || '').trim().split(/\s+/)[0]
  const stats = counts
    ? [
        {label: 'New inquiries', value: counts.newInquiries, href: '/structure/inbox;new', tone: counts.newInquiries > 0 ? 'caution' : 'default'},
        {label: 'Gear on the site', value: counts.liveGear, href: '/structure/rentals;equipment;all', tone: 'default'},
        {label: 'Hidden gear', value: counts.hiddenGear, href: '/structure/rentals;equipment;hidden', tone: 'default'},
        {label: 'Unpublished changes', value: counts.drafts, href: '/presentation', tone: counts.drafts > 0 ? 'caution' : 'default'},
      ]
    : []

  return (
    <Box padding={[4, 5]} style={{maxWidth: 960}}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Text size={1} muted>
            Evo Live Pro · Website CMS · built by SWFT Studios
            {dataset !== 'production' ? ' · TEST CONTENT (not the live site)' : ''}
          </Text>
          <Heading size={4}>{firstName ? `Welcome back, ${firstName}` : 'Welcome back'}</Heading>
          <Text muted>
            Change anything, then press <strong>Publish</strong>. Changes are saved as a draft until you publish
            them, and only published changes show on the website.
          </Text>
          <Flex gap={2} wrap="wrap">
            <Button as="a" href={at('/structure/inbox')} text="Open inbox" tone="primary" />
            <Button as="a" href={dataset === 'production' ? SITE_URL : TEST_SITE_URL} target="_blank" rel="noopener noreferrer" text={dataset === 'production' ? 'View live site ↗' : 'View test site ↗'} mode="ghost" />
          </Flex>
        </Stack>

        {stats.length > 0 && (
          <Grid gridTemplateColumns={[2, 2, 4]} gap={3}>
            {stats.map((stat) => (
              <Card
                key={stat.label}
                as="a"
                href={at(stat.href)}
                padding={4}
                radius={2}
                border
                tone={stat.tone as 'default' | 'caution'}
                style={{textDecoration: 'none'}}
              >
                <Stack gap={3}>
                  <Heading size={3}>{stat.value}</Heading>
                  <Text size={1} muted>
                    {stat.label}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        )}

        <Stack gap={3}>
          <Text size={1} weight="semibold" muted>
            QUICK ACTIONS
          </Text>
          <Grid gridTemplateColumns={[1, 2]} gap={3}>
            {actions.map((action) => (
              <Card key={action.href} as="a" href={at(action.href)} padding={4} radius={2} border style={{textDecoration: 'none'}}>
                <Stack gap={2}>
                  <Text weight="semibold">{action.title} ›</Text>
                  <Text size={1} muted>
                    {action.note}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Box>
  )
}
