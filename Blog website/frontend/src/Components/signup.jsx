import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import {useSelector,useDispatch} from "react-redux";
import {signup} from "../features/auth/authSlice";

const InputBox = ({ type, placeholder, name, value, onChange,labelText }) => {
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
        {((labelText!=null)&&labelText!=="")?<p className={ (labelText==="Strong password")?`text-green-500`:`text-red-500`}>{labelText}</p>:null}
      </div>
    );
  };

const PasswordInputBox=({type,placeholder,name,value,onChange,labelText}) => {
  return <div className="mb-6">
  <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} 
  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-black-900 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-grey-500"
  />
  
  {labelText}
  </div>
}
const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [nameMessage, setNameMessage] = useState("");
    const [confirmpassword,setConfirmPassword]=useState("");
    const [confirmPasswordMessage,setConfirmPasswordMessage]=useState("");
    const [toggle,setToggle]=useState(true);
    const [inputType,setInputType]=useState("password");
    const [valid, setValid] = useState(false);
    const dispatch=useDispatch();
   
    const response = useSelector((state) => state.auth);
    console.log("Debugging -> signup api response",response)

    const handleGoogleSignup = () => {
      window.location.href = "/api/user/auth/google";}
     
    const handleSignup = async (e) => {
      e.preventDefault();
      if(email===""||name===""||password===""){
        console.log("All fields are required");
        return;
      }       
      try {
        if(!valid){
          console.log("Check the fields again");
          return;
        }else{
          const result =await dispatch(signup({ email, name, password })).unwrap();
          if(response){
            console.log("Signup successful---->>>>>>", result);
            try { localStorage.setItem('auth', JSON.stringify(result)); } catch {}
            navigate('/home');
          }
          }
      } catch (error) {
        console.log(error);
      }
    }

   
  return (
    // {loading? (<div>Loading...</div>):()}
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
              <form onSubmit={handleSignup}>
                <InputBox type="email" name="email" placeholder="Email"  labelText={emailMessage} value={email} onChange={(e) => {
                setEmail(e.target.value)
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  setEmailMessage("Invalid email format");
                  setValid(false);
                } else {
                  setEmailMessage("");
                  setValid(true);
                }
              }

                  
                }/>
                <InputBox type="text" name="name" placeholder="name" labelText={nameMessage} value={name} onChange={(e) => {setname(e.target.value)
                  const nameRegex = /^[a-zA-Z ]+$/;
                  if(e.target.value.startsWith(" ")||e.target.value.endsWith(" ")||e.target.value===""){
                    setNameMessage("Name Can't start or end with space");
                    return;
                  }
                  if (!nameRegex.test(name)) {
                    setNameMessage("Invalid name format");
                    setValid(false);
                  } else {
                    setNameMessage("");
                    setValid(true);
                  }
                }}/>
                <div className="relative">
                  <PasswordInputBox
                    type={inputType}
                    name="password"
                    placeholder="Password"
                    value={password}
                    labelText={passwordMessage}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      const passwordRules = [
                        /[a-z]+/, // lowercase
                        /[A-Z]+/, // uppercase
                        /[0-9]+/, // digit
                        /[!@#$%^&*]+/, // special character
                      ];
                      if(e.target.value===0){
                        setPasswordMessage('');
                        setValid(false);
                        return;
                      }
                      if(e.target.value.length<8){
                        setPasswordMessage("Password must be at least 8 characters long");
                        setValid(false);
                        return;
                      }
                      const passwordStrength = passwordRules.every((rule) =>
                        rule.test(e.target.value)
                      );
                      if (!passwordStrength) {
                        setValid(false);
                        setPasswordMessage("Weak password");
                      }
                      else{
                        setValid(true);
                        setPasswordMessage("Strong password");
                      }
                    }}
                  />
                  <button
                    className={"absolute top-4 right-4 z-10"}
                    onClick={() => {
                      setToggle((prev)=>!prev);
                      setInputType(toggle ? "text" : "password")}}>
                      {toggle ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>}
                    </button>
                </div>
                <InputBox
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  value={confirmpassword}
                  labelText={confirmPasswordMessage}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if(e.target.value!==password){
                      setValid(false);
                      setConfirmPasswordMessage("Passwords do not match");
                    }
                    else{
                      setValid(true);
                      setConfirmPasswordMessage("Passwords match");
                    }
                  }}
                />
                <div className="mb-10">
                  <input
                    type="submit"
                    value="Sign Up"
                    className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium text-black transition hover:bg-opacity-90"
                  />
                </div>
              </form>
              <p className="mb-6 text-base text-secondary-color dark:text-dark-7">
                Connect With
              </p>
              <ul className="-mx-2 mb-12 flex justify-between">
                
                <li className="w-full px-2">
                  <a
                    
                    onClick={handleGoogleSignup}
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
                <span className="pr-0.5">Already have an account?</span>
                <a
                  href="/login"
                  className="text-pink-500 hover:underline"
                >
                  Log In
                </a>
              </p>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
// A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components