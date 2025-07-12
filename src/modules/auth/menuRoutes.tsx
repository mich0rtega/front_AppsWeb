//import UserForm from "../user/userForm";
import ProductForm from '../products/productFrom';
import UsersTable from "../user/UsersTable";
import OrdersTable from "../orders/orderForm";
import OrdersForm from '../orders/orderForm';

export interface MenuRoute {
  path: string;
  element: JSX.Element;
  label: string;
}

const routes: MenuRoute[] = [
  {
    path: '/dashboard',
    element: <p>Dashboard</p>,
    label: 'Dashboard',
  },
  {
    path: '/users',
    element: <UsersTable/>,
    label: 'Users',
  },
  {
    path: '/products',
    element: <ProductForm/>,
    label: 'Products',
  },
  {
    path: '/orders',
    element: <OrdersForm/>,
    label: 'Orders',
  },
  
];

export default routes;
