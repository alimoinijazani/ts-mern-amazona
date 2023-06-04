import { Link, Outlet } from 'react-router-dom';
import { Badge, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { Store } from './Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LinkContainer } from 'react-router-bootstrap';
function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode);
  }, [mode]);
  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' });
  };
  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>tsamazona</Navbar.Brand>
            </LinkContainer>
          </Container>
          <Nav>
            <Link
              to="#"
              className="nav-link header-link"
              onClick={switchModeHandler}
            >
              <i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>{' '}
              {mode === 'light' ? 'Light' : 'Dark'}
            </Link>
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
            {userInfo ? (
              <NavDropdown
                className="header-link"
                title={`Hello, ${userInfo.name}`}
              >
                <LinkContainer to="/profile">
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  {' '}
                  Sign Out{' '}
                </Link>
              </NavDropdown>
            ) : (
              <NavDropdown className="header-link" title={`Hello, sign in`}>
                <LinkContainer to="/signin">
                  <NavDropdown.Item>Sign In</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer>
        <div className="text-center">All right reserved</div>
      </footer>
    </div>
  );
}

export default App;
