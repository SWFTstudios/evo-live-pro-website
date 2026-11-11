'use client'

import { track } from '@/lib/analytics'

export function FaqList({ items }: { items: { id: number; question: string; answer: string }[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details
          key={item.id}
          className="faq__item"
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) track('faq_open', { question: item.question.slice(0, 100) })
          }}
        >
          <summary className="faq__q">
            <span>{item.question}</span>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <p className="faq__a">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
