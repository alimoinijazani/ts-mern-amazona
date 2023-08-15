export type CartItem = {
  _id?: string;
  name: string;
  slug?: string;
  image: string | undefined;
  price: number;
  countInStock?: number;
  quantity: number;
  product: string;
};
