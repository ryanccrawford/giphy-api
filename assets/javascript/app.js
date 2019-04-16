var apiKey = 'D3VKLzuXAaCof4EJI2yPxFYLWggvmHlG',
    currentOffset = 0,
    currentOffsetAdder = 10,
    searchterm,
    crurrentPage = 0,
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
        endPoints = function () {
                    return {
                    protocal: 'http://',
                    protocalSecure: 'https://',
                    host: 'api.giphy.com',
                    path: '/v1',
                    createEndpoint: function (_endpoint = '', _protocal = '', ) {
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
        topics = [{name:'coding',rating:'',currentPage:0},{name:'smiles',rating:'',currentPage:0},{name:'math',rating:'',currentPage:0}]
        ratings = {  'Y':'lightgreen',
                     'G': 'green',
                     'PG': 'darkgreen',
                     'PG-13':'yellow',
                     'R':'red'
                },
        textColors = {  'lightgreen' :'white',
                'green': 'white',
                'darkgreen': 'white',
                'yellow':'black',
                'red':'white',
                'blue':'white'
                }

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


   

})
function increasePage(name){
    
}
function createTopics(){   
    $('#topics').empty()
    var topicsLength = topics.length
    for(let i=0; i < topicsLength; i++){
        var topicButton = $('<button>')
        var rating = topics[i].rating
        color = 'blue'
        if(rating){
           color = ratings[rating];
        }
        $(topicButton).addClass('topicButton')
        $(topicButton).addClass('btn')
        $(topicButton).data({'currentPage':0})
        $(topicButton).data({'rating': topics[i].rating })
        $(topicButton).css({'background-color':color, color: 'white'})
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
function clear(){
    $('#img-cards').empty()
    $('#topics').empty()
 }
function createCard(_gifObj, _title, _text, _link){

    var card = $('<div>'),
        cardImg = $('<img>'),
        carBody = $('<div>'),
        cardTitle = $('<h4>'),
        cardText = $('<p>'),
        imageLink = $('<a>')
    $(imageLink).attr('href', _link)
    $(card).addClass('card')
    $(cardImg).attr('src', _gifObj.still).addClass('card-img-top').hover(function () {
        $(cardImg).attr('src', _gifObj.animated)
    }, function () {
        $(cardImg).attr('src', _gifObj.still)
    })
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
function search(q,rating,numToReturn) {
      
        var queryObj = new qObj(q, '', rating, 10, numToReturn)
        var ep = new endPoints();
        var url = ep.createEndpoint('', 'http://')
       
    $.ajax({
        type: "GET",
        url: url,
        data: queryObj,
    }).then(function (response) {
        console.log(response)
        var data = response.data,
            pagination = response.pagination,
            meta = response.meta
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
                 var card = createCard(gifObj, title, 'Download', link)
                              
                 $('#img-cards').prepend(card)
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

