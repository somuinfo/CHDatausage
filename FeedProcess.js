/*
setInterval(function () {
    processData("D:\\Feed\\\\DataUsageFeed20151029124200.txt")
}, 2000);
*/

var fs = require("fs");

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
//dive("Feed", null);

setInterval(function () {
    //processData("D:\\Feed\\\\DataUsageFeed20151029124200.txt")
    dive("Feed", null);
}, 1000 * 1 );

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