import { ContactSubmission } from '../models/ContactSubmission.js';

// POST /api/contact (Public)
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const submission = await ContactSubmission.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      ipAddress: String(ipAddress),
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Saagar Foundation. Your message has been received with care.',
      id: submission._id,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/contact/admin/all (Admin only)
export const getSubmissionsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      filter.status = status;
    }

    const submissions = await ContactSubmission.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/contact/admin/:id (Admin only)
export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const submission = await ContactSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    if (status) submission.status = status;
    if (adminNotes !== undefined) submission.adminNotes = adminNotes;

    await submission.save();
    res.status(200).json({ success: true, message: 'Submission updated.', data: submission });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contact/admin/:id (Admin only)
export const deleteSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findByIdAndDelete(id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }
    res.status(200).json({ success: true, message: 'Submission deleted.' });
  } catch (error) {
    next(error);
  }
};
