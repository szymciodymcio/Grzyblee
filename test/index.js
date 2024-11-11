const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const app = express();


app.use(cookieParser());
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mushrooms",
});

db.connect(function (err) {
  if (err) {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  if(res.cookie("username") != null)
  {
    res.clearCookie("blur");
    res.clearCookie("username");
  }
  let page = fs.readFileSync("./html/index.html").toString();
  res.send(page);
});


app.get("/register", (req,res) =>{
  if(res.cookie("username") != null)
  {
    res.clearCookie("blur");
    res.clearCookie("username");
    res.clearCookie("grzybname");
  }

  let page = fs.readFileSync("./html/register.html").toString();
  res.send(page);
});

app.post("/register", (req,res) =>{
  let page = fs.readFileSync("./html/register.html").toString();
  let sql1 =  "INSERT INTO `users`(`id_user`, `username`, `login`, `password`, `score`) VALUES ('','" + req.body.nameuser +"','" + req.body.login + "','" + req.body.password +"','0')";
  let sql2 = "select * from users where username ='" + req.body.nameuser + "'";
  let sql3 = "select * from users where login ='" + req.body.login +"'";
  db.query(sql2, (err,result) =>{
    
    db.query(sql3, (err,result2) =>{
      if(result.length > 0 && result2.length == 0)
      {
        page = page.replace('<a style="visibility: hidden;">{{isregistered}}</a>', "<a class='registerFail'>Nazwa użytkownika jest już zajęta!</a>");
        res.send(page)
      }
      else if(result2.length > 0 && result.length == 0)
      {
        page = page.replace('<a style="visibility: hidden;">{{isregistered}}</a>', "<a class='registerFail'>Login jest już zajęty!</a>");
        res.send(page)
      }
      else if(result2.length > 0 && result.length > 0)
      {
        page = page.replace('<a style="visibility: hidden;">{{isregistered}}</a>', "<a class='registerFail'>Nazwa i login są już zajęte!</a>");
        res.send(page)
      }
      else{
        db.query(sql1, (err,result) =>{
          page = page.replace('<a style="visibility: hidden;">{{isregistered}}</a>', "<a class='registered'>Zarejestrowano!</a>");
          res.send(page)
      });
      }
    });
  });
});


app.get("/logged", (req,res) =>{
  res.clearCookie("grzybname");
    if(req.cookies.username.length > 0)
    {
      let sql = "select * from users where id_user = '" + req.cookies.username + "'";
      let page = fs.readFileSync("./html/logged.html").toString();
      
      db.query(sql, (err,result) =>{
        result.forEach(el => {
          page = page.replace("{{username}}", el['username']);
          res.send(page);  
        });
      })
    }
});


app.post("/logged", (req, res) => {
  res.clearCookie("grzybname");
  res.clearCookie("blur");
  let sql =
    "select * from users where login='" +
    req.body.login +
    "' and password ='" +
    req.body.password +
    "'";
  let answer = "";
  db.query(sql, (err, result) => {

    let page = "";
    if(result.length > 0)
    {
      result.forEach(el => {
        if(el['id_user'] != null)
        {
          res.cookie("username", el['id_user'].toString());
          page = fs.readFileSync("./html/logged.html").toString();
          page = page.replace("{{username}}", el['username']);
        }
        
        res.send(page);
      });
    }
    else{
      page = fs.readFileSync("./html/index.html").toString();
      page = page.replace('<a style="visibility: hidden;">{{badlogin}}</a>', '<h2 style="color: red;">Zły login!</h2>')
      res.send(page)
    }
  });
});

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
}

app.get("/easy", (req,res) =>{
  res.clearCookie("blur");
  res.cookie("blur", parseInt(1))
  let page = fs.readFileSync("./html/gra.html").toString();
  let sql = "select * from users where id_user ='" + req.cookies.username +"'";
  page = page.replace("{{gamemode}}", "/easy")

  let number = getRandomInt(1,16);

  db.query(sql, (err,result) =>{
    result.forEach(el => {
      let nazwa = el['username'] + ": " + el['score'] + " pkt.";
      page = page.replace("{{nazwa}}", nazwa);
      let sql2 = "select * from grzyby where poziom_trudnosci='25' and id_grzyba='" + number + "'";
      page = page.replace("{{odp}}", "");

      db.query(sql2, (err,result2) =>{
        result2.forEach(ell => {

          res.cookie("grzybname", ell['nazwa'].toString());
          page = page.replace("{{link}}", "zdjecia_grzybow/"+ell['img']);
          page = page.replace("'{{bluramount}}'", 1);
          page = page.replace("{{gamemode}}", "/easy")
          res.send(page);
        });
      });
    });
      
    });
  }) 

  app.post("/easy", (req,res) =>{
    res.cookie("blur", parseInt(req.cookies.blur) + 1);
    if(req.cookies.blur > 15)
    {
      let page = fs.readFileSync("./html/gameEnd.html").toString();
      let wynik = "select * from users where id_user ='" + req.cookies.username +"'";
      db.query(wynik, (err,result) =>{
        result.forEach(el => {
          page = page.replace("{{scoreamount}}", el['score']);
          res.send(page);
        });
      });
    }
    else{
    let page = fs.readFileSync("./html/gra.html").toString();
    let sql = "select * from users where id_user ='" + req.cookies.username +"'";
    
    let number = getRandomInt(1,16);

    if(req.cookies.grzybname == req.body.nazwaGrzyba)
      {
        
        page = page.replace("none", "good")
        page = page.replace("{{odp}}", "(" + req.cookies.grzybname + ")");
        let updatescore = "UPDATE users SET score=score+25 WHERE id_user='" +req.cookies.username + "'";
        db.query(updatescore, (err,result) =>{
          console.log(err);
        });
      }
      else{
       
        page = page.replace("none", "bad")
        page = page.replace("{{odp}}", "(" + req.cookies.grzybname + ")");
      }
    db.query(sql, (err,result) =>{
      result.forEach(el => {
        let nazwa = el['username'] + ": " + el['score'] + " pkt.";
       
        page = page.replace("{{nazwa}}", nazwa);
        let sql2 = "select * from grzyby where poziom_trudnosci='25' and id_grzyba='" + number + "'"; 
        db.query(sql2, (err,result2) =>{
          result2.forEach(ell => {
            res.cookie("grzybname", ell['nazwa'].toString());
            page = page.replace("{{link}}", "zdjecia_grzybow/"+ell['img']);
            page = page.replace("'{{bluramount}}'", req.cookies.blur);
            page = page.replace("{{gamemode}}", "/easy")
            res.send(page);
          });
        });
      });
        
      });
  }
});



app.get("/medium", (req,res) =>{
  res.clearCookie("blur");
  res.cookie("blur", parseInt(1))
  let page = fs.readFileSync("./html/gra.html").toString();
  let sql = "select * from users where id_user ='" + req.cookies.username +"'";
  page = page.replace("{{gamemode}}", "/medium")
  page = page.replace("{{odp}}", "");
  
  let number = getRandomInt(16,31);
  
  db.query(sql, (err,result) =>{
    result.forEach(el => {
      
      let nazwa = el['username'] + ": " + el['score'] + " pkt.";
      
      page = page.replace("{{nazwa}}", nazwa);
      let sql2 = "select * from grzyby where poziom_trudnosci='50' and id_grzyba='" + number + "'";

      db.query(sql2, (err,result2) =>{
        result2.forEach(ell => {
          
          res.cookie("grzybname", ell['nazwa'].toString());
          page = page.replace("{{link}}", "zdjecia_grzybow/"+ell['img']);
          page = page.replace("'{{bluramount}}'", 1);
          page = page.replace("{{gamemode}}", "/medium")
          res.send(page);
        });
      });
    });
      
    });
});


app.get("/hard", (req,res) =>{
  res.clearCookie("blur");
  res.cookie("blur", parseInt(1))
  let page = fs.readFileSync("./html/gra.html").toString();
  let sql = "select * from users where id_user ='" + req.cookies.username +"'";
  page = page.replace("{{gamemode}}", "/hard")
  page = page.replace("{{odp}}", "");
 
  let number = getRandomInt(31,43);

  db.query(sql, (err,result) =>{
    result.forEach(el => {

      let nazwa = el['username'] + ": " + el['score'] + " pkt.";

      page = page.replace("{{nazwa}}", nazwa);
      let sql2 = "select * from grzyby where poziom_trudnosci='100' and id_grzyba='" + number + "'";

      db.query(sql2, (err,result2) =>{
        result2.forEach(ell => {

          res.cookie("grzybname", ell['nazwa'].toString());
          page = page.replace("{{link}}", "zdjecia_grzybow/"+ell['img']);
          page = page.replace("'{{bluramount}}'", 1);
          page = page.replace("{{gamemode}}", "/hard")
          res.send(page);
        });
      });
    });
      
    });


});

app.post("/medium", (req,res) =>{
  res.cookie("blur", parseInt(req.cookies.blur) + 1);
  if(req.cookies.blur > 15)
  {
    let page = fs.readFileSync("./html/gameEnd.html").toString();
    let wynik = "select * from users where id_user ='" + req.cookies.username +"'";
    db.query(wynik, (err,result) =>{
      result.forEach(el => {
        page = page.replace("{{scoreamount}}", el['score']);
        res.send(page);
      });
    });
  }
  else{
  let page = fs.readFileSync("./html/gra.html").toString();
  let sql = "select * from users where id_user ='" + req.cookies.username +"'";

  let number = getRandomInt(16,31);

  if(req.cookies.grzybname == req.body.nazwaGrzyba)
    {
      //document.getElementById("userScore").style.color = "green";
      page = page.replace("none", "good")
      page = page.replace("{{odp}}", "(" + req.cookies.grzybname + ")");
      let updatescore = "UPDATE users SET score=score+50 WHERE id_user='" +req.cookies.username + "'";
      db.query(updatescore, (err,result) =>{
        console.log(err);
      });
    }
    else{
      
      page = page.replace("none", "bad")
      page = page.replace("{{odp}}", "(" + req.cookies.grzybname + ")");
    }
  db.query(sql, (err,result) =>{
    result.forEach(el => {
      let nazwa = el['username'] + ": " + el['score'] + " pkt.";
  
      page = page.replace("{{nazwa}}", nazwa);
      let sql2 = "select * from grzyby where poziom_trudnosci='50' and id_grzyba='" + number + "'"; 
      db.query(sql2, (err,result2) =>{
        result2.forEach(ell => {
        
          res.cookie("grzybname", ell['nazwa'].toString());
          page = page.replace("{{link}}", "zdjecia_grzybow/"+ell['img']);
          page = page.replace("'{{bluramount}}'", req.cookies.blur);
          page = page.replace("{{gamemode}}", "/medium")
          res.send(page);
        });
      });
    });
      
    });
}
});

app.post("/hard", (req,res) =>{
  res.cookie("blur", parseInt(req.cookies.blur) + 1);
  if(req.cookies.blur > 15)
  {
    let page = fs.readFileSync("./html/gameEnd.html").toString();
    let wynik = "select * from users where id_user ='" + req.cookies.username +"'";
    db.query(wynik, (err,result) =>{
      result.forEach(el => {
        page = page.replace("{{scoreamount}}", el['score']);
        res.send(page);
      });
    });
  }
  else{
  let page = fs.readFileSync("./html/gra.html").toString();
  let sql = "select * from users where id_user ='" + req.cookies.username +"'";

  let number = getRandomInt(31,43);

  if(req.cookies.grzybname == req.body.nazwaGrzyba)
    {
      //document.getElementById("userScore").style.color = "green";
      page = page.replace("none", "good")
      page = page.replace("{{odp}}", "(" + req.cookies.grzybname + ")");
      let updatescore = "UPDATE users SET score=score+100 WHERE id_user='" +req.cookies.username + "'";
      db.query(updatescore, (err,result) =>{
        console.log(err);
      });
    }
    else{
      //document.getElementById("userScore").style.color = "red";
      page = page.replace("none", "bad")
      page = page.replace("{{odp}}", "(" + req.cookies.grzybname + ")");
    }
  db.query(sql, (err,result) =>{
    result.forEach(el => {
      let nazwa = el['username'] + ": " + el['score'] + " pkt.";
      page = page.replace("{{nazwa}}", nazwa);
      let sql2 = "select * from grzyby where poziom_trudnosci='100' and id_grzyba='" + number + "'"; 
      db.query(sql2, (err,result2) =>{
        result2.forEach(ell => {
          res.cookie("grzybname", ell['nazwa'].toString());
          page = page.replace("{{link}}", "zdjecia_grzybow/"+ell['img']);
          page = page.replace("'{{bluramount}}'", req.cookies.blur);
          page = page.replace("{{gamemode}}", "/hard")
          res.send(page);
        });
      });
    });
      
    });
}
});




app.listen(8000, (err) => {
  console.log(err);
});
