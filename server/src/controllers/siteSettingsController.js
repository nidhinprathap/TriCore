import SiteSettings from '../models/SiteSettings.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json(settings);
  } catch (err) { next(err); }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    Object.assign(settings, req.validatedBody);
    await settings.save();
    res.json(settings);
  } catch (err) { next(err); }
};
