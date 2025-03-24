
const Express= require("express");

const BodyParser=require("body-parser");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
require("dotenv").config();
const app = Express();

const PORT= process.env.PORT;

mongoose.connect('$(process.env.MONGOURL)/ExampleDB'); 

const signUpSchema=new mongoose.Schema({
    email:String,
    password:String
});

const User= mongoose.model("user",signUpSchema);

app.use(BodyParser.urlencoded({extended:false}));

app.set("view engine","ejs");

app.use(Express.json());

app.get("/",(req,res)=>{
    res.render("index");
})



app.get("/about",(req,res)=>{
    res.send("<h1>this is about page </h1>");
})

app.get("/contact",(req,res)=>{
    res.send("<h1>this is contact page </h1>");
})

app.get("/SignUp",(req,res)=>{
    res.render("form");
});

app.post("/SignUp",async(req,res)=>{
    try{
        const Email=req.body.email;
    const Password=req.body.password;
    if(!Email || !Password){
        res.send("please enter the fields")
    }
    
    //creating salt
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(Password,salt);
    const newUser= new User({
        email:Email,
        password:hash
        //password:Password
    });
    newUser.save(); 
    res.send("<h1>signup successful</h1>");

    }catch(error){
        res.status(500).send(error);
    }
    
})

app.post("/login",async(req,res)=>{
    try{
        const Email=req.body.email;
        const Password=req.body.password;
    
        if(!Email||!Password){
            // res.status(402).send("<h1>please enter the fields</h1>");
            throw new error("please enter the fields");
    
        }
        const userDetail=await User.findOne({"email":Email});
    
        if(!userDetail){
            res.status(500).send("<h1>please signup</h1>");
        }
        // if(userDetail.password !== Password){
        //     res.status(500).send("<h1>password is incorrect</h1>");
        // }
        const comparePass=await bcrypt.compare(Password,userDetail.password);
        if(!comparePass){
            res.status(500).send("<h1>password incorrect</h1>");
        }
        res.send("logged in");
    }catch(error){
        res.status(500).send(error);
    }
    
    
})

app.get("/forgotPassword",(req,res)=>{
     res.render("forgotPassword");
})
app.post("/forgotPassword",async(req,res)=>{
    const Email=req.body.uEmail;
    const Password=req.body.uPassword;

    const data=await User.findOne({"email":Email});
    if(!data){
        res.status(500).send("<h1>please signup</h1>");
    }  
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(Password,salt);
   await User.updateOne({"email":data.email},{"password":hash});

   res.send({"message":"update success"});


})
    


app.listen(PORT,()=>{
    console.log(`serving on port  ${PORT} `);
 })







 
// app.post("/signup",(req,res)=>{
//     const Email = req.body.uEmail;
//     const password = req.body.uPassword;

//     console.log(Email);
//     console.log(password);

//     res.send("<h1>Signed up</h1>")
// })

// app.get("/",(req,res)=>{
//      res.send("<h1>this is node.js </h1>");
// })
// app.post("/SignUp",async(req,res)=>{
//     const Email=req.body.email;
//     const Password=req.body.password;

//     if(!Email||!Password){
//         res.status(500).send("<h1>please enter the fields</h1>");

//     }
//     //creating salt
//     const salt=await bcrypt.genSalt(10);
//     const hash=await bcrypt.hash(Password,salt);
//     const newUser= new User({
//         email:Email,
//         password:hash
//         //password:Password
//     });
//     newUser.save(); 
//     res.send("<h1>signup successful</h1>");
// })

// app.post("/login",async(req,res)=>{
//     const Email=req.body.email;
//     const Password=req.body.password;

//     if(!Email||!Password){
//         res.status(500).send("<h1>please enter the fields</h1>");

//     }
//     const userDetail=await User.findOne({"email":Email});

//     if(!userDetail){
//         res.status(500).send("<h1>please signup</h1>");
//     }
//     // if(userDetail.password !== Password){
//     //     res.status(500).send("<h1>password is incorrect</h1>");
//     // }
//     const comparePass=await bcrypt.compare(Password,userDetail.password);
//     if(!comparePass){
//         res.status(500).send("<h1>password incorrect</h1>");
//     }
//     res.send("logged in");
    
// })


// app.post("/contact",(req,res)=>{
//     res.send("<h1>data sent</h1>");
// })


// app.get("/",(req,res)=>{
//     res.render("index");
// })

