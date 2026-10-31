/* eslint-disable @next/next/no-css-tags -- The embedded vanilla SPA shares this public stylesheet across routes. */
import type {Metadata} from 'next';
export const metadata:Metadata={title:'PDUK-Radar | Employer Risk Intelligence',description:'Analisis risiko pemberi kerja dan verifikasi terarah.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><head><link rel="icon" href="data:,"/><link rel="preload" href="/ui/assets/fonts/inter-latin-variable.woff" as="font" type="font/woff" crossOrigin="anonymous"/><link rel="stylesheet" href="/ui/src/styles/app.css"/><link rel="stylesheet" href="/ui/src/styles/themes.css"/></head><body className="auth-view">{children}</body></html>;}
