import { DonationSetting } from '../models/DonationSetting.js';

// GET /api/donation-info (Public)
export const getDonationInfo = async (req, res, next) => {
  try {
    let setting = await DonationSetting.findOne();
    if (!setting) {
      setting = await DonationSetting.create({
        accountHolder: 'Nabila Ahmad',
        bankName: 'Mashreq Bank',
        accountNumber: '089120169858',
        iban: '',
        instructions: 'Please verify the details with the foundation before making a transfer. No online payment is processed on this website.',
        helpPhone: '03029616426',
        helpEmail: 'Saagarwelfarefoundation@gmail.com',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        accountHolder: setting.accountHolder,
        bankName: setting.bankName,
        accountNumber: setting.accountNumber,
        iban: setting.iban,
        instructions: setting.instructions,
        helpPhone: setting.helpPhone,
        helpEmail: setting.helpEmail,
        updatedAt: setting.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/donation-info (Admin only)
export const updateDonationInfo = async (req, res, next) => {
  try {
    const { accountHolder, bankName, accountNumber, iban, instructions, helpPhone, helpEmail } = req.body;

    let setting = await DonationSetting.findOne();
    if (!setting) {
      setting = new DonationSetting();
    }

    if (accountHolder) setting.accountHolder = accountHolder.trim();
    if (bankName) setting.bankName = bankName.trim();
    if (accountNumber) setting.accountNumber = accountNumber.trim();
    if (iban !== undefined) setting.iban = iban.trim();
    if (instructions !== undefined) setting.instructions = instructions.trim();
    if (helpPhone) setting.helpPhone = helpPhone.trim();
    if (helpEmail) setting.helpEmail = helpEmail.trim();

    await setting.save();
    res.status(200).json({ success: true, message: 'Donation information updated.', data: setting });
  } catch (error) {
    next(error);
  }
};
