import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncCart
} from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/sync')
  .post(syncCart);

router.route('/:itemId')
  .put(updateCartItem)
  .delete(removeFromCart);

export default router;