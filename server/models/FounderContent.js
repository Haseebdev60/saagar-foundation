import mongoose from 'mongoose';

const founderContentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Memoona Ahmad',
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
    bio: {
      type: String,
      default: `At just 17 years old, Memoona Ahmad had a simple yet life-changing realization: people around her needed help, and someone had to step forward. Instead of waiting for someone else to make a difference, she founded Saagar Foundation, turning compassion into action. Memoona believes that everyone is equal and dreams of building a society where differences no longer divide people. Outgoing, energetic, and straightforward, she enjoys connecting with people and believes in being honest while remaining professional and committed to every responsibility she takes on.

Her love for Pakistan is at the heart of everything she does. Deeply patriotic, Memoona dreams of seeing Pakistan become the nation envisioned by Quaid-e-Azam Muhammad Ali Jinnah—a country built on unity, justice, discipline, and equal opportunities for all. His words continue to inspire her every step of the way. She firmly believes in his famous quote, "No power on earth can undo Pakistan," seeing it as a reminder of the nation's resilience and limitless potential. Another principle she lives by is, "With faith, discipline and selfless devotion to duty, there is nothing worthwhile that you cannot achieve." This philosophy became the driving force behind the creation of Saagar Foundation.

As Saagar Foundation continues to grow, so does Memoona's vision. She hopes to inspire more young people to believe that age is never a barrier to making a difference and wants others to understand that meaningful change begins with one decision—the decision to care, to act, and to serve. For Memoona Ahmad, Saagar Foundation is only the beginning. Her journey is fueled by faith, guided by discipline, and driven by a dream of a stronger, more compassionate, and more united Pakistan.`,
    },
    introduction: {
      type: String,
      default: '',
    },
    missionHighlight: {
      type: String,
      default: '',
    },
    visionHighlight: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const FounderContent = mongoose.model('FounderContent', founderContentSchema);
