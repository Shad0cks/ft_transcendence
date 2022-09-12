import { Link } from 'react-router-dom';
import TSCreateChannel from '../components/TSCreateChannel';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div className="App">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <TSCreateChannel />
      </div>
    </div>
  );
}
