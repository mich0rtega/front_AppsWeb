import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import routes from './modules/auth/menuRoutes';
import Dashboard from './modules/Dashboard/Dashboard'; 
import LoginForm from './modules/auth/LoginForm';
import AuthRoutes from './modules/auth/AuthRoutes';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />}/>
        <Route path='/' element={
          <AuthRoutes> 
            <Dashboard/>
          </AuthRoutes>
        }>
       
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
