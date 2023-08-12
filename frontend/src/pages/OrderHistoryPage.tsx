import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useGetOrderHistoryQuery } from '../hooks/orderHooks';
import { ApiError } from '../types/ApiError';
import { getError } from '../utils';
import { Link } from 'react-router-dom';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = Number(sp.get('page') || 1);
  const { data, isLoading, error } = useGetOrderHistoryQuery(page);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data!.orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt?.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? order.paidAt?.substring(0, 10) : 'No'}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt?.substring(0, 10)
                      : 'No'}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {[...Array(data!.pages).keys()].map((x) => (
            <Link
              className={x + 1 === Number(data!.page) ? 'btn text-bold' : 'btn'}
              key={x + 1}
              to={`/orderhistory?page=${x + 1}`}
            >
              {x + 1}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
