// modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

// self verification
const verifySelf = async (req, res, next) => {
  if (req.decoded._id !== req.params.identifier)
    return res.status(403).send({ error: true, message: "Forbidden access!" });

  next();
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
    const categories = mdbClient.db("notez").collection("categories");
    const notes = mdbClient.db("notez").collection("notes");

    // upload user image
    app.post("/users/upload", uploadMulter.single("userImg"), uploadToIK);

    // upload note image
    app.post(
      "/notes/upload",
      verifyJWT,
      uploadMulter.single("noteImg"),
      uploadToIK
    );

    // get self categories
    app.get(
      "/self/categories/:identifier",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        let skip = 0,
          limit = 0;
        const query = { owner_id: req.params.identifier };

        if (req.query.count) {
          const countResult = await categories.countDocuments(query);

          return res.send({ total: countResult });
        } else if (req.query.page && req.query.limit) {
          let page = req.query.page;
          limit = +req.query.limit;
          skip = page * limit;
        }

        const cursor = categories
          .find(query)
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit);
        const result = await cursor.toArray();

        res.send(result);
      }
    );

    // new category
    app.post("/categories", verifyJWT, async (req, res) => {
      const category = req.body;
      const result = await categories.insertOne(category);

      res.send(result);
    });

    // update category
    app.put(
      "/self/categories/:identifier/:id",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await categories.updateOne(query, { $set: req.body });

        res.send(result);
      }
    );

    // delete category
    app.delete(
      "/self/categories/:identifier/:id",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await categories.deleteOne(query);

        res.send(result);
      }
    );

    // get self note
    app.get(
      "/self/notes/:identifier/:id",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = {
          _id: new ObjectId(req.params.id),
          owner_id: req.params.identifier,
        };
        const result = await notes.findOne(query);

        res.send(result);
      }
    );

    // get self notes
    app.get(
      "/self/notes/:identifier",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        let skip = 0,
          limit = 0,
          query = {};

        if (req.query.title) {
          query = {
            ...query,
            title: { $regex: req.query.title, $options: "i" },
          };
        }
        if (req.query.category && req.query.category !== "all")
          query = { ...query, category_id: req.query.category };

        query = { ...query, owner_id: req.params.identifier };

        if (req.query.count) {
          const countResult = await notes.countDocuments(query);

          return res.send({ total: countResult });
        } else if (req.query.page && req.query.limit) {
          let page = req.query.page;
          limit = +req.query.limit;
          skip = page * limit;
        }

        const cursor = notes
          .find(query)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit);
        const result = await cursor.toArray();

        res.send(result);
      }
    );

    // new note
    app.post("/notes", verifyJWT, async (req, res) => {
      const note = req.body;
      const result = await notes.insertOne(note);

      res.send(result);
    });

    // update note
    app.put(
      "/self/notes/:identifier/:id",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await notes.updateOne(query, { $set: req.body });

        res.send(result);
      }
    );

    // delete note
    app.delete(
      "/self/notes/:identifier/:id",
      verifyJWT,
      verifySelf,
      async (req, res) => {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await notes.deleteOne(query);

        res.send(result);
      }
    );

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
