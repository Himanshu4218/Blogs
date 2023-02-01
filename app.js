var express=require("express");
var app=express();
var expressSanitizer=require("express-sanitizer");
var methodOverride=require("method-override")
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blog_server");

var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,default: Date.now}
});

var blog=mongoose.model("blog",blogSchema);

// blog.create({
//     title: "test blog",
//     image: "webimage.jpg",
//     body: "This is the test blog"
// },function(err,blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(blog);
//     }
// });

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blog/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,blogCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,blogFind){
            if(err){
                console.log(err);
            }else{
                res.render("show",{blog:blogFind});
            }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                res.redirect("/blogs");
            }else{
                res.render("edit",{blog:foundBlog})
            }
    });
});

app.put("/blogs/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
            if(err){
                console.log(err);
            }else{
                res.redirect("/blogs/"+req.params.id);
            }
    });
});
app.delete("/blogs/:id",function(req,res){
        blog.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/blogs");
            }else{
                res.redirect("/blogs");
            }
        });
});
app.listen(1100,process.env.IP,function(req,res){
    console.log("Server has started....");
});