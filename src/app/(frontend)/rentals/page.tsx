import type { Metadata } from 'next'
import { RentalsBrowser } from '@/components/RentalsBrowser'
import { getRentalsData } from '@/lib/content'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Rentals' }

export default async function RentalsPage() {
  const { categories, equipment, packages } = await getRentalsData()

  return <RentalsBrowser categories={categories.map((c) => c.name)} items={equipment} packages={packages} />
}
