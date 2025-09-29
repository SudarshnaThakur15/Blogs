import react from 'react';
import { useState } from 'react';
export  default function InputBox ({ type, placeholder, name, value, onChange,labelText,style }) {
    return (
   <div className="mb-6">
     <input
       type={type}
       placeholder={placeholder}
       name={name}
       value={value}
       onChange={onChange}
       className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-black-900 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-grey-500"
       style={style}
     />
     {((labelText!=null)&&labelText!=="")?<p className={ (labelText==="Strong password")?`text-green-500`:`text-red-500`}>{labelText}</p>:null}
   </div>
 );
};