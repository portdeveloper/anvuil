import { createRoot } from 'react-dom/client';
import App from './App';
import { BlocksProvider } from './BlocksProvider'; // import the context provider

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <BlocksProvider>
    <App />
  </BlocksProvider>
);
