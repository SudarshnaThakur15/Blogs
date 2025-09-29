import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/card";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <main className="p-6">
       <div id="hero" className="text-center pt-20 pb-10 px-0 mx-0  flex justify-center items-center h-[800px]" style={{backgroundImage:"url('https://images.pexels.com/photos/2527248/pexels-photo-2527248.jpeg') ",backgroundSize:"cover",backgroundPosition:"center" ,backgroundRepeat:"no-repeat",backgroundOpacity:"0.8"}}>
          <div className="bg-cover w-1/2 opacity-50"  >
             {/* <img src="https://images.pexels.com/photos/20708796/pexels-photo-20708796.jpeg" className="w-full h-[800px] rounded-lg" alt="" /> */}
          </div>
          <div className="bg-cover w-1/2  h-[500px] m-auto bg-neutral-900/50 rounded-lg text-left pl-30">
             <h1 className="text-4xl mt-[150px]" style={{color:'var(--color-primary)'}} >Welcome to our BlogWebsite</h1>
             <p className="text-lg mt-4 " style={{color:'var(--color-paragraph)'}}>We are a community of writers sharing<br/> their knowledge and experiences.</p>
             {localStorage.getItem('Login')?(<><button className="mt-4 px-20 py-2 rounded-lg border border-white  bg-black/80 " onClick={() => navigate('/blogs')}>Explore</button>
             </>):(<button className="mt-4 px-20 py-2 rounded-lg border border-white  bg-black/80 " onClick={() => navigate('/signup')}>Get Started</button>)}
          </div>   
        </div>
        <section className="pt-10 pb-10 pl-20 pr-20" id="cards">

         <Card/>
        </section>
        
        <section id="cta" className="flex justify-center">
          <button className="px-4 py-2 rounded-lg border border-white  bg-black/80 " onClick={() => navigate('/blogs')}  >Read More</button>
          <button className="px-4 py-2 rounded-lg border border-black/80 bg-white ml-4  color-[var(--color-secondary)] " style={{color:'var(--color-secondary)'}}>Become a Writer</button>
        </section>
        <section className="pt-10 pb-10" id="about">
          <h1>About Us</h1>
        </section>
    </main>
  );
};

export default Homepage;