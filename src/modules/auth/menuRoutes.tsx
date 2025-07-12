// menuRoutes.tsx
import React from "react";         
//import UserForm from "../user/userForm";
import ProductForm from '../products/productFrom';
import UsersTable from "../user/UsersTable";
import OrdersForm from '../orders/orderForm';

export interface MenuRoute {
  path: string;
  element: React.ReactNode;      
  label: string;
  roleIds?: string[];
  hidden?: boolean;
}

const routes: MenuRoute[] = [
  {
    path: '/dashboard',
    element: <p>Dashboard</p>,
    label: 'Dashboard',
    roleIds: [],
    hidden: false,
  },
  {
    path: '/users',
    element: <UsersTable />,
    label: 'Users',
  },
  {
    path: '/products',
    element: <ProductForm />,
    label: 'Products',
  },
  {
    path: '/orders',
    element: <OrdersForm />,
    label: 'Orders',
  },
];

export default routes;
