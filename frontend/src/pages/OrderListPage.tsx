import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { ApiError } from '../types/ApiError';
import { useDeleteOrderMutation, useGetOrdersQuery } from '../hooks/orderHooks';
import { Link } from 'react-router-dom';

export default function OrderListPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = Number(sp.get('page') || 1);
  console.log(page);
  const { data, isLoading, error, refetch } = useGetOrdersQuery(page);

  const { mutateAsync: deleteOrder, isLoading: loadingDelete } =
    useDeleteOrderMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        deleteOrder(id);
        refetch();
        toast.success('Order deleted successfully');
      } catch (err) {
        toast.error(getError(err as ApiError));
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
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
                <th>USER</th>
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
                  <td>{order.user ? order.user.name : 'DELETED USER'}</td>
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
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(order._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(data!.pages).keys()].map((x) => (
              <Link
                className={
                  x + 1 === Number(data!.page) ? 'btn text-bold' : 'btn'
                }
                key={x + 1}
                to={`/admin/orders?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
