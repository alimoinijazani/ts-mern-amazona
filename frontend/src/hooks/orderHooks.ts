import { useMutation, useQuery } from '@tanstack/react-query';
import { CartItem, ShippingAddress } from '../types/Cart';
import apiClient from '../apiClient';
import { Order } from '../types/Order';

export const useGetOrderSummaryQuery = () =>
  useQuery({
    queryKey: ['orders-summary'],
    queryFn: async () =>
      (
        await apiClient.get<{
          users: [{ numUsers: number }];
          orders: [{ numOrders: number; totalSales: number }];
          dailyOrders: [];
          productCategories: [];
        }>(`api/orders/summary`)
      ).data,
  });
export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  });

export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
  });
export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  });

export const useGetGoogleApiKeyQuery = () =>
  useQuery({
    queryKey: ['google-api-key'],
    queryFn: async () =>
      (await apiClient.get<{ key: string }>(`/api/keys/google`)).data,
  });
export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      itemsPrice: number;
      shippingPrice: number;
      taxPrice: number;
      totalPrice: number;
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  });
export const useGetOrderHistoryQuery = (page: number) =>
  useQuery({
    queryKey: ['order-history', page],
    queryFn: async () =>
      (
        await apiClient.get<{ orders: [Order]; page: number; pages: number }>(
          `/api/orders/mine?page=${page}`
        )
      ).data,
  });
export const useGetOrdersQuery = (page: number) =>
  useQuery({
    queryKey: ['orders', page],
    queryFn: async () =>
      (
        await apiClient.get<{ orders: [Order]; page: number; pages: number }>(
          `api/orders?page=${page}`
        )
      ).data,
  });
export const useDeleteOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (await apiClient.delete<{ message: string }>(`api/orders/${orderId}`))
        .data,
  });
