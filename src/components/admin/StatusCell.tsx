import React from 'react'

export function AvailableCell({ cellData }: { cellData?: unknown }) {
  const live = cellData !== false
  return (
    <span className={`wf-status ${live ? 'wf-status--live' : 'wf-status--off'}`}>
      <span className="wf-status__dot" aria-hidden="true" />
      {live ? 'Live' : 'Hidden'}
    </span>
  )
}
