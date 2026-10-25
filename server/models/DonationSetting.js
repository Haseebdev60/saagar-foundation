import mongoose from 'mongoose';

const donationSettingSchema = new mongoose.Schema(
  {
    accountHolder: {
      type: String,
      required: true,
      default: 'Nabila Ahmad',
    },
    bankName: {
      type: String,
      required: true,
      default: 'Mashreq Bank',
    },
    accountNumber: {
      type: String,
      required: true,
      default: '089120169858',
    },
    iban: {
      type: String,
      default: '',
    },
    instructions: {
      type: String,
      default: 'Please verify the details with the foundation before making a transfer. Once transferred, you may share the confirmation receipt on WhatsApp or email for our records.',
    },
    helpPhone: {
      type: String,
      default: '03029616426',
    },
    helpEmail: {
      type: String,
      default: 'Saagarwelfarefoundation@gmail.com',
    },
  },
  {
    timestamps: true,
  }
);

export const DonationSetting = mongoose.model('DonationSetting', donationSettingSchema);
