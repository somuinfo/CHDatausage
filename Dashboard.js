// Load the http module to create an http server. 
var http = require('http');
var url = require("url");
var fs = require("fs");
var qs = require('querystring');
 // Create a function to handle every HTTP request 
function handler(request, response) {
    /*
     res.setHeader('Content-Type', 'text/html'); 
     res.writeHead(200); 
     res.end("<html><head><script type='text\\javascript' src='~/d3.min.js'></script></head><body><h1>Hello</h1></body></html>");
     */
     var pathname = url.parse(request.url).pathname;
     console.log("Request for " + pathname + " received.");

     response.writeHead(200);

     if (pathname == "/") {
         html = fs.readFileSync("Dashboard.html", "utf8");
         response.write(html);
         response.end();
     } else if (pathname == "/d3.min.js") {
         script = fs.readFileSync("d3.min.js", "utf8");
         response.write(script);
         response.end();
     }
     else if (pathname == "/jquery-2.1.4.min.js") {
         script = fs.readFileSync("jquery-2.1.4.min.js", "utf8");
         response.write(script);
         response.end();
     }
     else if (pathname.indexOf("/getCustomerData") > -1) {
         response.writeHead(200, { 'Content-Type': 'application/json' });
         var str = request.url.split('?')[1];
         getCustomerData(str,function (err, rows) {
             if (err) {
                 // do something with the error
             } else {
                 console.log(rows);
                 response.write(rows);
                 response.end();
             }
         });

     }

     
     
 }; 
 
getCustomerData = function (str, cb) {

    if (str.indexOf("=") != -1) {
        arrargs = str.split("&");
        if (arrargs.length > 1) {
            arrname = arrargs[0].split("=")[1];
            arrtype = arrargs[1].split("=");
            query("select t1.c1 as x, count(t1.c2) as y from (select cum.cust_id c2,  case when (cum.totalusage/c.usage_limit )*100 < 70 then 70 else 100 end c1 from  customers c join cust_usage_master cum on c.cust_id = cum.cust_id  ) t1 GROUP by t1.c1", cb)
        }
        else {
            str = str.substr(str.indexOf("=") + 1);
            query("SELECT concat(month(billcycledate) , '/',  year(billcycledate)) as x, sum(totalusage)/1000 as y FROM cust_usage_master group by cust_id, billcycledate having billcycledate is not null and cust_id in (select cust_id from customers where cust_name = '" + str + "');", cb)
        }
    }
    
}

 
 // Create a server that invokes the `handler` function upon receiving a request 
 http.createServer(handler).listen(8000, function(err){ 
   if(err){ 
     console.log('Error starting http server'); 
   } else { 
     console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/"); 
   }; 
 }); 


 function query(queryString, cb) {

     var mysql = require('mysql');
     var con = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         pwd: 'root',
         database: 'chdatausage'
     });

     var responseVal = '';
     var query = '';
     con.query(queryString, function (err, results, fields) {         
         if (err) return cb(err);
         cb(null,  JSON.stringify(results));

     });
     con.end();
     //console.log(responseVal);
     //return responseVal;

 };






















 // General function
 var dive = function (dir, action) {
     // Assert that it's a function
     if (typeof action !== "function")
         action = function (error, file) { };

     // Read the directory
     fs.readdir(dir, function (err, list) {
         // Return the error if something went wrong
         if (err)
             return action(err);
         console.log(dir);
         // For every file in the list
         list.forEach(function (file) {
             // Full path of that file
             path = dir + "/" + file;
             // Get the file's stats
             fs.stat(path, function (err, stat) {
                 console.log(stat);
                 // If the file is a directory
                 if (stat && stat.isDirectory())
                     // Dive into the directory
                     dive(path, action);
                 else {
                     // Call the action
                     //console.log(path);

                     processData(path);
                     //var source = fs.createReadStream(path);
                     //var dest = fs.createWriteStream('/backupfeed/xsdzsd.txt');

                     //source.pipe(dest);
                     //source.on('end', function () { /* copied */ });
                     //source.on('error', function (err) { /* error */ });

                 }
             });
         });
     });
 };
dive("Feed", null);
/*
 setInterval(function () {
     //processData("D:\\Feed\\\\DataUsageFeed20151029124200.txt")
     dive("Feed", null);
 }, 1000 * 1);
 */
 //processData("D:\\Feed\\\\DataUsageFeed20151029124200.txt");

 function processData(filename) {
     try {
         //var fs = require('fs');

         //fs.readFile('D:\\Feed\\DataUsageFeed20151029124200.txt', 'utf8', function (err, content) {
         //    if (err) {
         //        //var objErr = new Error(err);
         //        console.log(err);
         //    }
         //    else {
         //        var arrFeedLines = content.split(';');
         //        var Datas = [];
         //        var tempsql = "";
         //        for (var ind = 0; ind < arrFeedLines.length; ind++) {
         //            var arrFeedContent = arrFeedLines[ind].split('|');
         //            if (arrFeedLines[ind] != "") {
         //                Datas[ind] = [];
         //                console.log(arrFeedLines.length);
         //                for (var contentidx = 0; contentidx < arrFeedContent.length; contentidx++) {
         //                    if (arrFeedContent[contentidx] != "") {
         //                        Datas[ind][contentidx] = arrFeedContent[contentidx];
         //                        if (contentidx == arrFeedContent.length - 1)
         //                            tempsql = tempsql + arrFeedContent[contentidx];
         //                        else
         //                            tempsql = tempsql + arrFeedContent[contentidx] + ",";
         //                        console.log(Datas[ind][contentidx]);
         //                    }
         //                }
         //            }
         //        }
         //        console.log(Datas[0].length);

         //    }
         //});

         var mysql = require('mysql');
         var con = mysql.createConnection({
             host: 'localhost',
             user: 'root',
             pwd: 'root',
             database: 'chdatausage'
         });
         var post = {
             cust_id: "1001",
             device_id: "varchar(100)",
             website: "varchar(100)",
             usageinbytes: 10,
             usage_uploaded: 10,
             usage_downloaded: 10,
             session_starttime: '20151024124000',
             sesion_endtime: '20151024124000'
         };
         var post1 = { tmpcol: 1 };
         /*
         var sql = "insert into cust_feed SET ?";
         con.query(sql, [post], function (err, Result) {
             if (err) console.log(err);
             else
                 console.log("success");
             con.end();
         });
 */
         console.log("start");
         var sql = "LOAD DATA local INFILE '" + filename + "' INTO TABLE cust_feed FIELDS TERMINATED BY '|' LINES TERMINATED BY ';'";

         con.query(sql, "", function (err) {
             if (err) console.log(err);
             else {
                 console.log("success");

             }
             con.end();
         });

     }
     catch (Err) {
         alert(Err);
     }
 }