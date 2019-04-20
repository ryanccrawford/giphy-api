//GLOBALS
var gifCount = 0,
    apiKey = 'D3VKLzuXAaCof4EJI2yPxFYLWggvmHlG',
    currentOffset = 0,
    currentOffsetAdder = 10,
    searchterm,
    crurrentPage = 0,
    limit = 10,
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
                    createEndpoint: function (_endpoint, _protocal) { // method to create endpoint based on 2 paramet
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
     },
    topics = [{name:'cameras',rating:'',currentPage:0},{name:'photos',rating:'',currentPage:0},{name:'polaroid',rating:'',currentPage:0}],
    ratings = {
        'Y': 'lightgreen', // this was used to give ratings a color 
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
  
    $('.alert').alert()
    $('#add').click(function (event) {
        event.preventDefault()
        var _name = $('#q').val().trim()
        if (_name != '') {
            var _rating = $('#rating').val()
            if (_rating === 'all') {
                _rating = '';
            }
            var newTopic = { name: _name, rating: _rating, currentPage: 0 }
            topics.push(newTopic)
            createTopics()
        }
    })
    $('.sharpie-back').click(function(event){
        if($(event.target).children('a')){
            event.preventDefault()
        }

    })
    $('#clear').click(function () {
       clear()
   })
   
    
    // When the user clicks on the button, scroll to the top of the document
    $('#toTOP').click(function () {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0;
     }
    )   

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
        $(topicButton).data({'offset':0})
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
            
            if(rating == 'all'){
                rating = ''
            }
            var offset = $(event.target).data('offset')
            var l = $('#limit').val()
            if (l > 25 || l < 1) {
                l = 10
                $('#limit').val(10)
            }
            search(q,rating,l,offset)
            offset = offset + parseInt(l)
            $(event.target).data('offset' , offset)
        })
        $('#topics').append(topicButton)
       
    }
}

// Clears the screen and resets the gif counter
function clear(){
    $('#img-cards').empty()
    $('#topics').empty()
    gifCount = 0
    $("#toTOP").hide()
    createTopics()
 }

// This function creates the polaroid gif using jquery. The Parameter is one giphy API object from the returned response of search
function createPhoto(_giphyObj){
//     <div class="flip-photo">
var stillImage = _giphyObj.images.fixed_width_still.url,
    animatedImage = _giphyObj.images.fixed_width.url,
    link = animatedImage,
    title = _giphyObj.title,
    rating = _giphyObj.rating,
    id = _giphyObj.id
    //downloadurl = _giphyObj.url
var photoFlip = $('<div>')
    $(photoFlip).addClass('flip-photo')
        .addClass('shadow')
        .attr('id', 'photo_' + gifCount.toString())
    //     <div class="flip-photo-inner">
   
        
    var photoFrame = $('<div>')
    $(photoFrame).addClass('flip-photo-inner')
            //       <div class="flip-photo-front">
        var photoFront = $('<div>')
        $(photoFront).addClass('flip-photo-front')
            //           <img src="assets/images/picture_blank_alpha.png" alt="front"  class="photo-front">
            var photoImg = $('<img>')
            $(photoImg).addClass('photo')
            var imageId = 'img_'+gifCount.toString()
    $(photoImg).attr('src', stillImage).attr('id',imageId)
    $(photoImg).attr('data-still', stillImage)
    $(photoImg).attr('data-animate', animatedImage)
    $(photoImg).attr('data-state', 'still')
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
            $(frameSpan).text(title)
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
 $(backTitle).text(title)
 $(backTitle).addClass('sharpie-back')
//         <p class="sharpie">Rating: G</p> 
var backRating = $('<p>')
$(backRating).text('Rating: '+rating)
$(backRating).addClass('sharpie-back')

//<p class="sharpie">Download Now</p>
var backDwnLink = $('<p>')
$(backDwnLink).addClass('sharpie-back')
    var dwnLink = $('<a download>')
   // $(dwnLink).attr('download')
    $(dwnLink).attr('href', link)
   // $(dwnLink).attr('onclick', 'this.href = "'+link+'"')
    
    
    $(dwnLink).addClass('download')
    
$(dwnLink).text('Download Now')
$(backDwnLink).append(dwnLink)       
$(photoBack).append(backTitle).append(backRating).append(backDwnLink)
$(photoFrame).append(photoBack)
$(photoFlip).append(photoFrame)
   //attach a click event to the phptp to flip the card over, actually toggle the flip
        $(photoFlip).click(function(event){
            
            var target = event.target
            if ($(target).is('a')) {
                return true
            }
            var photo = $(target).parents('.flip-photo')
            if(photo.length > 0){
                $(photo[0]).toggleClass('flip')
            }
            event.preventDefault()
        })
       
       
    return  photoFlip
}

//Function to search the giphy API
function search(_q,_rating,_limit,_offset) {
        //Get the limit from the limit box
   


    //create a new query object 
    var queryObj = new qObj(_q, '', _rating, _limit, _offset)
    //create a new endpoint object
    var ep = new endPoints()
    //This checks the PRODUCTION const to see if we are testing or not to determine weather or not to use HTTP or HTTPS
    var proto = location.protocol
    if (proto === 'file:') {
        proto = 'http:'
    }
    proto += '//'
        var end=''
        if($('#trend').is(':checked')){
            end = ep.trending
        }
        var url = ep.createEndpoint(end,proto)
        
    //This is where we call the API using the above created objects 
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
                                  
                 var photo = createPhoto(data[i])
                 var photoId = photo[0].id
                 gifCount++
                 $('#img-cards').prepend(photo[0])
            //Hover function used to play gif animations on mouse over and to stop on mouse out
            $("#" + photoId).hover(
                    function (event) {
                      event.preventDefault()
                      //mouse enters starts the animation
                        var id =this.id.split("_")[1]
                          var gif = $("#img_"+id+".photo")[0]
                          var state = $(gif).attr('data-state')
                        if (state == 'still') {
                            $(gif).attr('data-state','animated')
                            
                            var image = gif.id
                            if (image) {
                                var animated = $(gif).attr('data-animate')
                                $(gif).attr('src', animated)
                            }
                        }
                    }, function (event) {
                       
                      //mouse leaves stops the animation
                        event.preventDefault()
                        var id =this.id.split("_")[1]
                        var gif = $("#img_"+id+".photo")[0]
                        var state = $(gif).attr('data-state')
                        if (state == 'animated') {
                            var image = gif.id
                            if (image) {
                                var still = $(gif).attr('data-still')
                                $(gif).attr('src', still)
                            }
                            $(gif).attr('data-state','still')
                        }
          
                      
                  })
             }
            $("#toTOP").show();
        } else {
            //This is for any errors that my happen. It will display a message with the english version of the message 
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

