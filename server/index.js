import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import cors from 'cors';
import dotenv from 'dotenv';
import sheetToJson from './xlsx-to-json.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only .xlsx is allowed.'), false);
        }
    }
});

app.post('/convert', upload.single('file'), (req, res) => {
    const workbook = XLSX.read(req.file.buffer, { cellStyles: true });
    const sheetNameList = workbook.SheetNames;
    const jsons = sheetNameList.map(sheetName => sheetToJson(workbook.Sheets[sheetName]));
    res.json(jsons);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));