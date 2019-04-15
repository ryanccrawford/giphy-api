//Globals

var apiKey = 'D3VKLzuXAaCof4EJI2yPxFYLWggvmHlG'
var qObj = function (_apiKey, _rating, _term = '', _limit = 0, _offset = 0) {
            
    return { 
        q: _term,
        limit: _limit > 0 ? _limit : 25,
        offset: _offset,
        rating: typeof (_rating) != 'undefined' ? _rating : '',
        
    }
}
var metaResponseMsg = {
    200: 'OK Your request was successful.',
    400: 'Bad Request Your request was formatted incorrectly or missing required parameters.',
    403: 'Forbidden You weren \'t authorized to make your request; most likely this indicates an issue with your API Key.',
    404: 'Not Found The particular GIF you are requesting was not found.This occurs, for example, if you request a GIF by an id that does not exist.',
    429: 'Too Many Requests Your API Key is making too many requests.Read about requesting a Production Key to upgrade your API Key rate limits.'
}
var metaResponse = {
    msg: '',// HTTP Response Message "OK"
    status: 0,// HTTP Response Code 200
    response_id: '',//  A unique ID paired with this response from the API. "57eea03c72381f86e05c35d2"
}
var endPoints = {
    protocal: 'http://',
    protocalSecure : 'https://',
    host: 'api.giphy.com',
    path: '/v1/gifs/search',
    createEndpoint : function(_endpoint){},
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
var gifObj = {
                type: '',
                id: '',
                slug: '',
                url: '',
                bitly_url: '',
                embed_url: '',
                username: '',
                source: '',
                rating: '',
                content_url: '',
                    user: { },
                source_tld: '',
                source_post_url: '',
                update_datetime: '',
                create_datetime: '',
                import_datetime: '',
                trending_datetime: '',
                    images: { },
                title: ''
}


$(document).ready(function () {
    var cardCol = $('#img-cards')
    init()
    


function init(){
    
    $(cardCol).empty()
    $('#search').click(function(event){
        event.preventDefault()
        var q = ''
        q = $(this)
        console.log(q)
        $('#img-cards').append(createCard('','','')).append(createCard('','','')).append(createCard('','','')).append(createCard('','',''))

    })
 
}

function createCard(_imageScr, _title, _text){

    var card = $('<div>'),
        cardImg = $('<img>'),
        carBody = $('<div>'),
        cardTitle = $('<h4>'),
        cardText = $('<p>')

    $(card).addClass('card')
    $(cardImg).attr('src', _imageScr).addClass('card-img-top')
    $(carBody).addClass('card-body')
    $(cardTitle).addClass('card-title').text(_title)
    $(cardText).addClass('card-text').text(_text)
    $(carBody).append(cardTitle).append(cardText)

    return  $(card).append(cardImg).append(carBody)
}


function search(endpoint, method, queryObj) {
    return $.ajax({
        type: method,
        url: endpoint,
        data: queryObj,
    }).then(function () {
        
    })
    
}

})
