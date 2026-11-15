import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'

// Only links that are safe to follow. Anything else (for example javascript:) renders as plain text.
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#)/i

const components: PortableTextComponents = {
  block: {
    h3: ({ children }) => <h3>{children}</h3>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? ''
      if (!SAFE_HREF.test(href)) return <>{children}</>
      const external = /^https?:\/\//i.test(href)
      return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  },
}

export function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />
}
