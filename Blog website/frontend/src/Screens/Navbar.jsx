import { Link } from "react-router-dom";
import "../index.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout, hydrateAuth } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
function NavbarComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user=useSelector((state)=>state.auth.user);
    if(user){
        console.log('this is user info',user);
    }
    return (
        <div className="bg-body-tertiary p-3 border-b border-stroke dark:bg-dark-2  text-black flex justify-between items-center sticky top-0 z-50 "
            style={{
                background: "linear-gradient(to right, var(--color-surface), var(--color-nav))",
                boxShadow:"0px 10px 8px  linear-gradient(to right, var(--color-surface), var(--color-nav)) inset",
                border:"none"
            }}>
            <div className="w-1/3 pl-8">
                <h1 className="text-2xl font-bold  text-black">Blog App</h1>
            </div>
            <div className="w-1/2 pr-8 mr-[2rem]" >
                <ul className="flex justify-evenly text-lg dark:text-black text-black">
                    <li className="px-10 py-2">
                        <Link to="/">Home</Link></li>
                        <li className="px-10 py-2">
                        <Link to="/blogs">Blogs</Link>
                    </li>
                    <li className="px-10 py-2">
                            <Link to={user ?"/blogs/add":"/login"}>Create Blog</Link>
                        </li>
                    {user   ? (<>

                        <li className="px-10 py-2">
                            <Link to="/"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                      const result = await dispatch(logout()).unwrap();
                                      try {
                                        localStorage.removeItem('auth');
                                        localStorage.removeItem('Login');
                                      } catch {}
                                      dispatch(hydrateAuth({ user: null, token: null }));
                                      navigate('/');
                                    } catch (err) {
                                      try {
                                        localStorage.removeItem('auth');
                                        localStorage.removeItem('Login');
                                      } catch {}
                                      dispatch(hydrateAuth({ user: null, token: null }));
                                      navigate('/');
                                    }
                                }}
                            >Logout</Link>
                        </li>
                    </>) : (<> 
                        <li className="px-4 py-2  border border-white rounded-lg"  >
                            <Link to="/login" className="font-bold">Login/Signup</Link>
                        </li>
                    </>
                    )}

                </ul>
            </div>
        </div>
    );
}

export default NavbarComponent;