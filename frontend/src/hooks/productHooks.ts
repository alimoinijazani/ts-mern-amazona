import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { Product } from '../types/Product';

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  });
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  });
export const useSearchProductsQuery = ({
  page,
  query,
  category,
  price,
  rating,
  order,
}: {
  page: number;
  query: string;
  category: string;
  price: string;
  rating: string;
  order: string;
}) =>
  useQuery({
    queryKey: ['products', page, query, category, price, rating, order],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: Product[];
          countProducts: number;
          pages: number;
        }>(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        )
      ).data,
  });

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  });

//Admin
export const useGetAdminProdcutsQuery = (page: number) =>
  useQuery({
    queryKey: ['admin-products', page],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: [Product];
          page: number;
          pages: number;
        }>(`/api/products/admin?page=${page}`)
      ).data,
  });

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async () =>
      (
        await apiClient.post<{ product: Product; message: string }>(
          `api/products`
        )
      ).data,
  });
export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (productId: string) =>
      (await apiClient.delete(`api/products/${productId}`)).data,
  });
