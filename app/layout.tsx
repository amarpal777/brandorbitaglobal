import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { icons: { icon: '/brandorbita.png' }, title: 'Brand Orbita Global — Your Brand. In Orbit.', description: 'Strategy, design and technology. Brand Orbita Global builds ambitious brands through digital marketing, websites, paid media, apps and creative.', openGraph: { title: 'Brand Orbita Global — Your Brand. In Orbit.', description: 'A new trajectory for your brand. Digital strategy, standout design and purposeful technology.', type: 'website' }, robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
