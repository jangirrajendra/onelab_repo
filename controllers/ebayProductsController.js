var ObjectId = require('mongodb').ObjectID;
var Ebay = require('ebay')
var ebay_products = require('../models/ebay_products');

exports.searchProductbyName = function(req, res){
    var totalData = [];
    


            var ebay = new Ebay({
                app_id: 'Rajendra-oneapps-PRD-15d74fc8f-bab154db'
            })
            var params = {
                'OPERATION-NAME': 'findItemsByKeywords'
            , 'keywords': 'Electronics' // specify your keyword here( which has to be searched at ebay)
            }
            ebay.get('finding', params, function (err, data) {
                if(err) {

                    console.log('error : ', err);
                    res.send( { status : 301, error : err});
                }
            else{
                    //console.log(data);
                    var findItemsByKeywordsResponse = data.findItemsByKeywordsResponse;
                    //res.send(findItemsByKeywordsResponse);
                    for(var i =0 ; i< findItemsByKeywordsResponse.length; i++){
                        var documents = findItemsByKeywordsResponse[i];
                        var searchResult = documents.searchResult;
                        //console.log('searchResult : ', searchResult);
                        for(var j=0; j< searchResult.length; j++){
                            var searchItem = searchResult[j];
                            console.log(' *****************searchItem********* : ', searchItem);
                            var item = searchItem.item;
                            for(var k= 0; k<item.length; k++){
                                var itemDetails = item[k];
                                console.log('***********************************************');
                                var sellingStatus = itemDetails.sellingStatus[0];
                                var currentPrice = sellingStatus.currentPrice[0];
                                


                                var prepareData =  {
                                    productName : itemDetails.title,
                                    productId: itemDetails.itemId,
                                    productPrice : currentPrice,
                                    productUrl : [itemDetails.viewItemURL],
                                    imageUrl : itemDetails.galleryURL
                                
                                }
                                totalData.push(prepareData);
                                var newebay_products = new ebay_products(prepareData);
                                var prodId = new ObjectId();
                                newebay_products._id = prodId;
                                console.log('*****products ******');
                                console.log(prepareData);
                                newebay_products.save(function(err){
                                    if(err){
                                        console.log('error : ', err);
                                    }
                                    else{
                                        console.log('Data Saved');
                                    }
                                })
                            }
                        }
                    }
                    
                    res.send({ status : 200, data : totalData});
            }
            })
      
            
}