import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Order, OrderModel } from '../models/orderModel';
import { Product, ProductModel } from '../models/productModel';
import { isAdmin, isAuth } from '../utils';
import { UserModel } from '../models/userModel';
import { CartItem } from '../types/Cart';
import cron from 'node-cron';
import { Item } from './../models/orderModel';

export const orderRouter = express.Router();

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);
const PAGE_SIZE = 4;
orderRouter.get(
  '/mine',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const orders = await OrderModel.find({ user: req.user._id })
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    const countOrders = await OrderModel.countDocuments({ user: req.user._id });
    // res.json(orders);
    res.json({
      orders,
      countOrders,
      pages: Math.ceil(countOrders / PAGE_SIZE),
      page,
    });
  })
);

orderRouter.get(
  // /api/orders/:id
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order Not Found' });
    }
  })
);

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
    } else {
      //it should be better to check product stock here
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((x: Product) => ({
          ...x,
          product: x._id,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      } as Order);
      req.body.orderItems.map(async (item: CartItem) => {
        const product = await ProductModel.findById(item._id);

        if (product && product.countInStock >= item.quantity) {
          product.countInStock = product.countInStock - item.quantity;
          await product.save();
        } else {
          res
            .status(400)
            .send({ message: 'one or more products are out of stock' });
        }
      });

      res.status(201).json({ message: 'Order Created', order: createdOrder });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();

      res.send({ order: updatedOrder, message: 'Order Paid Successfully' });
    } else {
      res.status(404).json({ message: 'Order Not Found' });
    }
  })
);
const page_size = 8;
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const orders = await OrderModel.find()
      .populate('user', 'name')
      .skip(page_size * (page - 1))
      .limit(page_size);
    const countOrders = await OrderModel.countDocuments();
    res.send({
      orders,
      countOrders,
      pages: Math.ceil(countOrders / page_size),
      page,
    });
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.deleteOne();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
cron.schedule(' 0 * * * *', async () => {
  const orders = await OrderModel.find({
    isPaid: false,
    createdAt: { $lte: Date.now() - 3600000 },
  });
  orders.map(async (order) => {
    order.orderItems.map(async (item: Item) => {
      const product = await ProductModel.findById(item.product);
      if (product && !order?.isPaid) {
        product.countInStock = Number(product.countInStock + item.quantity);
        await product.save();

        console.log('product return');
      } else {
        console.log('order time not over yet');
      }
    });
    await order.deleteOne();
  });
});
