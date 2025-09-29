import axios from 'axios'
import API from '../clientAPI'
export const userRegister = (user) => API.post("/signup", user);        
export const userLogin = (user) => API.post("/login", user);        
export const userProfile = () => API.get("/profile");        
export const allUsers = () => API.get("/users");        
export const updateUserById = (id, user) => API.put(`/user/${id}`, user);        
export const deleteUserById = (id) => API.delete(`/user/${id}`);        
export const googleSignup = (user) => API.post("/google", user);        
