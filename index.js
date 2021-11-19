const express=require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
 

const app=express();
app.set('view engine','ejs');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join('public', 'favicon.ico')));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql6.freemysqlhosting.net',
  user     : 'sql6452103',
  password : 'T35M1jHhlX',
  database : 'sql6452103'
});
 
connection.connect();

// app.get("/create",function (req,res){
//     var x= [`create table sayakbank(
//         Name varchar(20),
//         Email varchar(30),
//         Account_No numeric(20),
//         Phone_No numeric(10),
//         Balance numeric(15)
//         );`,`insert into sayakbank values
//         ('Swapan Halder','swapan@gmail.com', 123456789 , 9876543210 , 500000),
//         ('Bapan De','bapan@gmail.com', 123456788 , 9876543211 , 600000),
//         ('Tapan Rana','tapan@gmail.com', 123456787 , 9876543212 , 700000),
//         ('Sayan Roy','sayan@gmail.com', 123456786 , 9876543213 , 800000),
//         ('Nayan Misra','nayan68@gmail.com', 123456785 , 9876543214 , 900000),
//         ('Subhendu Das','bhendu2001@gmail.com', 123456784 , 9876543215 , 1000000),
//         ('Sekhar Pal','sekhar@gmail.com', 123456783 , 9876543216 , 1100000);`,`create table transac(
//             Receivers_acc numeric(20),
//             Senders_acc numeric(20),
//             Amount numeric(15)
//             );`]
        
//         x.forEach((q)=>{
//             connection.query(q);
//         })
// })

// app.get("/hehe",function (req,res){
//     var x="delete from transac where Senders_acc=758758;"
//     connection.query(x);
// })

app.get("/",function (req,res){
    res.render("index");
})

app.get("/aboutme",function (req,res){
    res.render("aboutme");
})

app.get("/customers",function (req,res){
    var users="select *from sayakbank;"
    connection.query(users,function(error,results,fields){
        if(!error)
        {
            res.render("customers",{results:results});
        }
        else{
            res.send("query error");
        }
    })
})

app.get("/transactions",function (req,res){
    var users="select *from transac;"
    connection.query(users,function(error,results,fields){
        if(!error)
        {
            res.render("transactions",{results:results});
        }
        else{
            res.send("query error");
        }
    })
})

app.get("/sendmoney", (req, res)=> {
    res.render("sendmoney",{msg:""});
})

app.post("/sendmoney",function (req,res){
    let {Sender,Receiver,Amount}=req.body;
    Sender=parseInt(Sender);
    Receiver=parseInt(Receiver);
    Amount=parseInt(Amount);
    console.log(Sender);
    console.log(Receiver);
    console.log(Amount);
    let query1=`update sayakbank set Balance=Balance-${Amount} where Account_No=${Sender}`
    connection.query(query1,function(error,results,fields){
        if(!error)
        {
            let query2=`update sayakbank set Balance=Balance+${Amount} where Account_No=${Receiver}`
            connection.query(query2,function(error,results,fields){
                if(!error)
                {
                     let query3=`insert into transac values(${Receiver},${Sender},${Amount});`
                     connection.query(query3,function(error,results,fields){
                         if(!error)
                         {
                             res.render("sendmoney",{msg:"Transaction successful"});
                         }
                         else{
                            res.render("sendmoney",{msg:"Transaction Unsuccessful"});
                         }
                     })
                }
                else{
                    res.render("sendmoney",{msg:"Transaction Unsuccessful"});
                }
            })
            // res.send(results);
        }
        else{
            res.render("sendmoney",{msg:"Transaction Unsuccessful"});
        }
    })
})

app.get("/viewbalance",function (req,res){
    res.render("viewbalance",{msg:""});
})



app.post("/viewbalance",function (req,res){
    let {sec}=req.body;
    sec=parseInt(sec);
    let query1=`select Balance from sayakbank where Account_No=${sec};`
    connection.query(query1,function (error,results,fields){
        if(!error)
        {
            res.render("viewbalance",{msg:`Your Balance is ${results[0].Balance}`});
        }
        else{
            console.log("Error Come back later");
            res.render("viewbalance",{msg:"Please Check Your Account No. or Come back Later"});
        }
    }) 
})

var port=process.env.PORT || '3000';

app.listen(port,()=>{
    console.log("Server at port 3000")
})

