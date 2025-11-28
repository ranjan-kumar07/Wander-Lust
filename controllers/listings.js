const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res)=>{
    let allLists = await Listing.find({});
     res.render("listings/index.ejs",{allLists});
}

module.exports.renderNewForm = (req,res)=>{
    
     res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    
    if(!listings){
      req.flash("error","Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listings});
}

module.exports.createListing = async(req,res)=>{

    let response = await geocodingClient
     .forwardGeocode({
       query: req.body.listing.location,
       limit: 1,
         })
     .send();
     
     

    let url = req.file.path;
    let filename = req.file.filename;
    console.log("url:",url,"file:",filename);
  
    let newListings = new Listing(req.body.listing);
    newListings.owner = req.user._id;
    newListings.image = {url,filename};

    newListings.geometry = response.body.features[0].geometry;

    let data= await  newListings.save();
    console.log(data);

    req.flash("success","New Listing Created!");
    // console.log(newListings);
    res.redirect("/listings");

}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id);
     if(!listings){
      req.flash("error","Listing you requested for does not exist!");
       return res.redirect("/listings");
    }

    let ogImage = listings.image.url;
    ogImage = ogImage.replace("/upload", "/upload/h_200,w_250/e_blur:100");
    res.render("listings/edit.ejs",{listings,ogImage})
}

module.exports.updateListing  =async(req,res)=>{
     if(!req.body.listing){
        throw new ExpressError(400, "send some valid data for listings")
    }
    let {id} = req.params;
    

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=='undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image  = {url,filename};
    await listing.save();
    }
        req.flash("success"," Listing Updated!");

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let delData =await Listing.findByIdAndDelete(id)
        req.flash("success"," Listing Deleted!");

    console.log(delData);
    res.redirect("/listings");
}