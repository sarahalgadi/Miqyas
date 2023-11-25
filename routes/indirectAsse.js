//import modules 
var express = require('express');
const multer = require('multer');
const mysql = require('miqyasdb'); ///db ****Check later***
const fs = require('fs');
const csvParser = require('csv-parser');
const { error } = require('console');

//express app 
const app = express();
// var router = express.Router();

//multer config. for the csv file upload
const upload = multer({ dest: 'uploads/' });

//Database connection configuration here : 


// file upload routing INSERT 
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        //read uploaded file 
        const filePath = req.file.path;
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', row => {
                data.push(row);
            })
            .on('end', async () => {
                //to store data in mySQL db ***RECHECK LATER***
                const connection = await
                    mysql.createConnection(dbConfig);
                //const qures here 
                const query = 'INSERT INTO indirect_assessment (CLONumber, NumNotSatisfied, NumBarelySatisfied, NumSatisfied, NumAdequetlySatisfied, NumFullySatisfied ) VALUES?';
                await connection.query(query, [data.map(Object.values)]);
                connection.end();

                //delete
                fs.unlinkSync(filePath);
                res.sendStatus(200); //approve deletion to user
            });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'something blew up' }); //error 
    }
});

//start the server 
app.listen(3000, () => {
    console.log('Server is running on port 3000');

});
