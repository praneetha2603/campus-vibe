require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const mysql = require('mysql2/promise');
const dayjs = require('dayjs');
const app = express();
const port = process.env.PORT || 5002;

const pool = mysql.createPool({
  connectionLimit: 2,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'frontend', 'views'));
app.use(ejsLayouts);
app.set("layout","main_layout");
app.use('/', require('./event.js'));
app.use('/', require('./login.js'));
app.use('/', require('./basic.js'));




app.get('/', (request, response) => {
    response.redirect('/login');
});

/*function deletetuple(){
    checkingDate();
    setInterval(checkingDate, 60000);
}
*/


async function checkingDate(){
    const query = `select * from event`;
    const now = dayjs();
    try {
        const [ eventDetails ] = await pool.query(query);
        eventDetails.forEach( async (event)=>{
            const dateTime = dayjs(event.Date_And_Time);
            if(dateTime.isBefore(now)){
                const deleteQuery = `delete from event where Event_ID = ?`;
                await pool.query(deleteQuery , [ event.Event_ID ]);
            }
        });
        const updateEventId = `CALL AutoIncrementEventID();`;
        await pool.query(updateEventId);
    } catch (error) {
        console.log(error.message);
    }
}

app.get('/*',(request,response)=>{
    response.status(404).render('pageNotFound' , { layout : false });
});


//deletetuple();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
