import Script from 'next/script'

const GTM_ID = /^GTM-[A-Z0-9]{4,12}$/

export function GoogleTagManagerScript({ gtmId }: { gtmId?: string | null }) {
  const id = gtmId?.trim()
  if (!id || !GTM_ID.test(id)) return null
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
    </Script>
  )
}

export function GoogleTagManagerNoScript({ gtmId }: { gtmId?: string | null }) {
  const id = gtmId?.trim()
  if (!id || !GTM_ID.test(id)) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
