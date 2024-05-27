import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { setupRoutes } from "./routes.js";
import { Data, connectToDatabase } from "./db.js";
import DataformatingforSheet from "./controllers/tripController.js";
config();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
connectToDatabase()
setupRoutes(app);
console.log("process.env.MONGO_URI",process.env.MONGO_URI);
console.log("SPREADSHEET_ID",process.env.SPREADSHEET_ID);
app.use("/test", (req, res) => {
  res.send("Hello world!");
});
app.delete("/deletedata/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id for deletion", id);

  try {
    let result = await Data.findOneAndUpdate(
      { "Data._id": id },
      { $set: { "Data.$.isDelete": true } }
    );
    console.log(result);
    res.status(200).send({ message: "Document deleted successfully" });
    DataformatingforSheet();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting document" });
  }
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const existingDocument = await Data.findOne({ "Data._id": id });
    if (!existingDocument) {
      console.log("Document not found for ID:", id);
      return res.status(404).json({ error: "Document not found" });
    }

    const dataIndex = existingDocument.Data.findIndex(
      (item) => item._id.toString() === id
    );
    if (dataIndex === -1) {
      console.log("Data not found for ID:", id);
      return res.status(404).json({ error: "Data not found" });
    }

    const updatedData = {
      ...existingDocument.Data[dataIndex],
      ...newData,
      Date: existingDocument.Data[dataIndex].Date,
      Day: existingDocument.Data[dataIndex].Day,
      SRNumber: existingDocument.Data[dataIndex].SRNumber || 2,
    };

    existingDocument.Data[dataIndex] = updatedData;
    DataformatingforSheet();
    const updatedDocument = await existingDocument.save();
    console.log("Updated document:", updatedDocument);

    return res.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
