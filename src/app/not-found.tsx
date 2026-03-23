'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname() ?? '';
  const locale = pathname.startsWith('/en') ? 'en' : 'tr';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: '#FAF7F5', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-140px',
          right: '-140px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: '#EAF6F4',
          opacity: 0.7,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-120px',
          left: '-120px',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: '#C5E8E3',
          opacity: 0.3,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center" style={{ maxWidth: '480px', animation: 'fadeIn 0.5s ease-in-out' }}>

        {/* Logo */}
        <Link
          href={`/${locale}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, textDecoration: 'none', marginBottom: '3rem' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '2.4rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#3D7D76',
            }}
          >
            Harm<span style={{ fontStyle: 'italic' }}>ó</span>ny
          </span>
          <span
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#5A9E96',
              fontWeight: 300,
              marginTop: '4px',
            }}
          >
            Shapewear for Women
          </span>
        </Link>

        {/* Large 404 */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '8rem',
              fontWeight: 300,
              lineHeight: 1,
              color: '#C5E8E3',
              userSelect: 'none',
              display: 'block',
            }}
          >
            404
          </span>
          {/* thin line over the 404 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '5rem',
              height: '1px',
              background: '#5A9E96',
              opacity: 0.35,
            }}
          />
        </div>

        {/* Turkish headline */}
        <h1
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#2D2D2D',
            margin: '0 0 0.375rem',
          }}
        >
          Aradığınız sayfa bulunamadı
        </h1>

        {/* English subline */}
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#5A9E96',
            fontWeight: 300,
            margin: '0 0 1.5rem',
          }}
        >
          Page not found
        </p>

        {/* Mint divider */}
        <div style={{ width: '3rem', height: '1px', background: '#9ECFC5', marginBottom: '1.5rem' }} />

        {/* Description */}
        <p
          style={{
            fontSize: '0.875rem',
            color: '#4A4A4A',
            lineHeight: 1.75,
            maxWidth: '22rem',
            marginBottom: '2.5rem',
          }}
        >
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%', maxWidth: '22rem' }}>
          <Link
            href="/tr"
            style={{
              display: 'block',
              padding: '0.875rem 2rem',
              background: '#3D7D76',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5A9E96')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3D7D76')}
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/en"
            style={{
              display: 'block',
              padding: '0.875rem 2rem',
              background: 'transparent',
              color: '#3D7D76',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1.5px solid #3D7D76',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#EAF6F4')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Go to Homepage
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
