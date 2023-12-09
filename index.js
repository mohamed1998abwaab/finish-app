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
const { error } = require('console');
const { emitWarning } = require('process');
app.use(express.static(path.join(__dirname,"images")))
//yUxpIMoLyAUDqc67
var url1="mongodb+srv://Mahdi:mahdi@cluster0.7v8ud.mongodb.net/mahdi?retryWrites=true&w=majority"
var url="mongodb+srv://mahdi:mahdi@cluster0.3lvnvig.mongodb.net/mahdi?retryWrites=true&w=majority";
var databsae;
var nameImage='';

mongo.connect(url1,{useNewUrlParser:true,useUnifiedTopology:true},
     function(err, db) {
    if (err) throw err;   
      console.log(" conected database successfuly ...");
  });  
////////////////////////////////////////////////////////////////////////////////////
 // الشركه لحفظ البيانات

 var sch={
    title_pro: String,
    imag_pro:String ,
    price_cash_pro:Number,
    price_installments_pro:Number
}
  const mongomodel = new mongo.model('product',sch);
//upload images

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,"./images"))
  },
  filename:(req,file,cb)=>{
    nameImage=file.originalname;
    cb(null,file.originalname);
    nameImage=file.originalname;
    console.log('http://localhost:9000/'+nameImage);
    //print(nameImage);

  }  

});
const upload=multer({storage});



app.post('/image',upload.single("imag_pro"),async (req,res)=>{
  res.status(200).json({message:"image uploaded "})});
 

//********************************** */



 app.get('/data',async (req,res,next)=>{
  fetchid=req.params.id  ;
  mongomodel.find(({id:fetchid}),(err,val)=>{
  if(err) throw err;
  res.send(val);
  })});


  app.post('/post',upload.single("imag_pro"),async(req,res)=>{
    
    if(res.status==404){
      console.log(error)
    }else{
      try{
        if(nameImage!=null){
      console.log("inside post function "+'  http://localhost:9000/'+nameImage);  
     await res.status(200).json({message:"image uploaded "})
      const data= await new mongomodel({
        title_pro:req.body.name,
        imag_pro:'http://localhost:/'+nameImage,
        price_cash_pro:req.body.price,
        price_installments_pro:req.body.count,
       
      });
      const value =await data.save();
      await res.json(value);
      console.log(req.body);
      console.log('http://localhost:9000/'+nameImage);

    }
    }catch(e){
      console.log(e);
    }
    }
  
  });
  app.put('/update/:id',async(req,res,next)=>{
    const ID=req.params.id;
    const newData={
      name:req.body.name,
      price:req.body.price,
      count:req.body.count,
      decsription:req.body.decsription,
      image:req.body.image
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
///////////////////////////////////////////////////////////////////////////////////////



app.listen(3000,async ()=>{
  console.log(" conected on port 3000... http://localhost:3000");
});



//

