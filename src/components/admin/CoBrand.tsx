/* eslint-disable @next/next/no-img-element */
import React from 'react'

const SWFT_BADGE = '/brand/swft-badge.webp'
const EVO_WORDMARK = '/brand/logo-wordmark.png'
const EVO_MARK = '/brand/logo-mark.png'

export function CoBrandLockup({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`cobrand cobrand--${size}`} role="img" aria-label="SWFT Studios × Evo Live Pro">
      <img src={SWFT_BADGE} alt="" className="cobrand__swft" />
      <span className="cobrand__x" aria-hidden="true">
        ×
      </span>
      <img src={EVO_WORDMARK} alt="" className="cobrand__evo" />
    </span>
  )
}

export function AdminLogo() {
  return (
    <div className="cobrand-login">
      <CoBrandLockup size="lg" />
      <span className="cobrand-login__caption">Website CMS</span>
    </div>
  )
}

export function AdminIcon() {
  return (
    <span className="cobrand-icon" role="img" aria-label="SWFT Studios × Evo Live Pro">
      <img src={SWFT_BADGE} alt="" className="cobrand-icon__swft" />
      <span className="cobrand__x" aria-hidden="true">
        ×
      </span>
      <img src={EVO_MARK} alt="" className="cobrand-icon__evo" />
    </span>
  )
}

export function NavBrand() {
  return (
    <div className="nav-brand">
      <CoBrandLockup size="sm" />
      <div className="nav-brand__site">
        <span className="nav-brand__dot" aria-hidden="true" />
        <span className="nav-brand__name">Evo Live Pro</span>
        <span className="nav-brand__tag">Site CMS</span>
      </div>
    </div>
  )
}

export function NavFooter() {
  return (
    <div className="nav-footer">
      <a href="/" target="_blank" rel="noopener noreferrer" className="nav-footer__link">
        View live site ↗
      </a>
      <a href="https://swftstudios.com" target="_blank" rel="noopener noreferrer" className="nav-footer__credit">
        Built by SWFT Studios
      </a>
    </div>
  )
}

export function HeaderActions() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer" className="wf-btn wf-btn--ghost">
      View site ↗
    </a>
  )
}

export function LoginNote() {
  return <p className="login-note">Sign in to edit the Evo Live Pro website.</p>
}
