import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDeleteUserMutation, useGetUsersQuery } from '../hooks/userHooks';
import { ApiError } from '../types/ApiError';
import { User } from '../types/User';
import { getError } from '../utils';
import { Link } from 'react-router-dom';

export default function UserListPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = Number(sp.get('page') || 1);
  const { data, isLoading, error, refetch } = useGetUsersQuery(page);

  const { mutateAsync: deleteUser, isLoading: loadingDelete } =
    useDeleteUserMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        deleteUser(id);
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
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>

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
                <th>NAME</th>
                <th>EMAIL</th>
                <th>IS ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data!.users.map((user: User) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(user._id)}
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
                to={`/admin/users?page=${x + 1}`}
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
