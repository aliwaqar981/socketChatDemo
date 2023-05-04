import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Messenger from './pages/messenger/Messenger';

function LogOut() {
  const { dispatch } = useContext(AuthContext);
  useEffect(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);
  return <></>;
}

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          {user ? <Home /> : <Register />}
        </Route>
        <Route path='/login'>{user ? <Redirect to='/' /> : <Login />}</Route>
        <Route path='/register'>
          {user ? <Redirect to='/' /> : <Register />}
        </Route>
        <Route path='/messenger'>
          {!user ? <Redirect to='/' /> : <Messenger />}
        </Route>
        <Route path='/profile/:username'>
          {!user ? <Redirect to='/login' /> : <Profile />}
          <Profile />
        </Route>
        <Route path='/logout'>
          <LogOut />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
