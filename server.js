
// ROUND 2 Submission for STABLX INTERNSHIP<br>
// Name:Tejas Shirnalkar
// EmailId: tejas.shirnalkar@gmail.com
// Phone:7972228649
//
// description:Run the server.js file in terminal in the console you should see the scrapped data with
//              page rank
//              website page
//              app name
//              Description
//              Download URL of the app
// Now visit the http://localhost:3000/ and click the download button to download the .csv File of scrap Data


const express = require('express');
 var app = express();
 const bodyParser = require('body-parser')
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }))
 app.set("view engine", "ejs");
const axios = require('axios');
const cheerio = require('cheerio');
const colors = require('colors');
 const fs = require('fs');
 const path = require('path')
 // Write our data in CSV file with name APP_final
 const writeStream = fs.createWriteStream('./File/APP_final.csv');


// Home page
 app.get('/',(req,res)=>{
  res.render('index');
 });


//SET header for csv File
 writeStream.write('Application name,Description,Application Url,Rank,Page.no \n');
//scrap all 15 app from 6 pages=90 apps
for (let j = 1; j < 7; j++) {
    const url ="https://alternativeto.net/platform/windows/?p="+j;
    axios.get(url).then((response) => {
        const $ = cheerio.load(response.data);
        const header = $('div.app-header');
        const desc = $('span.description');
        const linkref = $('h2.h2');
        console.log("page"+j);
        for (let i = 0; i < header.length; i++) {
            const title = $(header[i]).find('h2.h2');
            const link = $(linkref[i]).find('a').attr("href")
            const description = $(desc[i]).find('span.server-rendered-content');
            if (title) {
                const headerText ="App Name:"+ $(title).text();
                const descriptionText ="Description:"+$(description).text();
                const linkText="App URL: https://alternativeto.net"+link;
                const Rank ="Page Rank:"+(i+1);
                const pagination ="Website Page No:"+j;

                console.log(Rank.magenta);
                console.log(pagination.cyan);
                console.log(headerText.green);
                console.log(descriptionText.yellow);
                console.log(linkText);
                writeStream.write(`${headerText}, ${descriptionText},${linkText},${Rank},${pagination} \n`);

            }
        }
    });
}



//scrap first 10 apps from page 7  total:90+10=100Apps
     const url ="https://alternativeto.net/platform/windows/?p=7";
     axios.get(url).then((response) => {
         const $ = cheerio.load(response.data);
         const header = $('div.app-header');
         const desc = $('span.description');
         const linkref = $('h2.h2');
         console.log("last page".yellow);
         for (let i = 0; i < 10; i++) {
             const title = $(header[i]).find('h2.h2');
             const link = $(linkref[i]).find('a').attr("href")
             const description = $(desc[i]).find('span.server-rendered-content');
             if (title) {
                 const headerText ="App Name:"+ $(title).text();
                 const descriptionText ="Description:"+$(description).text();
                 const linkText="App URL: https://alternativeto.net"+link;
                 const Rank ="Page Rank:"+(i+1);
                 const pagination ="Website Page No:7"

                 console.log(Rank.magenta);
                 console.log(pagination.cyan);
                 console.log(headerText.green);
                 console.log(descriptionText.yellow);
                 console.log(linkText);
                 writeStream.write(`${headerText}, ${descriptionText},${linkText},${Rank},${pagination} \n`);

             }
         }
     });

// Download the csv file from directory
 app.get('/download',(req, res) => {

     var file = 'APP_final.csv';
     var fileLocation = path.join('./File',file);
     console.log(fileLocation);
     res.download(fileLocation, file);

 });


 app.listen(process.env.PORT||3000, process.env.IP, function(){
  console.log("USER YOUR SERVER HAS STARTED");
 });

