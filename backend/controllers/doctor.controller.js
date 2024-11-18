import appointmentModel from "../models/appointment.model.js"
import doctorModel from "../models/doctor.model.js"
import userModel from "../models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const changeAvailability = async (req, res) => {
    try {
        const {docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available})
        res.json({success: true, message: "Availability changed successfully"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


 const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success: true, doctors})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
 }


 //API to get the dashboard to get the data

 const adminDashboard = async (req, res) => {
     try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.slice(-5).reverse()

        }

        res.json({success: true, dashData})

     } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
     }
 }


 //API for doctor login

 const loginDoctor = async (req, res) => {
     try {
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor) return res.json({success: false, message: "Invalid Credentials"})

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            res.json({success: true, message:"Login Success", token})
        }else{
            res.json({success: false, message: "Invalid Credentials"})
        }

     } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
     }
 }


//API to get doctor appointments related the particular doctor
const appointmentsDoctor = async (req, res) => {
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})
        res.json({success: true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


export {changeAvailability, doctorList, adminDashboard, loginDoctor, appointmentsDoctor}