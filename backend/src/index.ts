import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { productRouter } from './routers/productRouter';
import { seedRouter } from './routers/seedRouter';
import { userRouter } from './routers/userRouter';
import { orderRouter } from './routers/orderRouter';
import { keyRouter } from './routers/keyRouter';
import { uploadRouter } from './routers/uploadRouter';
dotenv.config();
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazona';
mongoose.set('strictQuery', true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch(() => {
    console.log('error mongodb');
  });
const app = express();
app.use(
  cors()
  //   {
  //   credentials: true,
  //   origin: ['http://localhost:5173', '/'],
  // }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/seed', seedRouter);
app.use('/api/uploads', uploadRouter);

app.use('/api/keys', keyRouter);
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ messge: 'server error' });
  next();
});

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10);
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
