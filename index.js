

//

const express=require('express');
const path=require('path');
const mongo=require("mongoose");
const app=express();
const params=require("params");
const bodyParser = require('body-parser');

const { resourceLimits } = require('worker_threads');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
const multer=require('multer');
app.use(express.static(path.join(__dirname,'images')));

//yUxpIMoLyAUDqc67
var url1="mongodb+srv://Mahdi:mahdi@cluster0.7v8ud.mongodb.net/mahdi?retryWrites=true&w=majority"
var url="mongodb+srv://mahdi:mahdi@cluster0.3lvnvig.mongodb.net/mahdi?retryWrites=true&w=majority";
var databsae;
var image_url;

mongo.connect(url1,{useNewUrlParser:true,useUnifiedTopology:true},
     function(err, db) {
    if (err) throw err;   
      console.log(" conected database successfuly ...");
  });///get item one from page view 

  var product={
    name :String,
    price:Number,
    count:Number,
    details:String,
    
   }
   const products=new mongo.model("products",product);
  
          ////upload iamge 
/*
       const storage= multer.diskStorage({
            destination:function(req,file,cb){
              cb(null,path.join(__dirname,"./images"))
            },
            filename(req,file,cb){
              cb(null,newData().replace(/:/g,'_')+file.originalname)
            }
          });

     const upload=multer({storage:storage});
*/

   app.get('/data',(req,res,next)=>{
    fetchid=req.params.id  ;
    products.find(({id:fetchid}),(err,val)=>{
    if(err) throw err;
    res.send(val);
    })});
  
  
    app.post('/post',upload.single('image') ,async(req,res)=>{
      console.log("inside post function ");
    
      const data=new products({
        name:req.body.name,
        price:req.body.price,
        count:req.body.count,
        decsription:req.body.decsription
      });
      const value =await data.save();
      res.json(value);
      console.log(req.body);
    });
  
    app.put('/update/:id',async(req,res,next)=>{
      const ID=req.params.id;
      const newData={
        name:req.body.name,
        price:req.body.price,
        count:req.body.count,
        details:req.body.details,
    }
    const result=await products.findOneAndReplace({_id:ID}
      ,newData);
    console.log(result);
    res.json({updatedCount : result.modifiedCount});
    });
  
    app.delete('/delete/:id',async(req,res)=>{
    
      const ID=req.params.id;
      const result=await products.deleteOne({_id:ID});
      res.json({deletedCount:result.deletedCount})
    
    });

    app.get('/data/:id',(req,res,next)=>{

      products.findById(req.params.id)
      .then(
        (products)=>{
          if(!products){return res.status(404).send();}
          res.send(products);
        }
      )
      .catch((err)=>{res.status(500).send(err);});
    });
    app.get('/data/:name',(req,res,next)=>{
          let name1=req.params.name;
      products.find({name:name1})
      .then(
        (products)=>{
          if(!products){return res.status(404).send();}
          res.send(products);
        }
      )
      .catch((err)=>{res.status(500).send(err);});
    });

    app.get('/data1/:name',(req,res,next)=>{

      products.findOne({name:req.params.name})
      .then(
        (products)=>{
          if(!products){return res.status(404).send();}
          res.send(products);
        }
      )
      .catch((err)=>{res.status(500).send(err);});
    });

    
    


app.listen(3000,()=>{
    console.log(" conected on port 3000... http://localhost:3000");
});
