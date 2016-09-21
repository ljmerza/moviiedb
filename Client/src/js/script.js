'use strict'

var currentPage = 0; // current page loaded
var currentUrl = ''; // url to server backend
var searchResults = '' // input from search
var isPageLoading = false; // is page currently loading
var $section = $('section')


/*
* search input animations
 */
$(".mat-input").focus(function(){
    // when focused add white colors
    $(this).parent().addClass("is-active is-completed")
})

$(".mat-input").focusout(function(){
    // on focus out if no input then remove completed css
    if($(this).val() === "")
        $(this).parent().removeClass("is-completed")
    // always remove active class on focus out
    $(this).parent().removeClass("is-active")
})




/*
* if search button clicked then get input data and get moviedb results
 */
$("#searchButton").click( function (event) {

    // get input value
    var $input = $("#searchInput");
    searchResults = $input.val();
    
    // if input is not blank then call api
    if (searchResults.length > 0) {

        // clear and unfocus input
        $input.val('');
        $input.blur();

        // set url
        currentUrl = 'search'

        // reset current search results page
        currentPage = 0;

        getResults(searchResults);
    }
})



/*
 * on click, get now playing movies
 */
$('#nowPlaying').click( function () {

    // unfocus button
    $('#nowPlaying').blur();

    // reset pages
    currentPage = 0;
    // set url
    currentUrl = 'topmovies';

    getResults()

})

/*
 * trigger click 
 */
$('#nowPlaying').trigger('click')

/*
 *  on enter down on input search movies
 */
$('#searchInput').keypress( function (e) {
    var key = e.which;
    if (key == 13) {
        // get input value clear it
        var $input = $("#searchInput");
        searchResults = $input.val();
        
        // if input is not blank then call api
        if (searchResults.length > 0) {

            // clear and unfocus input
            $input.val('');
            $input.blur();

            // set url
            currentUrl = 'search'

            // reset current search results page
            currentPage = 0;

            getResults(searchResults);
        }  
    }
});



/*
 * get results from server and display them
 * @param String - value of search input
 */
function getResults () {

    $('#loading').css('visibility', 'visible');

    // if page already loading results then don't start AJAX
    if (isPageLoading) {
        return
    }

    currentPage++;
    isPageLoading = true

    // if first page then clear results
    if ( currentPage == 1 ) {
        $section.html('')
    }

    // get movie results from server
    $.ajax({
        dataType: "json",
        url: currentUrl,
        data: {
            page: currentPage,
            value: searchResults
        },
        success: function (results) {

            // for each search result create a card and append to section
            $.each(results.results, function (key, data) {
                var template = 
                '<div class="card z-depth">' +
                    '<div class="card-header">' +
                         '<h3>' + data.original_title + '</h3>' +
                    '</div>'+
                    '<div class="card-body">'+
                        '<p class="text-justify">' + data.overview + '</p>' +
                    '</div>'+
                    '<div class="card-footer">' +
                        '<div>Release Date: ' + 
                        data.release_date.slice(5,7) + '/' + data.release_date.slice(8) + '/' + data.release_date.slice(0,4) + 
                        '</div>' +
                        '<span>Rating: ' + data.vote_average + '/10</span>' +
                        '<span><a class="poster-btn" data-toggle="modal" data-target="#myModal" data-img=' +
                        'http://image.tmdb.org/t/p/w500/' + data.poster_path +
                        '>Show Poster</a></span>' +
                    '</div>' +
                '</div>'

                // append the new card
                $section.append(template);
            })

            // // even out height of cards if in md responsive size
            if($(document).width() > 992) {
                evenHeights();
            }

            // on click get image url and insert into modal
            $('.poster-btn').click( function (event) {
                $('#modal-image').attr('src', $(this).data('img'))
            })

            // page is done loading
            isPageLoading = false;
            $('#loading').css('visibility', 'hidden');

        }
    });
}







/*
* on resize of window check serach result card heights
 */
$(window).resize(function() {
    if($(document).width() > 992) {
        evenHeights();
    }
            
})


/*
 * on scroll check for pagination and scroll to top button
 */
$(window).scroll( function () {

    var top = $( window ).scrollTop() + window.innerHeight
    var windowTop = $( document ).height()

    // if top of window close to bottom of document then trigger ajax call
    if ( top + 100 >= windowTop ) {
        getResults()  
    }

    if ($(this).scrollTop() > 500) {
        $('.scrollup').fadeIn();
	} else {
		$('.scrollup').fadeOut();
	}
        
})


// button event to scroll up
$('.scrollup').click( function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});


/*
* evens out height of cards on same row
 */
function evenHeights () {
    // get all even indexed cards
    var $evenCards = $('.card:even');

    // for each even card, check height and compare to next sibiling
    $evenCards.each( function () {

        // save element and its next sibiling
        var _this = $(this);
        var oddCard = _this.next();

        // if next sibiling is taller then set even card to 
        // that height else set sibiling to even card height
        if ( oddCard.height() > _this.height() ) {
            _this.height( oddCard.height() );
        } else {
            oddCard.height( _this.height() );
        }

    })
}




