import type { Metadata } from 'next'
import { RentalsBrowser } from '@/components/RentalsBrowser'
import { getClient, resolveMedia } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Rentals' }

export default async function RentalsPage() {
  const payload = await getClient()
  const [categories, equipment, packages] = await Promise.all([
    payload.find({ collection: 'equipment-categories', sort: 'sortOrder', limit: 50 }),
    payload.find({
      collection: 'equipment',
      where: { available: { equals: true } },
      sort: 'sortOrder',
      limit: 500,
      depth: 1,
    }),
    payload.find({ collection: 'rental-packages', sort: 'sortOrder', limit: 20 }),
  ])

  const items = equipment.docs.map((item) => {
    const category = typeof item.category === 'object' ? item.category : null
    return {
      id: item.id,
      name: item.name,
      category: category?.name ?? 'Other',
      subcategory: item.subcategory ?? '',
      description: item.description ?? '',
      priceLabel: item.priceLabel ?? 'Price on quote',
      imageUrl: resolveMedia(item.image)?.url ?? null,
    }
  })

  return (
    <RentalsBrowser
      categories={categories.docs.map((c) => c.name)}
      items={items}
      packages={packages.docs.map((p) => ({
        id: p.id,
        name: p.name,
        guests: p.guestsLabel ?? '',
        price: p.priceLabel ?? '',
        gear: p.gear,
      }))}
    />
  )
}
