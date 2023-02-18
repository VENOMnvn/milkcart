const express = require('express');
const app = express();
const path = require('path');
const User = require("./Modals/Modal.js");
const OtpModal = require("./Modals/OtpModal");
const Admin = require('./Modals/Admin');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator'); // validating Email
var cors = require('cors');
const { json } = require('express');
const sendByEmail = require('./Otp.js');


console.log(User, typeof (User));

// DataBase Connection
const my_db = process.env.MONGO_URL || `mongodb+srv://milkcartindia:milk14cart14inida14@cluster0.yjvgzbp.mongodb.net/test`;    // Connection
const mongoose = require('mongoose');   // Atlas URL

mongoose.connect(my_db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("\nDB connected\nEnjoy Surfing");
});




// Driver Code and Middlewares
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname,'public')));

// Routes 



// Routes
app.get('/', (req, res) => {
    res.send("All Good is Running by Naveen");
})


app.post('/user', async (req, res) => {
    const user = req.body;
    const Findemail = user.email;
    const checkingEmail = await User.findOne({ email: Findemail });

    if (checkingEmail) {
        res.send({ error: "OTP expired" });
        return
    }

    if (user.otp) {
        const getOtp = await OtpModal.findOne({ email: user.email });

        if (user.otp == getOtp.otp) {


            const salt = await bcrypt.genSalt(8)
            const hash = await bcrypt.hash(user.password, salt);

            const response = await User.create(
                {
                    name: user.username,
                    email: user.email.toLowerCase(),
                    dob: user.dob,
                    gender: user.gender,
                    password: hash
                }
                , (err, userCollection) => {
                    if (err)
                        console.log("Error in Creating User in DB: ", err);

                    res.send({ ...userCollection._doc, isOtpValid: true });

                });

        }
        else {
            res.send({
                isOtpValid: false,
                error: "Otp Mismatch",
                isOtpValid: true
            });
        }

    }
    else {
        res.send({
            error: "Otp Empty",
            isOtpEmpty: true
        });
    }

})

app.post('/email', async (req, res) => {
    const user = req.body;
    const Findemail = user.email;
    const checkingEmail = await User.findOne({ email: Findemail });
    if (checkingEmail == null) {
        
        const Generateotp = () => {
            const otp = `${Math.floor(Math.random() * (999999 - 100000)) + 100000}`;
            console.log(otp, "Generate");
            return otp;
        }
        const otp = Generateotp();
        console.log(otp);
        const resOtpDel = await OtpModal.deleteMany({ email: Findemail });
        console.log("resdel", resOtpDel);

        await OtpModal.create({
            email: Findemail,
            otp: otp,
            expireAt: Date.now()
        },
            (err, otpmodal) => {
                console.log("err", err, "OTPMD", otpmodal);
            }
        );

        const result = await sendByEmail(req.body.email, otp);
        res.send({
            isOtpSend: true
        });

    }
    else {
        res.send({
            error: "Email already exist",
            isEmailExist: true
        })
    }

});


app.post('/login', async (req, res) => {
    let credentials = req.body;
    let email = credentials.email;
    let password = credentials.password;

    const userInDB = await User.findOne({ email: email });
    if (userInDB) {
        const hashInDB = userInDB.password;

        const isMatch = await bcrypt.compare(password, hashInDB);

        if (isMatch) {
            res.send({ valid: true, user: { ...userInDB._doc, password: "Encypted" } });
        } else {
            res.send({ valid: false, error: "Wrong Password" });
        }
    }
    else {
        res.send({ valid: false, error: "User not present" })
    }
});


app.post("/forgetpassword",async (req,res)=>{

    const {email} = req.body;
    const emailInDB =await User.findOne({ email : email })
    if(emailInDB)
    {
        const Generateotp = () => {
            const otp = `${Math.floor(Math.random() * (999999 - 100000)) + 100000}`;
            console.log(otp, "Generate");
            return otp;
        }
        const otp = Generateotp();
        console.log(otp);
        const resOtpDel = await OtpModal.deleteMany({ email: emailInDB.email });
        console.log("resdel", resOtpDel);

        await OtpModal.create({
            email: emailInDB.email,
            otp: otp,
            expireAt: Date.now()
        },
            (err, otpmodal) => {
                console.log("err", err, "OTPMD", otpmodal);
            }
        );

        const result = await sendByEmail(req.body.email, otp);
        res.send({
            valid:true,
            isOtpSend: true
        });
    }
    else{
        res.send({valid:false,error:"Email is not in DB"});
    }

});


app.post('/forgetlogin',async (req,res)=>{

    const otpFromUser = req.body.otp;
    const email = req.body.email;
    
   const otpInDb = await OtpModal.findOne({email:email});
   console.log(otpInDb , otpFromUser , email);

   if(otpFromUser == otpInDb?.otp){

        console.log("Eun1")
        const user = await User.findOne({email:email});
        console.log("RUn2");
        res.send({valid:true,user:{...user._doc,password:'Encypt'}});
   }
   else if(otpInDb == null)
   {
    res.send({valid:false,error:"Invalid OTP or OTP expiries"});
   }
   else{
    res.send({valid:false,error:"Invalid OTP"});
   }

});


app.post("/checkadmin",async (req,res)=>{

    const email = req.body;
    const valid = Admin.findOne({
        email:email
    })
    if(valid){
        res.send(true);
    }
    else{
        res.send(false);
    }

});








// server
app.listen(PORT, () => {
    console.log("\nServer Started Successfully\n")
})
