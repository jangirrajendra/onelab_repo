var mongoose = require('mongoose');
var Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;

 var ebayProductSchema = new Schema({
    "_id" : ObjectId,
   "productName" : [{
       type : String
   }],
   "productId" : [{
       type : String
   }

   ],
   "productPrice" : [{
    "@currencyId" : String,
    "__value__" : String
   }],
   "productUrl" : [{
       type : String
   }],
   "imageUrl" : [{
       type : String
   }],
   "created_at" : Date

}, { collection: 'ebay_products' });

var ebay_products = mongoose.model('ebay_products', ebayProductSchema);

// make this available to our users in our Node applications
module.exports = ebay_products;