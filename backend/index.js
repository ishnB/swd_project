import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";
import FileStore from "session-file-store";
import connectEnsureLogin from "connect-ensure-login";

const app = express();
const memoryStore = new session.MemoryStore();
const mongoMemory = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/myAppDB",
  ttl: 14 * 24 * 60 * 60,
  autoRemove: "native",
});
app.use(
  session({
    store: mongoMemory,
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: true,
      secure: false,
      path: "/",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
// var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GOOGLE_CLIENT_ID =
  "558995932563-pug093o2u0v0rdueefvrm9qplbsikq55.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GOOGLE_CLIENT_ID_S =
  "558995932563-pe23r70n1dvg10ct8lpc0ip879rltev9.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET_S = "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";
// app.use(
//   session({
//     store: new MongoStore()
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//     // cookie: {
//     //   sameSite: true,
//     //   secure: false,
//     //   path: "/",
//     // },
//   })
// );
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://127.0.0.1:27017/myAppDB");

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const vendornewSchema = new mongoose.Schema({
  username: String,
  name: String,
  googleId: String,
  secret: String,
});
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const transactionNewSchema = new mongoose.Schema({
  items: [],
  studentId: String,
  vendorId: String,
  total: Number,
  status: Boolean,
});
const studentnewSchema = new mongoose.Schema({
  username: String,
  name: String,
  googleId: String,
  balance: { type: Number, default: 10000 },
  transactions: [{ studentId: String }, [{ items: String, price: Number }]],
});
const vendoritemSchema = new mongoose.Schema({
  username: String,
  name: String,
  googleId: String,

  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});
vendoritemSchema.add(vendorSchema).add({ items: [] });
vendornewSchema.plugin(passportLocalMongoose);
vendornewSchema.plugin(findOrCreate);
vendoritemSchema.plugin(passportLocalMongoose);
vendoritemSchema.plugin(findOrCreate);
studentnewSchema.plugin(passportLocalMongoose);
studentnewSchema.plugin(findOrCreate);

const Vendor = new mongoose.model("Vendor", vendorSchema);
const VendorNew = new mongoose.model("VendorNew", vendornewSchema);
const Student = new mongoose.model("Student", studentSchema);
const VendorItems = new mongoose.model("VendorItems", vendoritemSchema);
const StudentItems = new mongoose.model("StudentItems", studentnewSchema);
const VendorList = new mongoose.model("VendorList", vendornewSchema);
const TransactionList = new mongoose.model(
  "TransactionList",
  transactionNewSchema
);
// passport.use(VendorNew.createStrategy());
passport.use(VendorList.createStrategy());
passport.serializeUser(function (user, done) {
  const serializedUser = { id: user.id, username: user.name };
  done(null, serializedUser);
});
passport.deserializeUser(function (serializedUser, done) {
  const user = {
    id: serializedUser.id,
    username: serializedUser.username,
  };
  done(null, user);
});
passport.use(
  "google-vendor",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:9000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      VendorItems.findOrCreate(
        { googleId: profile.id, name: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
passport.use(
  "google-student",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID_S,
      clientSecret: GOOGLE_CLIENT_SECRET_S,
      callbackURL: "http://localhost:9000/auth/google/student/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      StudentItems.findOrCreate(
        { googleId: profile.id, name: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google-vendor", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/student",
  passport.authenticate("google-student", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google-vendor", {
    // successRedirect: "http://localhost:3000/vendor",
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    console.log(req.user);
    res.cookie("name", req.user);
    res.redirect("http://localhost:3000/vendor");
  }
);
app.get(
  "/auth/google/student/callback",
  passport.authenticate("google-student", {
    // successRedirect: "http://localhost:3000/vendor",
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    console.log(req.user);
    res.cookie("student", req.user);
    res.redirect("http://localhost:3000/student");
  }
);

app.get("/vendorHome", async (req, res) => {
  if (req.cookies["name"] === undefined) {
    // res.json({ loggedIn: false });
    console.log("not found");
    return res.redirect("http://localhost:3000/vendorlogin");
  }
  const vendor = await VendorItems.findOne({ _id: req.cookies["name"]._id });
  if (vendor) {
    console.log(vendor);
    res.send(vendor);
  }
});
app.get("/studentHome", async (req, res) => {
  if (req.cookies["student"] === undefined) {
    // res.json({ loggedIn: false });
    console.log("not found");
    return res.redirect("http://localhost:3000/studentlogin");
  }
  const student = await StudentItems.findOne({
    _id: req.cookies["student"]._id,
  });
  if (student) {
    console.log(student);
    res.send(student);
  }
});

app.post("/vendorlogout", (req, res) => {
  res.clearCookie("name", { path: "/" });
  console.log("done");
  res.send("Goodbye!");
  res.end();
});
app.post("/studentlogout", (req, res) => {
  res.clearCookie("student", { path: "/" });
  console.log("done");
  res.send("Goodbye!");
  res.end();
});

app.post("/vendoradd", async (req, res) => {
  const { name, price, _id } = req.body;
  try {
    const updatedVendor = await VendorItems.findOneAndUpdate(
      { _id: _id },
      { $push: { items: { itemName: name, price: price } } },
      { new: true }
    );
    const response = {
      data: updatedVendor.items,
      alert: "Item Added",
    };
    res.json(response);
  } catch (err) {
    res.send({ message: "Failed to update vendor items" });
  }
});
app.post("/vendorremove", async (req, res) => {
  const data = req.body;
  const item = data[0];
  const vendorId = data[1];
  console.log(item.itemName, vendorId);
  try {
    const updatedVendor = await VendorItems.findByIdAndUpdate(
      vendorId,
      { $pull: { items: { itemName: item.itemName } } },
      { new: true }
    );
    console.log(updatedVendor);
    const response = {
      data: updatedVendor.items,
      alert: "Item Removed",
    };
    res.json(response);
  } catch (err) {
    res.send({ message: "Failed to update vendor items" });
  }
});
app.post("/removeTransaction", async (req, res) => {
  const transaction = req.body;
  await TransactionList.deleteOne({ _id: transaction._id });
  res.send({ message: "Transaction removed" });
});

app.get("/vendorsList", async (req, res) => {
  const data = await VendorItems.find({});
  res.send(data);
});
app.post("/vendorItems", async (req, res) => {
  const vendor = req.body;
  const data = await VendorItems.findOne({ _id: vendor._id });
  console.log(data);
  res.send(data);
});
app.post("/placeOrder", (req, res) => {
  const data = req.body;
  const trans = data[0];
  const student = data[1];
  var totalPrice = 0;
  trans.forEach((item) => {
    totalPrice += parseInt(item[2]);
  });
  const newTransaction = new TransactionList({
    studentId: student._id,
    vendorId: trans[0][0],
    items: [trans],
    total: totalPrice,
    status: false,
  });
  console.log(trans);
  newTransaction.save().then(() => {
    res.send({ message: "Finish the transaction by scanning the QR" });
  });
});
app.post("/studentTransactionsPending", async (req, res) => {
  const student = req.body;
  const data = await TransactionList.find({
    studentId: student._id,
    status: false,
  });
  res.send(data);
  console.log("transactions: ", data);
});
app.post("/studentTransactionsCompleted", async (req, res) => {
  const student = req.body;
  const data = await TransactionList.find({
    studentId: student._id,
    status: true,
  });
  res.send(data);
  console.log("transactions: ", data);
});
app.post("/vendorTransactionsPending", async (req, res) => {
  const vendor = req.body;
  const data = await TransactionList.find({
    vendorId: vendor._id,
    status: false,
  });
  res.send(data);
  console.log("transactions: ", data);
});
app.post("/vendorTransactionsCompleted", async (req, res) => {
  const vendor = req.body;
  const data = await TransactionList.find({
    vendorId: vendor._id,
    status: true,
  });
  res.send(data);
  console.log("transactions: ", data);
});
app.post("/checkTransaction", async (req, res) => {
  const data = req.body;
  const result = data[0];
  const transaction = data[1];
  const student = data[2];
  console.log("DATA :", result);
  const trans = await TransactionList.findOne({ _id: result });
  if (trans) {
    if (student._id === trans.studentId) {
      await TransactionList.findByIdAndUpdate(
        trans._id,
        { status: true },
        { new: true }
      );
      await StudentItems.findByIdAndUpdate(
        student._id,
        {
          $inc: { balance: -trans.total },
        },
        { new: true }
      );
    }
  }
  res.send({ message: "Order Completed!" });
});

app.listen(9000, () => {
  console.log("Server started at 9000");
});
