import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Home/home.css';
import './Contact.css';
import useLocalTime from './useLocalTime';

const EMAIL = 'KARNHIEND@GMAIL.COM';

// ใส่ path รูปรวมสมาชิกทั้ง 4 รูปตรงนี้ในอนาคต เช่น "/team/group-01.webp"
// (ถ้าอยากได้ 3 รูป แค่ลบออก 1 บรรทัด เลย์เอาต์จะจัดให้โดยอัตโนมัติ)
const GROUP_PHOTOS = [
  { id: 1, alt: 'Say Hi Crew 01', src: '/Contact/All-2X8A9243.jpg' },
  { id: 2, alt: 'Say Hi Crew 02', src: '/Contact/All-2X8A9213.jpg' },
  { id: 3, alt: 'Say Hi Crew 03', src: '/Contact/All-2X8A9249.jpg' },
];

const SOCIAL_LINKS = [
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/' },
  { label: 'FACEBOOK', href: 'https://www.facebook.com/' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/sayh.i2026/' },
  { label: 'GITHUB', href: '#' },
];

const CURRENT_YEAR = new Date().getFullYear();

function ContactHeader() {
  return (
    <div className="contact-header">
      <p className="contact-tagline fade-up" style={{ animationDelay: '0s' }}>
        Have a project in mind?
      </p>
      <div className="contact-title-row fade-up" style={{ animationDelay: '0.15s' }}>
        <span className="title-line" aria-hidden="true"></span>
        <h1 className="contact-title text-gradient">SAY HI INCORPORATED</h1>
        <span className="title-line" aria-hidden="true"></span>
      </div>
    </div>
  );
}

function EmailCard() {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const temp = document.createElement('textarea');
      temp.value = EMAIL;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="email-card fade-up" style={{ animationDelay: '0.3s' }}>
      <a href={`mailto:${EMAIL}`} className="contact-email">{EMAIL}</a>
      <button
        type="button"
        className={`copy-btn${copied ? ' copied' : ''}`}
        onClick={copyEmail}
        aria-live="polite"
        aria-label={copied ? 'คัดลอกอีเมลแล้ว' : 'คัดลอกอีเมล'}
      >
        {copied ? 'COPIED ✓' : 'COPY'}
      </button>
    </div>
  );
}

function SocialGrid() {
  return (
    <nav className="social-grid fade-up" style={{ animationDelay: '0.45s' }} aria-label="Social media links">
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={`${social.label} (เปิดในแท็บใหม่)`}
        >
          {social.label} <span className="arrow" aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}

/* =========================================
   Subcomponent: LandscapePhotoCard
   รูปแนวนอนขนาดใหญ่แบบปกติ (ไม่กดเปิด Lightbox)
   + 3D Tilt & Cursor Spotlight Animation
========================================= */
function LandscapePhotoCard({ item, index, isVisible }) {
  const cardRef = useRef(null);
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = Boolean(item.src) && !imgFailed;

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3.5;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 3.5;

    el.style.setProperty('--spot-x', `${percentX}%`);
    el.style.setProperty('--spot-y', `${percentY}%`);
    el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <div
      className={`wide-photo-cell ${isVisible ? 'is-revealed' : ''}`}
      style={{ transitionDelay: `${index * 110}ms` }}
    >
      <div
        ref={cardRef}
        className={`wide-photo-card ${showImage ? 'has-image' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {showImage && (
          <img
            src={item.src}
            alt={item.alt}
            className="wide-photo-img"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        )}
        <span className="wide-photo-spotlight" aria-hidden="true"></span>
      </div>
    </div>
  );
}

/* =========================================
   Subcomponent: GroupGallerySection
   แกลเลอรีแนวนอนเกือบเต็มจอ + Scroll Reveal
========================================= */
function GroupGallerySection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const layoutClass = GROUP_PHOTOS.length === 3 ? 'layout-3' : 'layout-4';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="contact-wide-gallery"
      aria-label="Say Hi Team Gallery"
    >
      <div className={`wide-gallery-grid ${layoutClass}`}>
        {GROUP_PHOTOS.map((item, index) => (
          <LandscapePhotoCard
            key={item.id}
            item={item}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}

function LocalTime() {
  const time = useLocalTime();

  return (
    <span className="local-time" aria-label="เวลาท้องถิ่นกรุงเทพฯ">
      BANGKOK, TH — {time} ICT
    </span>
  );
}

function Contact() {
  useEffect(() => {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.toggle('dark-mode', theme === 'dark');
      if (toggleSwitch) toggleSwitch.checked = theme === 'dark';
    }

    function initTheme() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        applyTheme(saved);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
      }
    }

    function switchTheme(e) {
      const newTheme = e.target.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }

    initTheme();
    if (toggleSwitch) toggleSwitch.addEventListener('change', switchTheme);

    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const menuLinks = document.querySelector('.menu-links');

    const handleHamburger = () => {
      if (!menuLinks) return;
      const isOpen = menuLinks.style.display === 'flex';
      menuLinks.style.display = isOpen ? 'none' : 'flex';
      menuLinks.style.flexDirection = 'column';
      menuLinks.style.position = 'absolute';
      menuLinks.style.top = '70px';
      menuLinks.style.left = '0';
      menuLinks.style.width = '100%';
      menuLinks.style.background = 'rgba(255, 255, 255, 0.95)';
      menuLinks.style.padding = '1rem';
      menuLinks.style.borderRadius = '20px';
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', handleHamburger);

    return () => {
      if (toggleSwitch) toggleSwitch.removeEventListener('change', switchTheme);
      if (hamburgerBtn) hamburgerBtn.removeEventListener('click', handleHamburger);
    };
  }, []);

  const backToTop = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <>
      <nav className="main-nav">
        <div className="nav-container">
          <div className="logo"></div>
          <div className="menu-links">
            <Link to="/">Home</Link>
            <Link to="/work">Work</Link>
            <Link to="/team">Team</Link>
            <Link to="/contact" className="active">Contact</Link>
          </div>
          <div className="nav-actions">
            <button className="search-btn" aria-label="Search">🔍</button>
            <label className="theme-switch" htmlFor="checkbox" aria-label="Toggle Dark Mode">
              <input type="checkbox" id="checkbox" />
              <div className="slider round"></div>
            </label>
          </div>
          <button className="hamburger-btn" aria-label="Menu">☰</button>

          <Link to="/" className="nav-brand-logo" aria-label="Say Hi Home">
            <img src="/logoSayHi-03.png" alt="Say Hi Logo" className="logo-light" />
            <img src="/logoSayHi-01.png" alt="Say Hi Logo Dark" className="logo-dark" />
          </Link>
        </div>
      </nav>

      <main className="contact-page">
        <section className="contact-hero">
          <ContactHeader />
          <EmailCard />
          <SocialGrid />
        </section>

        <GroupGallerySection />

        <footer className="contact-footer">
          <LocalTime />
          <span className="copyright">© {CURRENT_YEAR} SAY HI INCORPORATED</span>
          <button type="button" className="back-to-top" onClick={backToTop}>
            BACK TO TOP <span aria-hidden="true">↑</span>
          </button>
        </footer>
      </main>
    </>
  );
}

export default Contact;