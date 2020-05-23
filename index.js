// npm install express , su dung package express.
// npm install ejs , su dung view engine ejs.
// npm install body-parser, de su dung phuong thuc post.
const express = require('express');
const app = express();
//sử dụng body-parser.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
//các file dùng chung như js,css đặt trong thư mục public sẽ được public trên project.
app.use(express.static('./public'));
//sử dụng view engine tên là ejs.
app.set("view engine","ejs");
// khai báo thư mục chứ view có tên là "views".
app.set("views","./views");
//gán port.
const PORT = process.env.PORT || 5000
// run server.
app.listen(PORT,function(request,response){
    console.log("server is running with port 5000");
});
const mssql = require('mssql');
const config ={
    server:"210.245.95.62",
    user:"sa",
    password:"z@GH7ytQ",
    database:"T1911E_KitChenAppliances"
}
mssql.connect(config,function (err) {
    if(err) console.log(err);
});
var db = new mssql.Request();
app.get("/home",function (req,res) {
    db.query("SELECT * FROM Products;",function (err,rows) {
        if(err)res.send(err);
        else{
            var products = rows.recordset;
            res.render("home",{
                products: rows.recordset
            })
        }
    });
});
app.get("/products",function (request,response) {
    var queryString = "SELECT * FROM Products;";
    queryString+="SELECT * FROM Categories;"
    db.query(queryString,function (err,rows) {
        if(err) response.send(err);
        else {
            var products = rows.recordsets[0];
            var categories = rows.recordsets[1];
            var data ={
                categories:categories,
                products: products
            }
            response.render("products",data);
        }
    });
});
app.get("/products/category/:id",function (request,response) {
    const categoryId = request.params.id;
    var queryString = "SELECT * FROM Products WHERE CategoryID = "+categoryId+";";
    queryString+="SELECT * FROM Categories;"
    db.query(queryString,function (err,rows) {
        if(err) response.send(err);
        else {
            var products = rows.recordsets[0];
            var categories = rows.recordsets[1];
            var data ={
                categories:categories,
                products: products
            }
            response.render("products",data);
        }
    });
});
app.get("/detail/:id",function (request,response) {
    var productId = request.params.id;
    var queryString = "SELECT * FROM Products Where Id ="+"'"+productId+"';";
    queryString += "SELECT TOP 5 * FROM Products WHERE CategoryID IN (SELECT CategoryID FROM Products WHERE Id='"+productId+"');";
    db.query(queryString,function (err,rows) {
        if(err) response.send(err);
        else {
            const relateds =rows.recordsets[1];
            const product = rows.recordsets[0][0];
            const stringImages = product.Images;
            const listImage = stringImages.split(";");
            const data ={
                relateds:relateds,
                product: product,
                listImage:listImage
            }
            response.render("products-detail",data);
        }
    });
});

app.get("/contacts",function (req,res) {
    res.render('contacts');
});
app.get("/checkout",function (req,res) {
    res.render('checkout');
});
app.get("/payment",function (req,res) {
    res.render('payment');
});