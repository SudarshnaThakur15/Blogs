/* eslint-disable no-undef */
import dotenv from 'dotenv';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import User from '../model/users.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import { generateTokens } from '../utils/jwtUtils.js';
import { getCookieOptions, getToastCookieOptions } from '../utils/cookieUtils.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          password: '',
          role: ['READER']
        });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));


function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

function errorResponse(res, message = 'Error', statusCode = 400) {
  return res.status(statusCode).json({ success: false, message });
}


export async function googleSignup(req, res) {
  const user = req.user;

  if (!user) {
    return res.redirect('http://localhost:5173/signup'); 
  }

  const { accessToken, refreshToken } = generateTokens(user);
  const cookieOptions = getCookieOptions();
  const refreshCookieOptions = getCookieOptions(true);
  const toastOptions = getToastCookieOptions();

  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.cookie('token', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  res.cookie(
    'user',
    JSON.stringify({ name: user.name, email: user.email, role: user.role }),
    toastOptions
  );
  console.log("token", accessToken);
  res.redirect('http://localhost:5173/home');
}


export async function userRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return errorResponse(res, 'All fields (name, email, password) are required', 400);
    }
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: ['READER'],
      googleId: ''
    });

    const { accessToken } = generateTokens(newUser);
    res.cookie('toast','Registration successful', getToastCookieOptions());
    return successResponse(res, { token: accessToken ,user:{name:newUser.name,email:newUser.email,role:newUser.role}}, 'Registration successful', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      if(!email){
        return errorResponse(res, 'Email is required', 400);
      }
      if(!password){
        return errorResponse(res, 'Password is required', 400);
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.cookie('toast', 'Email not found plese try signing up ', {
        httpOnly: false,
        path: '/',
        sameSite: 'lax',
        // Express expects maxAge in milliseconds; keep this toast visible for ~3 minutes
        maxAge: 3 * 60 * 1000 
      });
      return errorResponse(res, 'User not found', 404);
    }
    
    if (user.googleId!='')
    {
       res.clearCookie('toast');
       res.cookie('toast', 'Please login with google', {
         httpOnly: false,
         path: '/',
         sameSite: 'lax',
         // Express expects maxAge in milliseconds; keep this toast visible for ~3 minutes
         maxAge: 3 * 60 * 1000 
       });
       return  errorResponse(res, 'Please login with google', 404);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.cookie('toast', 'Invalid Credentials-Wrong password', {
        httpOnly: false,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 3 *1000
      });
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const accessCookieOptions = getCookieOptions();
    const refreshCookieOptions = getCookieOptions(true);
    const toastOptions = getToastCookieOptions();

    res.clearCookie('token');
    res.clearCookie('toast');
    res.clearCookie('refreshToken');

    res.cookie('toast', 'Login successful', toastOptions);
    res.cookie('token', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    

    return successResponse(res, { token: accessToken,user:{name:user.name,email:user.email,role:user.role} }, 'Login successful');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function userProfile(req, res) {
  try {
    const user = await User.findById(req.query.id).select('-password'); 
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, user, 'User profile retrieved');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function allUsers(req, res) {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    return successResponse(res, users, 'All users retrieved');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function updateUserById(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim()) {
      return errorResponse(res, 'Name and email are required', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    user.name = name.trim();
    user.email = email.trim();

    if (password?.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from response

    return successResponse(res, userResponse, 'User updated successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function deleteUserById(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from response

    return successResponse(res, userResponse, 'User deleted successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}
export async function logout(req, res) {
  try {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return successResponse(res, 'Logout successful');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return errorResponse(res, 'No refresh token found', 401);
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    const { accessToken } = generateTokens(user);
    const accessCookieOptions = getCookieOptions();
    const refreshCookieOptions = getCookieOptions(true);
    
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.cookie('token', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    return successResponse(res, { token: accessToken }, 'Refresh token successful');
  }
  catch(error)
  {
    console.error(error);
    return errorResponse(res, 'Internal server error', 500);
  }
}












































