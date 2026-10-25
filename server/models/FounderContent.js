import mongoose from 'mongoose';

const founderContentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Memoona',
    },
    title: {
      type: String,
      required: true,
      default: 'Founder, Saagar Foundation',
    },
    portraitUrl: {
      type: String,
      default: '', // If empty, frontend falls back to the approved memoonaPortrait asset
    },
    introduction: {
      type: String,
      default: "The foundation's work is guided by a commitment to compassion, kindness, and service to humanity.",
    },
    missionHighlight: {
      type: String,
      default: "The mission of the Saagar Foundation is to help anyone in need, regardless of their circumstances, by providing support, resources, and assistance in whatever ways possible. Our goal is to make a positive difference in people's lives through compassion, kindness, and service to humanity.",
    },
    visionHighlight: {
      type: String,
      default: "The vision of the Saagar Foundation is to build something meaningful and lasting—an organization that continues to grow, serve, and make a difference for generations to come. Our dream is to create a foundation that stands the test of time, reaching as many people in need as possible and providing help wherever it is needed. We aspire to build a legacy of compassion, generosity, and service that lives on forever, touching countless lives and inspiring others to do the same.",
    },
  },
  {
    timestamps: true,
  }
);

export const FounderContent = mongoose.model('FounderContent', founderContentSchema);
