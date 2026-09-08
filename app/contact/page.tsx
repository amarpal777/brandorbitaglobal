import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us — Brand Orbita Global',
  description: 'Start your next project with Brand Orbita Global. Email info@brandorbitaglobal.com or call +91 9914848200.',
  openGraph: { title: 'Contact Us — Brand Orbita Global', description: 'Tell us where you want to go. Let’s build the way there, together.' },
};

export default function ContactPage() {
  return <>
    <a href="#contact-main" className="skip-link">Skip to content</a>
    <header className="header contact-page-header">
      <Link href="/" className="brand" aria-label="Brand Orbita Global home"><Image src="/brandorbita.png" alt="Brand Orbita" width={1536} height={1024} priority/><span>GLOBAL</span></Link>
      <nav aria-label="Main navigation" className="contact-page-nav"><Link href="/">Home</Link><Link href="/#services">Services</Link><Link href="/contact" aria-current="page">Contact us <ArrowUpRight size={16}/></Link></nav>
    </header>
    <main id="contact-main" className="contact-page">
      <div className="contact-page-intro">
        <Link href="/" className="text-link muted"><ArrowLeft size={16}/> Back to our orbit</Link>
        <div className="eyebrow gold"><span className="status-dot"/> CONTACT US / YOUR NEXT CHAPTER</div>
        <h1>Great things<br/>start with<br/><em className="serif gold">a conversation.</em></h1>
        <p>Have a bold idea, a business to grow, or a digital experience to build? Tell us what you have in mind.</p>
      </div>
      <div className="contact-methods">
        <a className="contact-method" href="mailto:info@brandorbitaglobal.com"><span className="contact-method-icon"><Mail size={25}/></span><span className="eyebrow muted">01 / WRITE TO US</span><h2>Let’s hear your idea.</h2><span className="contact-detail">info@brandorbitaglobal.com <ArrowUpRight size={20}/></span><p>Share your project, goals and what you’d like to create.</p></a>
        <a className="contact-method" href="tel:+919914848200"><span className="contact-method-icon"><Phone size={25}/></span><span className="eyebrow muted">02 / GIVE US A CALL</span><h2>A direct connection.</h2><span className="contact-detail">+91 9914848200 <ArrowUpRight size={20}/></span><p>Let’s talk through your next move.</p></a>
        <p className="contact-page-note">Strategy. Design. Technology. One team around your brand.</p>
      </div>
    </main>
    <footer className="footer contact-page-footer"><div className="footer-bottom"><span>© {new Date().getFullYear()} Brand Orbita Global. All rights reserved.</span><a className="text-link gold" href="https://www.instagram.com/brandorbita.global/" target="_blank" rel="noopener noreferrer">Let’s talk on Instagram <ArrowUpRight size={16}/></a></div></footer>
  </>;
}
