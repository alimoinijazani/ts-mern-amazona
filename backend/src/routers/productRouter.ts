import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Product, ProductModel } from '../models/productModel';
import { isAdmin, isAuth } from '../utils';
const PAGE_SIZE = 3;

export const productRouter = express.Router();
// /api/prodcuts
productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find();
    res.json(products);
  })
);
// /api/slug/tshirt
productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  })
);

productRouter.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const searchQuery = req.query.query || '';
    const category = (req.query.category || '') as string;
    const order = (req.query.order || '') as string;
    const price = (req.query.price || '') as string;
    const rating = req.query.rating || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const ratingFilter =
      rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {};

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await ProductModel.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(
        order === 'lowest'
          ? { price: 1 }
          : order === 'highest'
          ? { price: -1 }
          : order === 'toprated'
          ? { rating: -1 }
          : { _id: -1 }
      )
      .skip(PAGE_SIZE * (page - 1))
      .limit(PAGE_SIZE);
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    });
  })
);

productRouter.get(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await ProductModel.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { query } = req;
    const page = Number(query.page || 1);
    const pageSize = Number(query.pageSize) || PAGE_SIZE;

    const products = await ProductModel.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await ProductModel.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    });
  })
);
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.create({
      name: 'sample name ' + Date.now(),
      image: '../assets/images/p1.jpg',
      price: 0,
      slug: 'sample-slug-' + Date.now(),
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    } as Product);

    const createdProduct = await product.save();
    res.send({
      message: 'Product Created',
      product: createdProduct,
    });
  })
);
productRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.images = req.body.images;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.deleteOne();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
