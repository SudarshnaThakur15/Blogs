import { useEffect } from 'react'
import './App.css'
import Signup from './Components/signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/login'
import { Provider } from 'react-redux'
import store from './redux/store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './Screens/Homepage'
import NavbarComponent from './Screens/Navbar'
import { Outlet } from 'react-router-dom'
import BlogScreen from './Screens/BlogScreen'
import BlogDetailScreen from './Screens/BlogDetailScreen'
import AddBlogScreen from './Screens/AddBlogScreen'
import EditBlogScreen from './Screens/EditBlogScreen'
import { useDispatch } from 'react-redux'
import { hydrateAuth } from './features/auth/authSlice'

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.user || parsed.token)) {
          dispatch(hydrateAuth({ user: parsed.user || null, token: parsed.token || null }));
        }
      }
      const cookieStr = document.cookie || '';
      if (cookieStr && !raw) {
        const cookies = cookieStr.split('; ').reduce((prev, curr) => {
          const [key, value] = curr.split('=');
          if (key) prev[key] = decodeURIComponent(value || '');
          return prev;
        }, {});
        const userCookie = cookies['user'];
        if (userCookie) {
          try {
            const user = JSON.parse(userCookie);
            dispatch(hydrateAuth({ user, token: null }));
            localStorage.setItem('auth', JSON.stringify({ user, token: null }));
            document.cookie = 'user=; Max-Age=0; path=/';
          } catch {}
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [dispatch]);
  return children;
}
function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
      <AppInitializer>
        <NavbarComponent />
        <Routes>
          <Route path='/'  element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Outlet />} />
          <Route path="/details/:id" element={<BlogDetailScreen />} />
          <Route path="/blogs" element={<BlogScreen />} />
          <Route path="/blogs/add" element={<AddBlogScreen />} />
          <Route path="/blogs/edit/:id" element={<EditBlogScreen />} />
        </Routes>
      </AppInitializer>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          newestOnTop
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </Provider>
    </BrowserRouter>
  )
}

export default App
