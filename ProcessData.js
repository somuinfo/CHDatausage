processData();

function processData() {
    try {
        var fs = require('fs');

        fs.readFile('D:\\Feed\\DataUsageFeed20151029124200.txt', 'utf8', function (err, content) {
            if (err) {
                //var objErr = new Error(err);
                console.log(err);
            }
            else {
                var arrFeedLines = content.split(';');
                var Datas = [];
                var tempsql = "";
                for (var ind = 0; ind < arrFeedLines.length; ind++) {
                    var arrFeedContent = arrFeedLines[ind].split('|');
                    if (arrFeedLines[ind] != "") {
                        Datas[ind] = [];
                        console.log(arrFeedLines.length);
                        for (var contentidx = 0; contentidx < arrFeedContent.length; contentidx++) {
                            if (arrFeedContent[contentidx] != "") {
                                Datas[ind][contentidx] = arrFeedContent[contentidx];
                                if (contentidx == arrFeedContent.length - 1)
                                    tempsql = tempsql + arrFeedContent[contentidx];
                                else
                                    tempsql = tempsql + arrFeedContent[contentidx] + ",";
                                //console.log(Datas[ind][contentidx]);

                            }

                        }
                    }
                }
                console.log("bfr sql");
                //console.log(Datas[0].length);
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
            
                /*
                var sql = "insert into cust_feed(cust_id,device_id,website,usageinbytes,usage_uploaded,usage_downloaded,session_starttime,session_endtime) VALUES ?";
                con.query(sql, [Datas], function (err) {
                    if (err) console.log(err);
                    else
                        console.log("success");
                    con.end();
                });
                */
            }
        });

    }
    catch (Err) {
        alert(Err);
    }
}