import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, ArrowRight, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import EventModal from '../components/EventModal';
import { api } from '../services/api';

const initialEventsList = [
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

export default function Events() {
  const [events, setEvents] = useState(initialEventsList);
  const [filter, setFilter] = useState('All Stories');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getEvents()
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
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
      className="events-page"
    >
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #071020 0%, #0b172a 100%)',
          color: 'white',
          padding: '85px max(7.5%, calc((100vw - 1160px)/2)) 70px',
        }}
      >
        <span className="eyebrow light">
          <span className="eyebrow-line"></span> HUMANITARIAN INITIATIVES
        </span>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(44px, 5.5vw, 68px)',
            fontWeight: 500,
            lineHeight: 1.1,
            margin: '18px 0',
          }}
        >
          Our work, <em>in action.</em>
        </h1>
        <p style={{ maxWidth: '600px', fontSize: '14px', lineHeight: 1.85, color: '#c5c9d4', margin: 0 }}>
          Every gathering, food drive, visit, and tournament represents a tangible commitment to uplifting lives and
          fostering community spirit across Lahore.
        </p>
      </section>

      {/* Main Events Grid */}
      <section className="events section-pad" style={{ background: '#071020' }}>
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
              className="event-card"
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
                <span className="image-label">{e.date || 'EVENT'}</span>
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

        <div className="events-bottom" style={{ marginTop: '50px' }}>
          <span>SMALL ACTIONS. MEANINGFUL IMPACT.</span>
          <span>{visibleEvents.length} STORIES SHOWN</span>
        </div>

        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      </section>
    </motion.div>
  );
}
