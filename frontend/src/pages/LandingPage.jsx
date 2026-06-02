import { Link } from 'react-router-dom';
import './LandingPage.css';

const doctors = [
  { name: 'Dr. Sara Ahmed', specialty: 'Cardiologist', rating: 4.9, reviews: 128, initials: 'SA', color: '#e1f5ee', textColor: '#085041' },
  { name: 'Dr. Omar Hassan', specialty: 'Neurologist', rating: 4.8, reviews: 97, initials: 'OH', color: '#e6f1fb', textColor: '#0c447c' },
  { name: 'Dr. Nour Khalil', specialty: 'Dermatologist', rating: 4.9, reviews: 214, initials: 'NK', color: '#fbeaf0', textColor: '#72243e' },
];

const steps = [
  { icon: '🔍', title: 'Find a Doctor', desc: 'Browse specialists by specialty, availability, or name.' },
  { icon: '📅', title: 'Book a Slot', desc: 'Pick an open time slot that fits your schedule.' },
  { icon: '💳', title: 'Confirm & Pay', desc: 'Secure payment and instant appointment confirmation.' },
  { icon: '✅', title: 'Get Care', desc: 'Show up and receive the care you need.' },
];

const features = [
  { icon: '🏥', title: 'Wide Network', desc: 'Access hundreds of verified specialists across all major departments.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and never shared without consent.' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Real-time availability — book in under 60 seconds.' },
  { icon: '📱', title: 'Manage Anywhere', desc: 'View, reschedule, or cancel appointments from any device.' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'Automated notifications so you never miss an appointment.' },
  { icon: '📋', title: 'Health Records', desc: 'Keep track of your appointment history all in one place.' },
];

const testimonials = [
  { name: 'Layla M.', role: 'Patient', text: 'I booked a cardiologist in literally two minutes. The whole experience was smooth and stress-free.', initials: 'LM' },
  { name: 'Khaled R.', role: 'Patient', text: 'Finally a platform that respects my time. No phone calls, no waiting — just pick a slot and go.', initials: 'KR' },
  { name: 'Dina F.', role: 'Patient', text: 'The reminders saved me from missing my appointment. Highly recommend to anyone managing their health.', initials: 'DF' },
];

export default function LandingPage() {
  return (
    <div className="landing">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-icon">✚</span>
          MediBook
        </div>
        <ul className="navbar-links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#doctors">Doctors</a></li>
          <li><a href="#testimonials">Reviews</a></li>
        </ul>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-outline">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero section">
        <div className="hero-content">
          <span className="eyebrow">Your health, simplified</span>
          <h1 className="hero-title">
            Book a Doctor<br />
            <span className="text-teal">In Minutes.</span>
          </h1>
          <p className="hero-subtitle">
            Connect with verified specialists, choose your slot, and get the care you need — without the hassle of phone queues or paperwork.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Book an appointment →
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              I already have an account
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Doctors</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>20k+</strong><span>Patients served</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>4.9★</strong><span>Average rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card card">
            <div className="hcard-header">
              <span className="eyebrow" style={{ marginBottom: 0 }}>Next available</span>
            </div>
            <div className="hcard-doctor">
              <div className="doctor-avatar" style={{ background: '#e1f5ee', color: '#085041' }}>SA</div>
              <div>
                <p className="doctor-name">Dr. Sara Ahmed</p>
                <p className="doctor-spec">Cardiologist · ⭐ 4.9</p>
              </div>
            </div>
            <div className="hcard-slots">
              {['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'].map((t, i) => (
                <button key={i} className={`slot-btn ${i === 1 ? 'slot-active' : ''}`}>{t}</button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              Confirm booking
            </button>
          </div>
          <div className="floating-badge badge-left">
            <span>✅</span> Appointment confirmed!
          </div>
          <div className="floating-badge badge-right">
            <span>🔔</span> Reminder set for tomorrow
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="section" style={{ background: 'var(--neutral-50)' }}>
        <div className="section-header centered">
          <span className="eyebrow">Simple process</span>
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">From browsing to booking, the whole journey takes under two minutes.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="section">
        <div className="section-header">
          <span className="eyebrow">What we offer</span>
          <h2 className="section-title">Everything you need<br /><span className="text-teal">in one place.</span></h2>
          <p className="section-subtitle">Built for patients who value their time and want healthcare that works around them.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className="section" style={{ background: 'var(--neutral-50)' }}>
        <div className="section-header centered">
          <span className="eyebrow">Our specialists</span>
          <h2 className="section-title">Meet our top doctors</h2>
          <p className="section-subtitle">Highly rated specialists ready to see you.</p>
        </div>
        <div className="doctors-grid">
          {doctors.map((doc, i) => (
            <div key={i} className="doctor-card card">
              <div className="doctor-avatar lg" style={{ background: doc.color, color: doc.textColor }}>
                {doc.initials}
              </div>
              <h3 className="doctor-card-name">{doc.name}</h3>
              <p className="doctor-card-spec">{doc.specialty}</p>
              <div className="doctor-rating">
                <span className="rating-star">★ {doc.rating}</span>
                <span className="rating-count">({doc.reviews} reviews)</span>
              </div>
              <Link to="/register" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                Book now
              </Link>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/register" className="btn btn-primary btn-lg">See all doctors →</Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="section">
        <div className="section-header centered">
          <span className="eyebrow">Patient reviews</span>
          <h2 className="section-title">What patients say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card card">
              <p className="testimonial-quote">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="doctor-avatar sm" style={{ background: 'var(--teal-50)', color: 'var(--teal-800)' }}>
                  {t.initials}
                </div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner section-sm">
        <div className="cta-inner">
          <span className="eyebrow" style={{ color: 'var(--teal-100)', borderColor: 'var(--teal-600)', background: 'rgba(255,255,255,0.1)' }}>
            Start today
          </span>
          <h2 className="cta-title">Ready to take control<br />of your health?</h2>
          <p className="cta-subtitle">Join thousands of patients who trust MediBook for their healthcare needs.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-white btn-lg">Create free account</Link>
            <Link to="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer section-sm">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="navbar-logo">
              <span className="logo-icon">✚</span>
              MediBook
            </div>
            <p className="footer-tagline">Making quality healthcare accessible, one appointment at a time.</p>
          </div>
          <div className="footer-links-group">
            <h4>Platform</h4>
            <ul>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#doctors">Doctors</a></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Account</h4>
            <ul>
              <li><Link to="/register">Sign up</Link></li>
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Terms of service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MediBook. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
