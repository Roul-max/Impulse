import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { Cart, ICart } from '../models/Cart';
import { Product } from '../models/Product';

// Helper to calculate cart total
const calculateCartTotal = async (cartItems: any[]) => {
  let total = 0;
  // We need to fetch fresh product prices to ensure accuracy
  // In a real app, you might optimize this to avoid N+1 queries using .find({ _id: { $in: ids } })
  for (const item of cartItems) {
    const product = await Product.findById(item.product);
    if (product) {
       // Check if item has a variant price difference (if implemented), otherwise use base price
       // For this module, we use product.price * quantity
       total += (product.price * item.quantity);
    }
  }
  return total;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req: any, res: any) => {
  let cart = await Cart.findOne({ user: req.user?._id }).populate('items.product', 'name price image images stock slug')
;

  if (!cart) {
    // Return empty structure if no cart exists yet
    return res.json({ items: [], total: 0, count: 0 });
  }

  // Filter out null products (if a product was deleted)
  const originalLength = cart.items.length;
  cart.items = cart.items.filter((item: any) => item.product !== null);
  
  if (cart.items.length !== originalLength) {
      await cart.save();
  }

  // Calculate dynamic total
  // Since we populated 'product', we can calculate directly
  const total = cart.items.reduce((acc, item: any) => {
      return acc + (item.product.price * item.quantity);
  }, 0);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cart] Retrieved for User ${req.user?._id}. Items: ${cart.items.length}, Total: ${total}`);
  }

  res.json({
    _id: cart._id,
    items: cart.items,
    total,
    count: cart.items.reduce((acc, item) => acc + item.quantity, 0)
  });
});

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req: any, res: any) => {
  const { productId, quantity, variant } = req.body;
  const qty = Number(quantity) || 1;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Stock Validation
  if (product.stock < qty) {
      if (process.env.NODE_ENV === 'development') {
          console.log(`[Cart] Stock overflow attempt. Product: ${product.name}, Stock: ${product.stock}, Requested: ${qty}`);
      }
      res.status(400);
      throw new Error(`Insufficient stock. Only ${product.stock} left.`);
  }

  let cart = await Cart.findOne({ user: req.user?._id });

  if (cart) {
    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex((item) => 
        item.product.toString() === productId && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (itemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[itemIndex].quantity + qty;
      
      // Re-validate stock for total quantity
      if (product.stock < newQuantity) {
          res.status(400);
          throw new Error(`Insufficient stock. You already have ${cart.items[itemIndex].quantity} in cart.`);
      }

      cart.items[itemIndex].quantity = newQuantity;
      if (process.env.NODE_ENV === 'development') console.log(`[Cart] Updated quantity for ${product.name} to ${newQuantity}`);
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity: qty, variant } as any);
      if (process.env.NODE_ENV === 'development') console.log(`[Cart] Added new item: ${product.name}`);
    }
  } else {
    // Create new cart
    cart = await Cart.create({
      user: req.user?._id,
      items: [{ product: productId, quantity: qty, variant }]
    });
    if (process.env.NODE_ENV === 'development') console.log(`[Cart] Created new cart for user`);
  }

  await cart.save();
  
  // Return updated cart with full product details
  const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image images stock slug')
;
  
  // Recalculate total
  const total = updatedCart?.items.reduce((acc, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

  res.json({
      items: updatedCart?.items,
      total
  });
});

// @desc    Update item quantity directly
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req: any, res: any) => {
    const { quantity } = req.body;
    const { itemId } = req.params; // Using Product ID for simplicity in this context, or cart item subdocument ID

    let cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Find item by Product ID (assuming unique product per cart for simplicity, ignoring variant complexity for this specific endpoint)
    // Alternatively, we can find by subdocument _id
    const itemIndex = cart.items.findIndex(item => item.product.toString() === itemId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            // Check stock
            const product = await Product.findById(itemId);
            if (product && product.stock < quantity) {
                res.status(400);
                throw new Error(`Insufficient stock. Only ${product.stock} available.`);
            }

            cart.items[itemIndex].quantity = quantity;
            if (process.env.NODE_ENV === 'development') console.log(`[Cart] Quantity set to ${quantity} for item ${itemId}`);
        } else {
            // Remove if quantity is 0
            cart.items.splice(itemIndex, 1);
            if (process.env.NODE_ENV === 'development') console.log(`[Cart] Item removed due to 0 quantity`);
        }
        
        await cart.save();
        
        // Return updated cart
        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image images stock slug')
;
        const total = updatedCart?.items.reduce((acc, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

        res.json({
            items: updatedCart?.items,
            total
        });
    } else {
        res.status(404);
        throw new Error('Item not found in cart');
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req: any, res: any) => {
    const { itemId } = req.params; // Product ID

    let cart = await Cart.findOne({ user: req.user?._id });

    if (cart) {
        cart.items = cart.items.filter((item) => item.product.toString() !== itemId);
        await cart.save();

        if (process.env.NODE_ENV === 'development') console.log(`[Cart] Item ${itemId} removed`);

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image images stock slug')
;
        const total = updatedCart?.items.reduce((acc, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

        res.json({
            items: updatedCart?.items,
            total
        });
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Sync local cart to database (Merge)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = asyncHandler(async (req: any, res: any) => {
    const { items } = req.body; // Array of { productId, quantity, variant }
    
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid items format' });
    }

    if (process.env.NODE_ENV === 'development') console.log(`[Cart] Syncing ${items.length} items for user`);

    let cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
        cart = new Cart({ user: req.user?._id, items: [] });
    }

    for (const localItem of items) {
        const product = await Product.findById(localItem.productId);
        if (product) {
            const existingItemIndex = cart.items.findIndex(
                i => i.product.toString() === localItem.productId
            );

            if (existingItemIndex > -1) {
                // Determine strategy: Overwrite or Add? Let's Add for safe sync
                const newQty = cart.items[existingItemIndex].quantity + localItem.quantity;
                // Clamp to stock
                cart.items[existingItemIndex].quantity = Math.min(newQty, product.stock);
            } else {
                // Clamp to stock
                const qty = Math.min(localItem.quantity, product.stock);
                if (qty > 0) {
                    cart.items.push({ 
                        product: localItem.productId, 
                        quantity: qty, 
                        variant: localItem.variant 
                    } as any);
                }
            }
        }
    }

    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image images stock slug')
;
    const total = updatedCart?.items.reduce((acc, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

    res.json({
        items: updatedCart?.items,
        total
    });
});

export { getCart, addToCart, updateCartItem, removeFromCart, syncCart };