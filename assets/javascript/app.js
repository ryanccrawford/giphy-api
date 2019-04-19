const PRODUCTION = false // to switch from https for production and to http for development
var gifCount = 0;
var apiKey = 'D3VKLzuXAaCof4EJI2yPxFYLWggvmHlG',
    currentOffset = 0,
    currentOffsetAdder = 10,
    searchterm,
    crurrentPage = 0,
    limit = 10
        qObj = function (_term, _apiKey = '', _rating = '', _limit = 0, _offset = 0) {
            
            return { 
                    api_key: _apiKey == '' ? apiKey : _apiKey,
                    q: _term,
                    limit: _limit > 0 ? _limit : 25,
                    offset: _offset,
                    rating: _rating 
                    }
        },
        metaResponseMsg = {
    200: 'OK Your request was successful.',
    400: 'Bad Request Your request was formatted incorrectly or missing required parameters.',
    403: 'Forbidden You weren \'t authorized to make your request; most likely this indicates an issue with your API Key.',
    404: 'Not Found The particular GIF you are requesting was not found.This occurs, for example, if you request a GIF by an id that does not exist.',
    429: 'Too Many Requests Your API Key is making too many requests.Read about requesting a Production Key to upgrade your API Key rate limits.'
        },
        endPoints = function () { //this object is used to create an endpoint to pass to the search function
                    return {
                    protocal: 'http://',
                    protocalSecure: 'https://',
                    host: 'api.giphy.com',
                    path: '/v1',
                    createEndpoint: function (_endpoint = '', _protocal = '', ) { // method to create endpoint based on 2 paramet
                            var p = _protocal == '' ? this.protocalSecure : _protocal,
                                h = this.host,
                                pt = this.path,
                                ep = _endpoint == '' ? this.search : _endpoint
                                return p + h + pt + ep
        
                    },
                    search: '/gifs/search', //GET Search Endpoint
                    trending: '/gifs/trending', // GET Trending GIFs Endpoint
                    randomid: '/randomid', // GET Random Id Endpoint
                    translate: '/gifs/translate',  // GET Translate Endpoint
                    random: '/gifs/random',  // GET Random Endpoint
                    gifid: function (gif_id) { return '/gifs/' + gif_id }, // { gif_id } GET Get GIF by ID Endpoint
                    gifs: '/gifs',  //GET Get GIFs by ID Endpoint
                    stickerSearch: '/stickers/search', //GET Sticker Search Endpoint
                    stickersTrending: '/stickers/trending', // GET Trending Stickers Endpoint
                    stickersTranslate: '/stickers/translate', // GET Sticker Translate Endpoint
                    stickersRandom: '/stickers/random' // GET  Random Sticker Endpoint
                    }
            }
        topics = [{name:'cameras',rating:'',currentPage:0},{name:'photos',rating:'',currentPage:0},{name:'polaroid',rating:'',currentPage:0}]
        ratings = {  'Y':'lightgreen', // this was used to give ratings a color 
                     'G': 'green',
                     'PG': 'darkgreen',
                     'PG-13':'yellow',
                     'R':'red'
                },
        textColors = {  'lightgreen' :'white', // this was used to convert text color to easy to read color based on background color
                'green': 'white',
                'darkgreen': 'white',
                'yellow':'black',
                'red':'white',
                'blue':'white'
                }
// init. when the page is loaded we can then start the app
$(document).ready(function () {
    clear()
    createTopics()
    
    $('#add').click(function (event) {
        event.preventDefault()
       var _name = $('#q').val()
       var _rating = $('#rating').val()
       if(_rating === 'all'){
           _rating = '';
       }
        var newTopic = {name: _name, rating: _rating, currentPage:0}
        topics.push(newTopic)
        createTopics()
    })
    $('.sharpie-back').click(function(event){
        if($(event.target).children('a')){
            event.preventDefault()
        }

    })
   
    
   

})
// creates the topic buttons that are added to the page
function createTopics(){   
    $('#topics').empty()
    var topicsLength = topics.length
    for(let i=0; i < topicsLength; i++){
        var topicButton = $('<button>')   
        $(topicButton).addClass('topicButton')
        $(topicButton).addClass('btn')
        $(topicButton).data({'currentPage':0})
        $(topicButton).data({'rating': topics[i].rating })
        $(topicButton).css({'background-color':'white', color: 'black'})
        $(topicButton).data({'name':topics[i].name})
        $(topicButton).addClass('ml-1')
        $(topicButton).text(topics[i].name.toUpperCase())
        var span = $('<span>')
        $(span).html('<span> </span><i class="far fa-times-circle"></i>')
        $(span).click(function (event) {
            event.preventDefault()
            
            q = $(event.target.parentNode.parentNode)
            $(q).remove();
            
        })
        $(topicButton).append(span)
        $(topicButton).click(function (event) {
            event.preventDefault()
            var q = '',
                rating = ''
            
            rating = $(event.target).data('rating')
            
            q = $(event.target).data('name')
            currentPage = $(event.target).data('currentPage')
            if(rating == 'all'){
                rating = ''
            }
        
            search(q,rating,currentPage)
        
        })
        $('#topics').append(topicButton)
    }
}
// Clears the screen and resets the gif counter
function clear(){
    $('#img-cards').empty()
    $('#topics').empty()
    gifCount = 0
 }
 // This function creates the gif card using jquery
function createCard(_gifObj, _title, _text, _link){

    var card = $('<div>'),
        cardImg = $('<img>'),
        carBody = $('<div>'),
        cardTitle = $('<h4>'),
        cardText = $('<p>'),
        imageLink = $('<a>')
    $(imageLink).attr('href', _link)
    $(card).addClass('card')
    $(cardImg).attr('src', _gifObj.still).addClass('card-img-top')
    var color = ratings[_gifObj.rating] 
 
    var textColor = textColors[color]
    $(carBody).addClass('card-body')
    $(carBody).css({'background-color':color})
    $(carBody).css({'color':textColor})
    $(cardTitle).addClass('card-title').text(_title)
    $(imageLink).append(cardTitle)
    if (_text != '') {
        $(cardText).addClass('card-text').text(_text)
        $(carBody).append(cardTitle).append(cardText)
    }
    return  $(card).append(cardImg).append(carBody)
}
// This function creates the polaroid gif using jquery
function createPhoto(_gifObj, _title, _text, _link, _rating){
//     <div class="flip-photo">

var photoFlip = $('<div>')
$(photoFlip).addClass('flip-photo').addClass('col-m-4').attr('id','photo_'+gifCount.toString())
    //     <div class="flip-photo-inner">

    var photoFrame = $('<div>')
    $(photoFrame).addClass('flip-photo-inner')
            //       <div class="flip-photo-front">
        var photoFront = $('<div>')
        $(photoFront).addClass('flip-photo-front')
            //           <img src="assets/images/picture_blank_alpha.png" alt="front"  class="photo-front">
            var photoImg = $('<img>')
            $(photoImg).addClass('photo')
    $(photoImg).attr('src', _gifObj.still)
    $(photoImg).attr('data-still', _gifObj.still)
    $(photoImg).attr('data-animate', _gifObj.animated)
    photoImg.isAntimating = false
            var photoFrontImg = $('<img>')
        $(photoFrontImg).addClass('photo-front')
        $(photoFrontImg).attr('src', 'assets/images/picture_blank_alpha.gif')
            //         <img src="https://via.placeholder.com/200" alt="photo" class="photo">
      
            
            
    //         <div class="lable"><span class="sharpie">Title of Photo</span></div>
        var frameLable = $('<div>')
        $(frameLable).addClass('lable')
            var frameSpan = $('<span>')
            $(frameSpan).addClass('sharpie-front')
            $(frameSpan).text(_title)
        $(frameLable).append(frameSpan)
        $(photoFront).append(photoImg).append(photoFrontImg).append(frameLable)
    $(photoFrame).append(photoFront)
//       </div>
//       <div class="flip-photo-back photo-back">
var photoBack = $('<div>')
$(photoBack).addClass('flip-photo-back').addClass('photo-back')
//           <img src="assets/images/picture_blank_back.png" alt="back"  class="photo-back">

var photoBackImg = $('<img>')
$(photoBackImg).attr('src', 'assets/images/picture_blank_back.gif')
$(photoBackImg).addClass('photo-back')
$(photoBack).append(photoBackImg)
//         <h1 class="sharpie">Title</h1>
var backTitle = $('<h1>')
 $(backTitle).text(_title)
 $(backTitle).addClass('sharpie-back')
//         <p class="sharpie">Rating: G</p> 
var backRating = $('<p>')
$(backRating).text('Rating: '+_rating)
$(backRating).addClass('sharpie-back')

//<p class="sharpie">Download Now</p>
var backDwnLink = $('<p>')
$(backDwnLink).addClass('sharpie-back')
var dwnLink = $('<a>')
$(dwnLink).attr('href',_link)
$(dwnLink).text('Download Now')
$(backDwnLink).append(dwnLink)
//         
$(photoBack).append(backTitle).append(backRating).append(backDwnLink)
$(photoFrame).append(photoBack)
$(photoFlip).append(photoFrame)
   //attach a click event to the phptp to flip the card over, actually toggle the flip
        $(photoFlip).click(function(event){
            event.preventDefault()
            var target = event.target
            var photo = $(target).parents('.flip-photo')
            if(photo.length > 0){
                $(photo[0]).toggleClass('flip')
            }
        })
      
        // incrreases the photo counter so we can id the photos 
        gifCount++
    return  photoFlip
}
function search(q,rating,numToReturn) {
      limit = $('#limit').val()
        var queryObj = new qObj(q, '', rating, limit, numToReturn)
        var ep = new endPoints()
        
        var proto='';
        if(PRODUCTION){
          proto = 'https://'   //url = ep.createEndpoint('', 'https://')
        }else{
          proto = 'http:/' // url = ep.createEndpoint('', 'http://')
        }
        var end=''
        if($('#trend').is(':checked')){
            end = ep.trending
        }
        var url = ep.createEndpoint(end,proto)
        
       
    $.ajax({
        type: "GET",
        url: url,
        data: queryObj,
    }).then(function (response) {
        var data = response.data
        console.log(data)
        var meta = response.meta
        if (meta.msg == 'OK') {
                       
             var dataLength = data.length
        for (let i = 0; i < dataLength; i++) {
                 var stillImage = data[i].images.fixed_width_still.url
                 var animatedImage = data[i].images.fixed_width.url
                 var gifObj = {
                     still: stillImage,
                     animated: animatedImage
                 }
                 var link = data[i].url
                 var title = data[i].title
                 var photo = createPhoto(gifObj, title, 'Download', link, data[i].rating)
                              $(photo).hover(
                                  function (event) {
                                    
                                    //mouse enters starts the animation
                                      if (!this.isAnimating) {
                                          this.isAnimating = true
                                          event.preventDefault()
                                          var image = $(this)
                                          if (image.length > 0) {
                                              var animated = $(image).attr('data-animate')
                                              $(image).attr('src', animated)
                                          }
                                      }
                                  }, function (event) {
                                     
                                    //mouse leaves stops the animation
                                      event.preventDefault()
                                      if (this.isAntimating) {
                                          var image = $(this)
                                          if (image.length > 0) {
                                              var still = $(image).attr('data-still')
                                              $(image).attr('src', still)
                                          }
                                          this.isAnimating = false
                                      }
                        
                                    
                                })
                
                
                
                 $('#img-cards').prepend(photo)
             }

        }else{
            $('#errors').empty()
            var message = metaResponseMsg[meta.status]
            var error = $('<div>')
            $(error).addClass('alert')
            $(error).addClass('alert-danger')
            $(error).attr('role','alert')
            $(error).text(message)
            $('#errors').append(error)
        }



        
        
    })
    
}

