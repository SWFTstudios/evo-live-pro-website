import React, { cache } from 'react'
import type { Payload } from 'payload'

type CellProps = { cellData?: unknown; payload?: Payload }

const categoryNames = cache(async (payload: Payload) => {
  const { docs } = await payload.find({ collection: 'equipment-categories', limit: 200, depth: 0, pagination: false })
  return new Map(docs.map((doc) => [String(doc.id), doc.name]))
})

// Payload's built-in relationship cell showed "<No Category>" on D1, so resolve the name here.
export async function CategoryCell({ cellData, payload }: CellProps) {
  if (cellData && typeof cellData === 'object' && 'name' in cellData) {
    return <span className="wf-tag">{String((cellData as { name: unknown }).name)}</span>
  }
  if ((typeof cellData === 'number' || typeof cellData === 'string') && payload) {
    const name = (await categoryNames(payload)).get(String(cellData))
    if (name) return <span className="wf-tag">{name}</span>
  }
  return <span className="wf-tag wf-tag--muted">None</span>
}
