import { FounderContent } from '../models/FounderContent.js';

// GET /api/founder-info (Public)
export const getFounderInfo = async (req, res, next) => {
  try {
    let content = await FounderContent.findOne();
    if (!content) {
      content = await FounderContent.create({
        name: 'Memoona',
        title: 'Founder, Saagar Foundation',
        portraitUrl: '', // Default falls back to local asset in frontend
        introduction: "The foundation's work is guided by a commitment to compassion, kindness, and service to humanity.",
        missionHighlight: "The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by providing support, resources, and assistance in whatever ways possible. Our goal is to make a positive difference in people's lives through compassion, kindness, and service to humanity.",
        visionHighlight: "The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that continues to grow, serve, and make a difference for generations to come. Our dream is to create a foundation that stands the test of time, reaching as many people in need as possible and providing help wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on forever, touching countless lives and inspiring others to do the same.",
      });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

// PUT /api/founder-info (Admin only)
export const updateFounderInfo = async (req, res, next) => {
  try {
    const { name, title, portraitUrl, introduction, missionHighlight, visionHighlight } = req.body;

    let content = await FounderContent.findOne();
    if (!content) {
      content = new FounderContent();
    }

    if (name) content.name = name.trim();
    if (title) content.title = title.trim();
    if (portraitUrl !== undefined) content.portraitUrl = portraitUrl.trim();
    if (introduction !== undefined) content.introduction = introduction.trim();
    if (missionHighlight !== undefined) content.missionHighlight = missionHighlight.trim();
    if (visionHighlight !== undefined) content.visionHighlight = visionHighlight.trim();

    await content.save();
    res.status(200).json({ success: true, message: 'Founder information updated successfully.', data: content });
  } catch (error) {
    next(error);
  }
};
