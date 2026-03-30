import PageContent from '../models/PageContent.js';

export const getPages = async (req, res, next) => {
  try {
    const pages = await PageContent.find().select('slug title updatedAt');
    res.json(pages);
  } catch (err) { next(err); }
};

export const getPage = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    res.json(page);
  } catch (err) { next(err); }
};

export const updateSection = async (req, res, next) => {
  try {
    const { slug, sectionId } = req.params;
    const page = await PageContent.findOne({ slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    const section = page.sections.id(sectionId);
    if (!section) return res.status(404).json({ error: { message: 'Section not found' } });
    Object.assign(section, req.validatedBody);
    await page.save();
    res.json(section);
  } catch (err) { next(err); }
};

export const addSection = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    page.sections.push(req.validatedBody);
    await page.save();
    res.status(201).json(page.sections[page.sections.length - 1]);
  } catch (err) { next(err); }
};

export const deleteSection = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    page.sections.pull({ _id: req.params.sectionId });
    await page.save();
    res.json({ message: 'Section deleted' });
  } catch (err) { next(err); }
};

export const reorderSections = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    const { order } = req.validatedBody;
    for (const item of order) {
      const section = page.sections.id(item.id);
      if (section) section.order = item.order;
    }
    await page.save();
    res.json(page.sections.sort((a, b) => a.order - b.order));
  } catch (err) { next(err); }
};
