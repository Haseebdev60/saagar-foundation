import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Heart,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import memoonaPortrait from '../assets/memoona-founder.jpg';
import DonationCard from '../components/DonationCard';
import ContactFormSection from '../components/ContactFormSection';
import EventModal from '../components/EventModal';
import { api } from '../services/api';

const defaultEvents = [
  {
    _id: '1',
    id: 1,
    title: 'Saagar Foundation Food Drive',
    category: 'Community',
    label: 'Community outreach',
    location: 'DHA Phase 8, Lahore',
    date: 'FOOD DRIVE',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85',
    description:
      'The Saagar Foundation successfully organized a food drive in DHA Phase 8, Lahore, providing meals to 100 people in need. This initiative reflects our commitment to serving humanity, spreading kindness, and ensuring that help reaches those who need it most.\n\nEvery meal served is a step toward our vision of building something meaningful that continues to grow, make a difference, and serve communities for generations to come. At Saagar Foundation, we believe that even the smallest act of kindness can create a lasting impact.',
  },
  {
    _id: '2',
    id: 2,
    title: 'Saagar Foundation Fundraiser',
    category: 'Fundraising',
    label: 'Community fundraiser',
    location: 'Bean Theory, DHA Phase 6, Lahore',
    date: 'FUNDRAISING',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    description:
      'The Saagar Foundation organized a fundraising event filled with fun activities, including FIFA and much more, to raise money for an upcoming visit to an orphanage. The event brought people together for a meaningful cause, combining entertainment, community, and the spirit of giving back.\n\nThrough this initiative, our goal was to raise funds to support children in need and make our orphanage visit a memorable and meaningful experience. At Saagar Foundation, we believe that helping others doesn’t always have to start with something big—it starts with people coming together, sharing what they can, and making a difference.',
  },
  {
    _id: '3',
    id: 3,
    title: 'Riyat × Saagar Foundation Football Fundraiser',
    category: 'Sports',
    label: 'Sport for good',
    location: 'Pine Avenue Cross Courts, Lahore',
    date: 'SPORTS FOR GOOD',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85',
    description:
      'Riyat partnered with Saagar Foundation for a football fundraiser that brought people together through sports, teamwork, and a shared purpose. The initiative aimed to raise funds for a meaningful cause while promoting sportsmanship, discipline, and community spirit.\n\nThrough the power of football, we hope to inspire young people to grow both on and off the field, showing that sport is not just about winning games, but also about respect, teamwork, and making a positive impact on the lives of others.',
  },
  {
    _id: '4',
    id: 4,
    title: 'Saagar Foundation × Falah Foundation',
    category: 'Outreach',
    label: 'Orphanage visit',
    location: '19/A, Khuda Baksh Colony, New Airport Road, Cantt, Lahore, 54000',
    date: 'ORPHANAGE VISIT',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
    description:
      'Saagar Foundation visited Falah Foundation to spend time with orphaned children and bring a little happiness into their lives. Using the funds raised through our fundraising initiatives, we provided the children with snacks and stationery items to support their everyday needs and education.\n\nThis visit was a meaningful reminder of why we do what we do. Beyond raising money, our goal is to turn every contribution into real impact, bringing smiles to children’s faces and helping them feel supported and cared for. At Saagar Foundation, we believe that every small act of kindness matters and that, together, we can build a lasting legacy of compassion, generosity, and service to humanity.',
  },
  {
    _id: '5',
    id: 5,
    title: 'Saagar Sports Fest',
    category: 'Sports',
    label: 'Two-day sports event',
    location: 'FR Cross Courts, Pine Avenue',
    date: 'SPORTS FEST',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85',
    description:
      'Saagar Sports Fest was a two-day sporting event that brought together over 800 participants across four different categories, celebrating athletic talent, teamwork, and sportsmanship. The event provided a platform for participants to showcase their skills, challenge themselves, and connect through their shared passion for sports.\n\nBeyond the competition, Saagar Sports Fest aimed to promote discipline, unity, and personal growth, creating an environment where everyone could learn, improve, and thrive. At Saagar Foundation, we believe sports have the power to bring people together, build character, and inspire positive change.',
  },
  {
    _id: '6',
    id: 6,
    title: 'Saagar Foundation × Todd’s Welfare',
    category: 'Animal Welfare',
    label: 'Animal welfare',
    location: 'Near Arif Memorial Hospital, Lahore',
    date: 'ANIMAL WELFARE',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=85',
    description:
      'Saagar Foundation visited Todd’s Welfare to spend a day with the animals, learn more about their care, and support the important work being done to protect and look after them. As part of our visit, we donated funds raised through our sports event to contribute toward their welfare and ongoing needs.\n\nThis initiative reflected our belief that giving back goes beyond helping people—it also means showing compassion toward animals who deserve care, safety, and kindness. By turning the support we received through our sporting events into meaningful contributions, we aim to make a positive difference wherever we can.',
  },
];

const categories = ['All Stories', 'Community', 'Fundraising', 'Sports', 'Outreach', 'Animal Welfare'];

export default function Home() {
  const [events, setEvents] = useState(defaultEvents);
  const [filter, setFilter] = useState('All Stories');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getEvents()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
        }
      })
      .catch(() => {
        // Fallback to default approved list
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleEvents = useMemo(() => {
    if (filter === 'All Stories') return events;
    return events.filter((e) => e.category === filter);
  }, [events, filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. Hero Section */}
      <section id="home" className="hero">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-inner">
          <motion.div
            className="eyebrow light"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="eyebrow-line"></span> PEOPLE FIRST. KINDNESS ALWAYS.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Small acts.
            <br />
            <em>Lasting change.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We believe compassion has no limits. Together, we turn simple acts of kindness into meaningful moments of
            care, support, and hope.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link className="button button-gold" to="/donate">
              Donate Now <ArrowRight size={17} />
            </Link>
            <Link className="text-link light-link" to="/events">
              Explore Our Work <ArrowDownRight size={17} />
            </Link>
          </motion.div>

          <div className="hero-note">
            <Heart size={15} /> Compassion, kindness, and service to humanity
          </div>
        </div>

        <div className="hero-index">
          <span>01</span>
          <span className="index-line"></span>
          <span>SAAGAR FOUNDATION</span>
        </div>
      </section>

      {/* 2. Purpose Intro Section */}
      <section id="purpose" className="intro section-pad">
        <div className="intro-kicker">
          <span className="eyebrow">A LITTLE GOOD GOES A LONG WAY</span>
          <span className="decor-star">✳</span>
        </div>
        <div className="intro-grid">
          <h2>
            Goodness grows
            <br />
            when we <em>share it.</em>
          </h2>
          <div className="intro-copy">
            <p>
              Saagar Foundation exists to help anyone in need, regardless of their circumstances. Through compassion,
              kindness, and service to humanity, we work to make a positive difference—one meaningful action at a time.
            </p>
            <Link className="text-link dark-link" to="/about">
              Get to know our vision <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="intro-rule">
          <span>01 / OUR PURPOSE</span>
          <span>ROOTED IN COMPASSION</span>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section id="mission" className="mission">
        <div className="mission-photo">
          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85"
            alt="Volunteers working together in community"
            loading="lazy"
          />
          <div className="photo-caption">
            <span>BETTER, TOGETHER</span>
            <span>SAAGAR FOUNDATION</span>
          </div>
        </div>

        <div className="mission-content">
          <span className="eyebrow">WHAT GUIDES US</span>
          <h2>
            A future built
            <br />
            on <em>kindness.</em>
          </h2>

          <div className="mission-block">
            <span className="block-number">01</span>
            <div>
              <h3>Our Mission</h3>
              <p>
                The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by
                providing support, resources, and assistance in whatever ways possible. Our goal is to make a positive
                difference in people’s lives through compassion, kindness, and service to humanity.
              </p>
            </div>
          </div>

          <div className="mission-block">
            <span className="block-number">02</span>
            <div>
              <h3>Our Vision</h3>
              <p>
                The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that
                continues to grow, serve, and make a difference for generations to come. Our dream is to create a
                foundation that stands the test of time, reaching as many people in need as possible and providing help
                wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on
                forever, touching countless lives and inspiring others to do the same.
              </p>
            </div>
          </div>

          <div className="mission-signoff">
            <span className="gold-dot"></span> A legacy of compassion, for generations to come.
          </div>
        </div>
      </section>

      {/* 4. Events / Stories Section */}
      <section id="work" className="events section-pad">
        <div className="events-heading">
          <div>
            <span className="eyebrow light">OUR WORK IN THE WORLD</span>
            <h2>
              Kindness, <em>in action.</em>
            </h2>
          </div>
          <p>Every gathering, visit, and shared effort is a reminder that a little help can travel a long way.</p>
        </div>

        <div className="filters" role="group" aria-label="Filter stories">
          {categories.map((c) => {
            const count = c === 'All Stories' ? events.length : events.filter((e) => e.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={filter === c ? 'filter active' : 'filter'}
              >
                {c}
                <span>{String(count).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

        <div className="event-grid">
          {visibleEvents.map((e, i) => (
            <motion.article
              className={`event-card ${i === 0 && filter === 'All Stories' ? 'event-featured' : ''}`}
              key={e._id || e.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="event-image"
                onClick={() => setSelectedEvent(e)}
                aria-label={`Read ${e.title}`}
              >
                <img src={e.image} alt={e.title} loading="lazy" />
                <span className="image-arrow">
                  <ArrowUpRight size={19} />
                </span>
                <span className="image-label">{e.date || 'STORY'}</span>
              </button>
              <div className="event-info">
                <div className="event-meta">
                  <span>{e.category}</span>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{e.title}</h3>
                <div className="event-location">
                  <MapPin size={14} />
                  <span>{e.location}</span>
                </div>
                <button className="story-link" onClick={() => setSelectedEvent(e)}>
                  Read the story <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="events-bottom">
          <span>SMALL ACTIONS. MEANINGFUL IMPACT.</span>
          <Link to="/events" style={{ color: '#efc75e', textDecoration: 'underline' }}>
            View all stories & archives <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>

        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      </section>

      {/* 5. Founder Spotlight */}
      <section id="founder" className="founder-section">
        <div className="founder-visual">
          <div className="founder-frame">
            <img className="founder-portrait-image" src={memoonaPortrait} alt="Memoona, founder of Saagar Foundation" />
            <span className="founder-frame-label">
              SAAGAR FOUNDATION <span>✳</span>
            </span>
          </div>
        </div>

        <div className="founder-content">
          <span className="eyebrow">
            <span className="eyebrow-line"></span> THE PERSON BEHIND THE PURPOSE
          </span>
          <p className="founder-overline">FOUNDER, SAAGAR FOUNDATION</p>
          <h2>
            Meet <em>Memoona.</em>
          </h2>
          <p className="founder-intro">
            The foundation’s work is guided by a commitment to compassion, kindness, and service to humanity.
          </p>

          <div className="founder-values">
            <article className="founder-value">
              <div className="founder-value-top">
                <span>01 / OUR MISSION</span>
                <Heart size={17} />
              </div>
              <h3>Help, without hesitation.</h3>
              <p>
                The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by
                providing support, resources, and assistance in whatever ways possible.
              </p>
            </article>

            <article className="founder-value">
              <div className="founder-value-top">
                <span>02 / OUR VISION</span>
                <Sparkles size={17} />
              </div>
              <h3>A legacy that lasts.</h3>
              <p>
                The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that
                continues to grow, serve, and make a difference for generations to come.
              </p>
            </article>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link className="button button-gold" to="/founder">
              Read Founder’s Profile <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Donation Callout Section */}
      <section id="contribute" className="donation">
        <div className="donation-orb"></div>
        <div className="donation-left">
          <span className="eyebrow light">BE PART OF SOMETHING MEANINGFUL</span>
          <h2>
            Donate for
            <br />
            <em>a Cause.</em>
          </h2>
          <p>
            If you would like to support Saagar Foundation, the account details provided by the foundation are listed
            here for direct reference.
          </p>
          <div className="donation-foot">
            <span>Your support can help kindness travel further.</span>
          </div>
          <div style={{ marginTop: '28px' }}>
            <Link to="/donate" className="text-link light-link">
              View full donation guide <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <DonationCard />
      </section>

      {/* 7. Contact Section */}
      <ContactFormSection />
    </motion.div>
  );
}
