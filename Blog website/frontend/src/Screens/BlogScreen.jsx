import React from 'react'
// import {SingleCard} from '../Components/card'
import { getBlogs, addView } from '../features/blogListing/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SingleCard = ({id,image, CardTitle, CardDescription, Button,btnHref}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center gap-10 my-10 border p-4 rounded-lg" style={{background: 'linear-gradient(100deg,rgb(221, 155, 117) 0%,rgb(3, 3, 53) 100%)'}}>
            <div className="w-1/3">
                <img src={image} alt="" className="w-full h-[500px]" />
            </div>
            <div className="w-2/3">
                <h1 className="text-4xl font-bold ">{CardTitle}</h1>
                <p className="mt-4">{CardDescription.slice(0,500)}...</p>
                <button onClick={() => {
                    // Fire-and-forget: don't block navigation on view increment
                    try { dispatch(addView({ id })); } catch {}
                    navigate(btnHref);
                    }} className="px-4 py-2 rounded-lg border border-white  bg-pink-900/40 mt-4 text-white">{Button}</button>
            </div>
        </div>
    )
}
function BlogScreen() {
    // const [blogs, setBlogs] = React.useState([]);
    const dispatch = useDispatch();
    const { blogs = [], status, error } = useSelector((state) => state.blog);
    const { user } = useSelector((state) => state.auth);
    React.useEffect(() => {
        dispatch(getBlogs({limit:10,page:1}));
    }, [dispatch]);
   console.log('blog screen length', Array.isArray(blogs) ? blogs.length : 'n/a');
  return (
    <div className="container mx-auto pt-10">
        {user && (
            <div className="mb-8 flex justify-end">
                <button 
                    onClick={() => navigate('/blogs/add')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    + Add New Blog
                </button>
            </div>
        )}
        { Array.isArray(blogs) && blogs.map((blog, index) => <SingleCard 
                id={blog._id || blog.id }
                key={blog._id || blog.id || blog.title}
                image={((index)%2)?(blog.media || "https://images.pexels.com/photos/19346490/pexels-photo-19346490.jpeg") : (blog.media || "https://images.pexels.com/photos/3001169/pexels-photo-3001169.jpeg")}
                CardTitle={blog.title}
                // titleHref={`/details/${blog._id}`}
                btnHref={`/details/${blog._id}`}
                CardDescription={blog.content}
                Button="View Details" />)}

      
    </div>
  )
}

export default BlogScreen