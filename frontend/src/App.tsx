import { Link, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { Store } from './Store';
function App() {
  const {
    state: { mode },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode);
  }, [mode]);
  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' });
  };
  return (
    <div className="d-flex flex-column vh-100">
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>tsamazona</Navbar.Brand>
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
            <a href="/cart" className="nav-link">
              Cart
            </a>
            <a href="/signin" className="nav-link">
              Sign In
            </a>
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
