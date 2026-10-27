import { Event } from '../models/Event.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// GET /api/events (Public)
export const getPublishedEvents = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'All Stories' && category !== 'All') {
      filter.category = category;
    }

    // Exclude heavy gallery arrays from public listing for super-fast page loads
    const events = await Event.find(filter)
      .select('-gallery')
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:idOrSlug (Public)
export const getEventByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let event = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(idOrSlug);
    }

    if (!event) {
      event = await Event.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/admin/all (Admin only)
export const getAllEventsAdmin = async (req, res, next) => {
  try {
    // Exclude heavy gallery arrays from admin table listing for instant loading
    const events = await Event.find()
      .select('-gallery')
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

// POST /api/events (Admin only)
export const createEvent = async (req, res, next) => {
  try {
    const { title, category, label, location, date, image, gallery, description, isPublished, order } = req.body;

    if (!title || !location || !image || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, location, image, and description are required.',
      });
    }

    let slug = slugify(title);
    // Ensure slug uniqueness
    const existing = await Event.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const event = await Event.create({
      title,
      slug,
      category: category || 'Community',
      label: label || 'Community Outreach',
      location,
      date: date || 'UPCOMING',
      image,
      gallery: Array.isArray(gallery) ? gallery : [],
      description,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json({ success: true, message: 'Event created successfully.', data: event });
  } catch (error) {
    next(error);
  }
};

// PUT /api/events/:id (Admin only)
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, label, location, date, image, gallery, description, isPublished, order, slug } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (title && title !== event.title && !slug) {
      event.slug = slugify(title);
    } else if (slug) {
      event.slug = slugify(slug);
    }

    if (title) event.title = title;
    if (category) event.category = category;
    if (label !== undefined) event.label = label;
    if (location) event.location = location;
    if (date !== undefined) event.date = date;
    if (image) event.image = image;
    if (gallery !== undefined) event.gallery = Array.isArray(gallery) ? gallery : [];
    if (description) event.description = description;
    if (isPublished !== undefined) event.isPublished = Boolean(isPublished);
    if (order !== undefined) event.order = Number(order);

    await event.save();
    res.status(200).json({ success: true, message: 'Event updated successfully.', data: event });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id (Admin only)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
