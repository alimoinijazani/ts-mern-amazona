export type CartItem = {
  image: string | undefined;
  slug: string;
  quantity: number;
  countInStock: number;
  price: number;
  _id: string;
  name: string;
};
export type Location = {
  lat: number;
  lng: number;
};
export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  location: Location;
};

export type Cart = {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};
