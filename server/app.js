// modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const multer = require("multer");
const imageKit = require("imagekit");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

// init
const app = express();
const port = process.env.PORT || 5000;
const uploadMulter = multer();

// control cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionSuccessStatus: 200,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// imagekit authentication
const imagekit = new imageKit({
  publicKey: process.env.IK_PL_KEY,
  privateKey: process.env.IK_PV_KEY,
  urlEndpoint: `https://ik.imagekit.io/` + process.env.IK_ID,
});

// upload image to imagekit
const uploadToIK = async (req, res) => {
  let fieldName = req.file.fieldname.replace("Img", "");

  switch (fieldName) {
    case "user":
      fieldName = "users";
      break;
    case "note":
      fieldName = "notes";
      break;
    default:
      fieldName = "";
  }

  imagekit
    .upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `notez/${fieldName}`,
    })
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
};

// verify token from client
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access!" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "Forbidden access!" });
    }

    req.decoded = decoded;

    next();
  });
};

// mongodb config
const mdbClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async (_) => {
  try {
    const users = mdbClient.db("notez").collection("users");

    // upload user image
    app.post("/users/upload", uploadMulter.single("userImg"), uploadToIK);

    // test mongodb connection
    mdbClient
      .db("admin")
      .command({ ping: 1 })
      .then((_) => console.log("Successfully connected to MongoDB!"));
  } catch (err) {
    console.log("Did not connect to MongoDB! " + err.message);
  } finally {
    // await mdbClient.close();
  }
})();

// get jwt token
app.post("/jwt", (req, res) => {
  const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.send(token);
});

// check api running or not
app.get("/", (req, res) => {
  res.send("Notez is running...");
});

app.listen(port, (_) => {
  console.log(`Notez API is running on port: ${port}`);
});
