import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getBlogById, deleteBlog } from '../features/blogListing/blogSlice'
import { toast } from 'react-toastify'
const BlogDetailScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { blog } = useSelector(state => state.blog);
    const { user } = useSelector(state => state.auth);
    
    useEffect(() => {
        dispatch(getBlogById(id));
    }, [dispatch, id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await dispatch(deleteBlog(id)).unwrap();
                toast.success('Blog deleted successfully!');
                navigate('/blogs');
            } catch (error) {
                console.error('Error deleting blog:', error);
                toast.error(error?.message || 'Failed to delete blog');
            }
        }
    };

    const canEdit = user && blog && blog.author && (user.id === blog.author._id || user.id === blog.author);

    return (

        <div>
            <button className="btn btn-primary mt-4 " style={{ color: "var(--color-text)", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }} onClick={() => navigate('/blogs')}>  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg></button>
            
            <div className="container  mt-[-50px] mb-5  flex justify-center items-center h-[100vh]">

                <div className="bg-black/30 p-4 rounded mx-40 py-20 px-10 ml-[25%] mr-[10%] border-2 border-white/20 rounded-xl">
                    <h1 className=" text-center text-primary  font-bold  text-[3rem]  " style={{ textAlign: "center", color: 'var(--color-nav)' }}>{blog ? (blog.title ? blog.title : "") : "Expected Blog not found"}</h1>
                    <p className=" text-lg text-left ">{blog ? (blog.content ? blog.content : "") : ""}</p>
                    {blog && blog.media && <img src={blog.media} alt="" />}
                    <div className="flex justify-between">

                        <div className="ml-4 text-lg overflow-hidden inline-flex items-center w-[20%]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="blue" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye mr-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                            : <span style={{ color: "var(--color-nav)", fontSize: "1.5rem" }}>{blog ? (blog.views ? blog.views : "0") : "0"}</span>
                        </div>
                        <div className="container ml-[60%] flex flex-col sm:flex-col sm:items-start gap-2">
                            <h2 className="text-lg text-left overflow-hidden"><span className="font-bold">Written by : </span>{blog ? (blog.author?.name ? blog.author.name : "Anonymous") : "Anonymous"}</h2>
                            <h2 className="text-lg text-left overflow-hidden"><span className="font-bold">Published on : </span>{blog ? (blog.createdAt ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(blog.createdAt)) : "") : ""}</h2>
                            
                            {canEdit && (
                                <div className="flex gap-4 mt-4">
                                    <button 
                                        onClick={() => navigate(`/blogs/edit/${id}`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Blog
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                    >
                                        Delete Blog
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default BlogDetailScreen