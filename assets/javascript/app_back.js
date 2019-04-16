//Globals

var apiKey = 'D3VKLzuXAaCof4EJI2yPxFYLWggvmHlG'
var qObj = function (_term, _apiKey = '', _rating = '', _limit = 0, _offset = 0) {
            
    return { 
        api_key: _apiKey == '' ? apiKey : _apiKey,
        q: _term,
        limit: _limit > 0 ? _limit : 25,
        offset: _offset,
        rating: _rating 
        
    }
}

var metaResponseMsg = {
    200: 'OK Your request was successful.',
    400: 'Bad Request Your request was formatted incorrectly or missing required parameters.',
    403: 'Forbidden You weren \'t authorized to make your request; most likely this indicates an issue with your API Key.',
    404: 'Not Found The particular GIF you are requesting was not found.This occurs, for example, if you request a GIF by an id that does not exist.',
    429: 'Too Many Requests Your API Key is making too many requests.Read about requesting a Production Key to upgrade your API Key rate limits.'
}
var endPoints = function () {
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

var currentOffset = 0;
var currentOffsetAdder = 10;
var searchterm;
var crurrentPage = 1;
$(document).ready(function () {
    var cardCol = $('#img-cards')
    init()
    $('#search').click(function (event) {
        event.preventDefault()
        var q = ''
        q = $('#q').val()
        if (searchterm != q) {
            init()
            currentPage = 0
            searchterm = q
        } 
        search(q)
    })
    
function init(){
    
    $(cardCol).empty()
    
 
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
    $(carBody).addClass('card-body')
    $(cardTitle).addClass('card-title').text(_title)
    $(imageLink).append(cardTitle)
    if (_text != '') {
        $(cardText).addClass('card-text').text(_text)
        $(carBody).append(cardTitle).append(cardText)
    }
    return  $(card).append(cardImg).append(carBody)
}

function createPagination(_paginationObj, _currentPage,) {
    /*
< nav aria-label = "..." >
    <ul class = "pagination" >
    <li class = "page-item disabled" >
    <a class = "page-link" href = "#" tabindex = "-1" aria-disabled = "true" > Previous < /a> </li>
    <li class = "page-item" > < a class = "page-link" href = "#" > 1 < /a></li >
    <li class = "page-item active" aria-current = "page" ><a class = "page-link" href = "#" > 2 < span class = "sr-only" > (current) < /span></a >
    </li> 
    <li class = "page-item" > < a class = "page-link" href = "#" > 3 < /a></li >
    <li class = "page-item" >
    <a class = "page-link" href = "#" > Next < /a> 
    </li> </ul> </nav>

*/
    var numberOfPages = _paginationObj.total_count
    var numberOnPage = _paginationObj.count
    var currentOffset = _paginationObj.offset
    var currentPage = _currentPage
    var LastPage = numberOfPages
    var FirstPage = 1
    var isMoreNextPages = _currentPage + currentOffset < LastPage ? true : false
    var isMorePrevPages = _currentPage - currentOffset > FirstPage ? true : false
    var paginationArea = $('#paginationArea')
    $(paginationArea).empty()
    var nav = $('<nav>')
    $(nav).attr('aria-lable', 'search results')
    var ul = $('<ul>')
    $(ul).addClass('pagination')
    if (isMorePrevPages) {
        for (let frontlinks = currentPage; frontlinks < currentPage - currentOffset; frontlinks++) {
            var li = $('<li>')
            $(li).addClass('page-item')
            if (currentPage == frontlinks) {
                $(li).addClass('active')
                $(li).attr('aria-current', 'page')
            }
            var span = $('<span>')
           //Todo: Finish This Pagination

        }
    }
  

// $('.page-link').click(function (event) {
//     event.preventDefault()
//     $('#search-results').empty()
//     crurrentPage = parseInt($(event.target).val())
//      search(q)
// })

    
}
function search(q) {
      
    var queryObj = new qObj(q, '', '', currentOffsetAdder, crurrentPage)
      var ep = new endPoints();
      var url = ep.createEndpoint('', 'http://')
    $.ajax({
        type: method,
        url: endpoint,
        data: queryObj,
    }).then(function (response) {
        console.log(response)
        var data = response.data,
            pagination = response.pagination,
            meta = response.meta
        if (meta.msg == 'ok') {
            if (pagination) {
                createPagination(pagination)
            }
            
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

        }



        
        
    })
    
}

})
