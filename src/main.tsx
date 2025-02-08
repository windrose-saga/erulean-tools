import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';
import './index.css';

const hashHistory = createHashHistory();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  history: hashHistory,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
