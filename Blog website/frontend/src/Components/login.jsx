import React,{useState} from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
const InputBox = ({ type, placeholder, name, value, onChange }) => {
  const navigate=useNavigate();
  return (
    <div className="mb-6">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}         
        onChange={onChange}   
        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-black-900 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-grey-500"
      />
    </div>
  );
};

const Signin = () => {
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/api/user/auth/google";
    // localStorage.setItem('Login', 'true');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      // Persist auth so Navbar can rehydrate after refresh
      try {
        // localStorage.setItem('auth', JSON.stringify(result)); // { token, user }
      } catch {}

      const cookieStr = document.cookie || '';
      const cookies = cookieStr
        ? cookieStr.split('; ').reduce((prev, curr) => {
            const [key, value] = curr.split('=');
            if (key) prev[key] = decodeURIComponent(value || '');
            return prev;
          }, {})
        : {};
        console.log("cookies",cookies,"\n",cookieStr)
      const toastMsg = cookies['toast'];
      if (toastMsg) {
        toast.success(toastMsg);
        // toast.error(toastMsg);
        document.cookie = 'toast=; Max-Age=0; path=/';
      }
       console.log('try block ended')
      setTimeout(() => {
        localStorage.setItem('Login', 'true');
        navigate('/');
      }, 300);
    } catch (error) {

      const cookieStr = document.cookie || '';
      const cookies = cookieStr
        ? cookieStr.split('; ').reduce((prev, curr) => {
            const [key, value] = curr.split('=');
            if (key) prev[key] = decodeURIComponent(value || '');
            return prev;
          }, {})
        : {};

      const toastMsg = cookies['toast'] || error?.response?.data?.message;
      if (toastMsg) {
        toast.warning(toastMsg);
        document.cookie = 'toast=; Max-Age=0; path=/';
      } else {
        toast.error('Login failed');
      }
      console.log('we have entered the error block',error);
    }
  };
  return (
    <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
              <div className="mb-10 text-center md:mb-16">
                <a
                  href="/#"
                  className="mx-auto inline-block max-w-[160px]"
                >
                  <img
                    src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeMLgOCe_g94UdejxW6-GqSVt9MAZQVEidXUyj2EvVXGt1l_NYESYTWZ_mI_hPUyC7Ld8VVmkA1ZtUhij339bbb_6-zE9AibUtZlIdC-a8f75IE-PA_6gSH6XY6t4FxPgrJQ1xw-9KXOzpcYLgFZLAkwfzW?key=U4iAWSLrY3Z3RjJtAhAH_Q"
                    alt="logo"
                  />
                </a>
              </div>
              <form onSubmit={handleSubmit}>
                <InputBox type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  />
                <InputBox   type="password"
                  name="password"
                  placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <div className="mb-10">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium text-black transition hover:bg-opacity-90"
                  />
                </div>
              </form>
              <p className="mb-6 text-base text-secondary-color dark:text-dark-7">
                Connect With
              </p>
              <ul className="-mx-2 mb-12 flex justify-between">
                
                <li className="w-full px-2">
                  <a href="#" onClick={handleGoogleLogin}                  
                    className="flex h-11 items-center justify-center rounded-md bg-[#D64937] hover:bg-opacity-90"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.8477 8.17132H9.29628V10.643H15.4342C15.1065 14.0743 12.2461 15.5574 9.47506 15.5574C5.95916 15.5574 2.8306 12.8821 2.8306 9.01461C2.8306 5.29251 5.81018 2.47185 9.47506 2.47185C12.2759 2.47185 13.9742 4.24567 13.9742 4.24567L15.7024 2.47185C15.7024 2.47185 13.3783 0.000145544 9.35587 0.000145544C4.05223 -0.0289334 0 4.30383 0 8.98553C0 13.5218 3.81386 18 9.44526 18C14.4212 18 17.9967 14.7141 17.9967 9.79974C18.0264 8.78198 17.8477 8.17132 17.8477 8.17132Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
              <a
                href="/#"
                className="mb-2 inline-block text-base text-dark hover:text-primary hover:underline dark:text-white"
              >
                Forget Password?
              </a>
              <p className="text-base text-body-color dark:text-dark-6">
                <span className="pr-0.5">Not a member yet?</span>
                <a
                  href="/signup"
                  className="text-primary hover:underline"
                >
                  Sign Up
                </a>
              </p>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
