const User = require("../model/userModel")
const generateToken = require("../mongoDbConfig/tokenGenrate")

// user register API 
const userRegister  = async(req,res)=>{
    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
          res.status(400);
          throw new Error("Please Enter all the Feilds");
        }
      
        const userExists = await User.findOne({ email });
      
        if (userExists) {
          res.status(400);
          throw new Error("User already exists");
        }
      
        const user = await User.create({
          name,
          email,
          password,
          pic,
        });
      
        if (user) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
          });
        } else {
          res.status(400);
          throw new Error("User not found");
        } 
    } catch (error) {
        return res.status(500).json({
            status:"Failed",
            message:error.message
        })
    }
}

// user login API
const userLogin  = async(req,res)=>{
   try {
    const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
   } catch (error) {
    return res.status(500).json({
        status:"Failed",
        message:error.message
    })
   }
}

// User Search API

const userSearch  = async(req,res)=>{
  try {
   const search = req.query.search ? {
    $or:[
      {name:{$regex:req.query.search, $options: "i"}},
      {email:{$regex:req.query.search, $options: "i"}}
    ]
   }:{}

    
 if (search !=null) {
  const user = await User.find(search).find({_id:{$ne:req.user._id}})  
  return res.status(200).json({
   message:"Success",
   data:user 
  })
 } else {
   res.status(401);
   throw new Error("Invalid Email or Password");
 }
  } catch (error) {
   return res.status(500).json({
       status:"Failed",
       message:error.message
   })
  }
}


module.exports = {userRegister,userLogin,userSearch}