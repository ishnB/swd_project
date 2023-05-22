import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/myAppDB");

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const transactionSchema = new mongoose.Schema({
  items: [],
  vendor: String,
  status: Boolean,
});

const vendoritemSchema = new mongoose.Schema();
vendoritemSchema.add(vendorSchema).add({ items: [] });

const Vendor = new mongoose.model("Vendor", vendorSchema);
const Student = new mongoose.model("Student", studentSchema);
const VendorItems = new mongoose.model("VendorItems", vendoritemSchema);

app.post("/vendorlogin", async (req, res) => {
  const { email, password } = req.body;
  const vendor = await VendorItems.findOne({ email: email });
  if (vendor) {
    if (password === vendor.password) {
      res.send({ message: "Login Successfull", vendorUser: vendor });
    } else {
      res.send({ message: "Password didn't match" });
    }
  } else {
    res.send({ message: "User not registered" });
  }
});

app.post("/studentlogin", async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email: email });
  if (student) {
    if (password === student.password) {
      res.send({ message: "Login Successfull", studentUser: student });
    } else {
      res.send({ message: "Password didn't match" });
    }
  } else {
    res.send({ message: "User not registered" });
  }
});

app.post("/vendorregister", async (req, res) => {
  const { name, email, password } = req.body;
  const vendor = await VendorItems.findOne({ email: email });
  console.log("vendor..", vendor);
  //   Vendor.findOne({ email: email }).then((err, vendor) => {
  if (vendor) {
    res.send({ message: "User already registered" });
  } else {
    const vendor = new VendorItems({
      name,
      email,
      password,
    });
    vendor.save().then(() => {
      res.send({ message: "Successfully Registered, Please login now." });
    });
  }
});

app.post("/studentregister", async (req, res) => {
  const { name, email, password } = req.body;
  const student = await Student.findOne({ email: email });
  console.log("student..", student);
  //   Vendor.findOne({ email: email }).then((err, vendor) => {
  if (student) {
    res.send({ message: "User already registered" });
  } else {
    const student = new Student({
      name,
      email,
      password,
    });
    student.save().then(() => {
      res.send({ message: "Successfully Registered, Please login now." });
    });
  }
});

app.listen(9000, () => {
  console.log("Server started at 9000");
});
