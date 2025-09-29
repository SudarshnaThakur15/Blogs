import validator from 'validator';

export const validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields (name, email, password) are required' 
    });
  }

  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name must be between 2 and 50 characters' 
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }

  if (password.length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters long' 
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    });
  }

  req.body.name = validator.escape(name.trim());
  req.body.email = validator.normalizeEmail(email.trim());
  req.body.password = password.trim();

  next();
};

export const validateBlogCreation = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and content are required' 
    });
  }

  if (title.length < 5 || title.length > 200) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title must be between 5 and 200 characters' 
    });
  }

  if (content.length < 10) {
    return res.status(400).json({ 
      success: false, 
      message: 'Content must be at least 10 characters long' 
    });
  }

  req.body.title = validator.escape(title.trim());
  req.body.content = validator.escape(content.trim());

  next();
};
