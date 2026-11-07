import express from 'express';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    const filter = {};
    if (type && ['lost', 'found'].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }, { location: { $regex: search, $options: 'i' } }];
    const items = await Item.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch { res.status(500).json({ message: 'Could not load listings.' }); }
});

router.get('/mine', protect, async (req, res) => {
  const items = await Item.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Listing not found.' });
    res.json(item);
  } catch { res.status(400).json({ message: 'Invalid listing ID.' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, location, type, contact, date } = req.body;
    if (![title, description, category, location, type, contact].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ message: 'Please complete all required fields.' });
    if (!['lost', 'found'].includes(type)) return res.status(400).json({ message: 'Type must be lost or found.' });
    const item = await Item.create({ title, description, category, location, type, contact, date: date || Date.now(), createdBy: req.user._id });
    res.status(201).json(item);
  } catch { res.status(500).json({ message: 'Could not create listing.' }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Listing not found.' });
    if (String(item.createdBy) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot edit this listing.' });
    const allowed = ['title', 'description', 'category', 'location', 'type', 'status', 'contact', 'date'];
    allowed.forEach(key => { if (req.body[key] !== undefined) item[key] = req.body[key]; });
    await item.save(); res.json(item);
  } catch { res.status(400).json({ message: 'Could not update listing.' }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Listing not found.' });
    if (String(item.createdBy) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot delete this listing.' });
    await Claim.deleteMany({ item: item._id }); await item.deleteOne();
    res.json({ message: 'Listing deleted.' });
  } catch { res.status(400).json({ message: 'Could not delete listing.' }); }
});

router.post('/:id/claims', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Listing not found.' });
    if (String(item.createdBy) === String(req.user._id)) return res.status(400).json({ message: 'You cannot claim your own listing.' });
    if (item.status !== 'open') return res.status(400).json({ message: 'This listing is no longer open.' });
    const claim = await Claim.create({ item: item._id, claimant: req.user._id, message: req.body.message || 'I believe this item belongs to me.' });
    res.status(201).json(claim);
  } catch (error) { res.status(error.code === 11000 ? 409 : 500).json({ message: error.code === 11000 ? 'You have already submitted a claim.' : 'Could not submit claim.' }); }
});

router.get('/admin/claims', protect, adminOnly, async (_req, res) => {
  const claims = await Claim.find().populate('item').populate('claimant', 'name email').sort({ createdAt: -1 });
  res.json(claims);
});

export default router;
