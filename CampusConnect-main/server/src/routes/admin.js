import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();
router.get('/stats', protect, adminOnly, async (_req, res) => {
  const [users, items, lost, found, claims] = await Promise.all([User.countDocuments(), Item.countDocuments(), Item.countDocuments({ type: 'lost' }), Item.countDocuments({ type: 'found' }), Claim.countDocuments()]);
  res.json({ users, items, lost, found, claims });
});
router.get('/claims', protect, adminOnly, async (_req, res) => {
  const claims = await Claim.find().populate('item').populate('claimant', 'name email').sort({ createdAt: -1 });
  res.json(claims);
});
router.patch('/claims/:id', protect, adminOnly, async (req, res) => {
  if (!['approved', 'rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid claim status.' });
  const claim = await Claim.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('item').populate('claimant', 'name email');
  if (!claim) return res.status(404).json({ message: 'Claim not found.' });
  if (claim.status === 'approved') await Item.findByIdAndUpdate(claim.item._id, { status: 'claimed' });
  res.json(claim);
});
router.patch('/users/:id/role', protect, adminOnly, async (req, res) => {
  if (!['student', 'admin'].includes(req.body.role)) return res.status(400).json({ message: 'Invalid role.' });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});
export default router;
