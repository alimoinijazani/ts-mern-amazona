import { Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <header>TS Amazona</header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>tsamazona</Navbar.Brand>
        </Container>
        <Nav>
          <a href="/cart" className="nav-link">
            Cart
          </a>
          <a href="/signin" className="nav-link">
            Sign In
          </a>
        </Nav>
      </Navbar>
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
