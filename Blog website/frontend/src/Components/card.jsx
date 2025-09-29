import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getBlogs } from "../features/blogListing/blogSlice";
import { useSelector } from "react-redux";
const SingleCard = ({
    image,
    Button,
    CardDescription,
    CardTitle,
    titleHref,
    btnHref,
  }) => {
    return (
      <>
        {/*  */}
        <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3">
          <img src={image} alt="" className="w-full h-[500px] " />
          <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
            <h3>
              <a
                href={titleHref ? titleHref : "/#"}
                className="mb-4 block text-xl font-semibold text-dark hover:text-primary dark:text-white sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]"
                style={{ color: 'var(--color-secondary)' }}
              >
                {CardTitle}
              </a>
            </h3>
            <p className="mb-7 text-base leading-relaxed text-body-color dark:text-dark-6 line-clamp-3 overflow-hidden">
              {CardDescription}
            </p>
  
            {Button && (
              <a
                href={btnHref ? btnHref : "#"}
                className="inline-block rounded-full border border-gray-3 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6"
              >
                {Button}
              </a>
            )}
          </div>
        </div>
        {/*  */}
      </>
    );
  };
  export {SingleCard};
const Card = () => {/*  */
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getBlogs());
    }, [dispatch]);
    const { blogs = [], status, error } = useSelector((state) => state.blog);
    const topBlogs = blogs.slice(0,3);
    console.log('card page', { status, error, blogs });    
  return (
    <>
      <section className="bg-gray-2 pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]" >
        <div className="container" style={{ color: 'var(--color-secondary)' }}>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(topBlogs) && topBlogs.map((blog,index) => (
              <SingleCard
                key={blog._id || blog.id || blog.title}
                image={((index)%2)?(blog.media || "https://images.pexels.com/photos/19346490/pexels-photo-19346490.jpeg") : (blog.media || "https://images.pexels.com/photos/3001169/pexels-photo-3001169.jpeg")}
                CardTitle={blog.title}
                titleHref="/#"
                btnHref="/#"
                CardDescription={blog.content}
                Button="View Details"
              />
            ))}
          
          </div>
        </div>
      </section>
    </>
  );
};

export default Card;


