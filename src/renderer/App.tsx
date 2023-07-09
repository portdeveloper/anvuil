import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function Hello() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-red-900">
      <p className="text-5xl font-bold mb-4">Hello Electron!</p>
      <p className="text-2xl">furkan</p>
      <p className="text-2xl">berk</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
