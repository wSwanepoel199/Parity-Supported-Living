import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import {
  Ecommerce,
  Orders,
  Employees,
  Customers,
  Kanban,
  Editor,
  Calendar,
  ColorPicker,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  ColorMapping,
  Pyramid,
  Stacked
} from './pages';

// const App = lazy(() => import('./App'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={<App />}
    >
      <Route path="ecommerce" element={<Ecommerce />} />

      {/* pages  */}
      <Route path="orders" element={<Orders />} />
      <Route path="employees" element={<Employees />} />
      <Route path="customers" element={<Customers />} />

      {/* apps  */}
      <Route path="kanban" element={<Kanban />} />
      <Route path="editor" element={<Editor />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="color-picker" element={<ColorPicker />} />

      {/* charts  */}
      <Route path="line" element={<Line />} />
      <Route path="area" element={<Area />} />
      <Route path="bar" element={<Bar />} />
      <Route path="pie" element={<Pie />} />
      <Route path="financial" element={<Financial />} />
      <Route path="color-mapping" element={<ColorMapping />} />
      <Route path="pyramid" element={<Pyramid />} />
      <Route path="stacked" element={<Stacked />} />
    </Route>
  ),
  { basename: "/" });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// window.updateAvailable.resolve(false);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(process.env.NODE_ENV === "production" ? null : console.log);
