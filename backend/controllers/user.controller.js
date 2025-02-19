import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import razorpay from "razorpay";

//API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //check for password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    //check for valid email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    //check for duplicate user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    //Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating user
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    //save the user to database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    //create the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );

    //send the response
    res.json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for user login

const loginUser = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    //check for valid email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    //check for existing user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    //check for password
    const isMatch = await bcrypt.compare(password, user.password);

    //if the user matches then we have to create the token
    if(isMatch){
        //create the token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET )
        res.json({ success: true, message: "User logged in successfully", token });
    }else{
        res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API to get the userdata for the frontend

const getProfile = async (req, res) => {
  try {
    const {userId} = req.body
    const userData = await userModel.findById(userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to update user profile

const updateProfile = async (req, res) => {
  try {
    
    const {userId, name, phone, address, dob, gender} = req.body;
    const imageFile = req.file;
    if(!name || !phone || !dob || !gender){
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    await userModel.findByIdAndUpdate(userId, { name, phone, address:JSON.parse(address), dob, gender});
    if(imageFile){
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      })
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to book appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select('-password');

    if(!docData.available){
      return res.json({ success: false, message: "Doctor is not available" });
    }

    let slots_booked = docData.slots_booked;

    //checking for slots availability
    if(slots_booked[slotDate]){
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot is already booked" });
      }else{
        slots_booked[slotDate].push(slotTime);
      }
    }else{
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select('-password');
    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotDate,
      slotTime,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in doctors data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}


//API to get the user appoinements ador the user side

const listAppoinement = async (req, res) => {
  try {
    const {userId} = req.body;
    const appointments = await appointmentModel.find({userId})
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to concel the appointment

const cancelAppointment = async (req, res) => {
  try {
    const {userId, appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    //verify appointment user
    if(appointmentData.userId !== userId){
      return res.json({ success: false, message: "You are not authorized to cancel this appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true});

    //releading doctor slot
    const {docId, slotDate, slotTime} = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter((slot) => slot !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment cancelled successfully" });

  } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
  }
}


//API to make the payment using the razorpay

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})


const paymentRazorpay = async (req, res) => {
  
  try {
     const {appointmentId} = req.body;
  const appointmentData = await appointmentModel.findById(appointmentId);

  if(!appointmentData || appointmentData.cancelled){
    return res.json({ success: false, message: "Appointment cancelled or not found" });
  }
  
  //creating options for the razorpay payment
  const options = {
    amount: appointmentData.amount * 100,
    currency: process.env.CURRENCY,
    receipt: appointmentId
  }

  //creation of an order
  const order = await razorpayInstance.orders.create(options);
  res.json({ success: true, order });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to verify the payment

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status === "paid"){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppoinement, cancelAppointment, paymentRazorpay, verifyRazorpay };
