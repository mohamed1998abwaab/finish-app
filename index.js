/////

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
app.use(express.static(path.join(__dirname,"images")))
var url="mongodb+srv://mahdi:mahdi@cluster0.3lvnvig.mongodb.net/mahdi?retryWrites=true&w=majority";
var databsae;
var image_url;

mongo.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},
     function(err, db) {
    if (err) throw err;   
      console.log(" conected database successfuly ...");
    

   
  });
  var sch={
    title_pro: String,
    imag_pro:String ,
    price_cash_pro:Number,
    price_installments_pro:Number
}
  const mongomodel = new mongo.model('product',sch);
  ///

  var users={
    thing_name:String ,
    username:String,
    phone_number:Number,
    address:String,
    price:Number,
    payment:Number,
    remain:Number

  }
  const mongoUser=new mongo.model("users",users);
/////upload image
var nameImage='';

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,"./images"))
  },
  filename:(req,file,cb)=>{
    nameImage=file.originalname;
    cb(null,file.originalname);
    nameImage=file.originalname;
  }  
});
const upload=multer({storage});
app.post('/image',upload.single("image"),async (req,res)=>{
  res.status(200).json({message:"image uploaded "})});
///////end
//get 
app.get('/data',(req,res,next)=>{
fetchid=req.params.id  ;
mongomodel.find(({id:fetchid}),(err,val)=>{
if(err) throw err;
res.send(val);
})
  
});

////////////////get item one from page view 
app.get('/data/:id',(req,res,next)=>{

  mongomodel.findById(req.params.id)
  .then(
    (mongomodel)=>{
      if(!mongomodel){return res.status(404).send();}
      res.send(mongomodel);
    }
  )
  .catch((err)=>{res.status(500).send(err);});
});
/////////////////////////////////



//post
  app.post('/post',upload.single("imag_pro"),async(req,res)=>{
    
    if(res.status==404){
      console.log(error)
    }else{
      try{
        if(nameImage!=null){
      console.log("inside post function ");  
     await res.status(200).json({message:"image uploaded "})
      const data= await new mongomodel({
           title_pro:req.body.title_pro,
                  imag_pro:'https://last-version-finish-app.onrender.com/'+nameImage,
                  price_cash_pro:req.body.price_cash_pro,
                  price_installments_pro:req.body.price_installments_pro
     
      });
      const value =await data.save();
      await res.json(value);
      console.log(req.body);
    }
    }catch(e){
      console.log(e);
    }
    }
  });
//**********************************************************
///////////////another get from users
app.get('/data_users',(req,res,next)=>{
  fetchid=req.params.id  ;
  mongoUser.find(({id:fetchid}),(err,val)=>{
  if(err) throw err;
  res.send(val);
  })
    
  });

////////////////get one user after press at name user

app.get('/information_user/:id',(req,res,next)=>{

  mongoUser.findById(req.params.id)
  .then(
    (mongoUser)=>{
      if(!mongoUser){return res.status(404).send();}
      res.send(mongoUser);
    }
  )
  .catch((err)=>{res.status(500).send(err);});
});
/////////search user by name
app.get('/info_user/:username',(req,res,next)=>{

  mongoUser.find({username:req.params.username})
  .then(
    (mongoUser)=>{
      if(!mongoUser){return res.status(404).send();}
      res.send(mongoUser);
    }
  )
  .catch((err)=>{res.status(500).send(err);});
});

////////////another post to users

app.post('/post_users',async(req,res)=>{
  console.log("inside post function ");

  const data=new mongoUser({
    thing_name:req.body.thing_name,
    username:req.body.username,
    phone_number:req.body.phone_number,
    address:req.body.address,
    price:req.body.price,
    payment:req.body.payment,
    remain:req.body.remain
  });
  const value =await data.save();
  res.json(value);
  console.log(req.body);
});
//////update price for user 
app.put('/update_price_user/:id',async(req,res,next)=>{
  const ID=req.params.id;
  const newData={
    thing_name:req.body.thing_name,
    username:req.body.username,
    phone_number:req.body.phone_number,
    address:req.body.address,
    price:req.body.price,
    payment:req.body.payment,
    remain:req.body.remain
}
const result=await mongoUser.findOneAndReplace({_id:ID}
  ,newData);
console.log(result);
res.json({updatedCount : result.modifiedCount});
//res.send(req.body);

}
);

//delete
app.delete('/delete/:id',async(req,res)=>{
  
  const ID=req.params.id;
  const result=await mongomodel.deleteOne({_id:ID});
  res.json({deletedCount:result.deletedCount})

});

//update
app.put('/update/:id',async(req,res,next)=>{
const ID=req.params.id;
const newData={
    title_pro:req.body.title_pro,
    imag_pro:req.body.imag_pro,
    price_cash_pro:req.body.price_cash_pro,
    price_installments_pro:req.body.price_installments_pro
}
const result=await mongomodel.findOneAndReplace({_id:ID},newData);
console.log(result);
res.json({updatedCount : result.modifiedCount});

});


app.listen(3000,()=>{
    console.log(" conected on port 3000... http://localhost:3000");
});

