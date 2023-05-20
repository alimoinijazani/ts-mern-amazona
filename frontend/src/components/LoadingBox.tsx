import Spinner from 'react-bootstrap/spinner';

export default function LoadingBox() {
  return (
    <Spinner animation="border" role="status">
      <span className="visualy-hidden">Loading...</span>
    </Spinner>
  );
}
