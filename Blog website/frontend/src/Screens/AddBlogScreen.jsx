import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBlog } from '../features/blogListing/blogSlice';
import InputBox from '../Components/inputBox';
import EditorComponent from '../Components/editor';
import { toast } from 'react-toastify';

export default function AddBlogScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [media, setMedia] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }
        
        if (!content.trim()) {
            toast.error('Please enter content');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const blogData = {
                title: title.trim(),
                content: content.trim(),
                media: media.trim() || undefined
            };
            
            await dispatch(addBlog(blogData)).unwrap();
            toast.success('Blog added successfully!');
            navigate('/blogs');
        } catch (error) {
            console.error('Error adding blog:', error);
            toast.error(error?.message || 'Failed to add blog');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="container mx-auto mt-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-center mb-8">Add New Blog</h1>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className='flex flex-row gap-4 align-center p-4 bg-[linear-gradient(to bottom,rgba(0, 0, 0, 0.55),rgba(2, 5, 54, 0.48))] border-2 border-white/20 rounded-xl'>
                    <div className="mb-6 w-2/3">
                        <EditorComponent content={content} setContent={setContent} />
                    </div>
                    <div className='w-1/3 h-[500px] flex flex-col'>
                        <InputBox 
                            type="text" 
                            name="title" 
                            placeholder="Add Title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            style={{
                                height: "60px", 
                                fontSize: "1.5rem", 
                                marginTop: "20px",
                                border: "none", 
                                borderRadius: "10px", 
                                marginBottom: "20px", 
                                background: "linear-gradient(to bottom,rgba(90, 3, 64, 0.55),rgba(2, 5, 54, 0.48))",
                                color: "white",
                                padding: "10px"
                            }} 
                        />
                        
                        <InputBox 
                            type="url" 
                            name="media" 
                            placeholder="Media URL (optional)" 
                            value={media} 
                            onChange={(e) => setMedia(e.target.value)} 
                            style={{
                                height: "50px", 
                                fontSize: "1rem", 
                                marginBottom: "20px",
                                border: "none", 
                                borderRadius: "10px", 
                                background: "linear-gradient(to bottom,rgba(90, 3, 64, 0.55),rgba(2, 5, 54, 0.48))",
                                color: "white",
                                padding: "10px"
                            }} 
                        />
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-primary text-white text-[1.2rem] font-bold rounded border border-white/20 shadow-lg bg-[#b33d07] hover:bg-black/70 cursor-pointer px-[20px] py-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Blog'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};