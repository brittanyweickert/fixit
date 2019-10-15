$(handleFormSubmit);

// This first section of code will pull the youtube vids from their site
// I figure we can move this view to the appropriate location when we get it set up,
// but for now we got our videos coming up!


function handleFormSubmit() {
    $('#search-videos').on('submit', e => {
        e.preventDefault();
        let searchTerm = $('#videos-search-field').val() + 'repair';
        // if we want to set a limit later on
        let maxResults = 10;
        // When we get zipcode from form
        let zip = 33610;


        if (searchTerm !== '') {
            getYouTubeVideos(searchTerm, maxResults);
            getMapData(zip);
        } else {
            alert('please enter a repair you would like to learn about');
        }
    })
}

function getYouTubeVideos(searchTerm, resultsMax = 10) {
    const apiKey = 'AIzaSyDDgzOdf_q3pwdLbEi8geqdP4avXz2X3lM';
    const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        key: apiKey,
        q: searchTerm,
        part: 'snippet',
        maxResults: resultsMax,
        type: 'video'
    };

    let queryString = $.param(params);
    let url = youTubeApiUrl + '?' + queryString;

    fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    })
        .then(responseJson => displayYouTubeResults(responseJson))
        .catch(err => {
            console.log(`${err.message}`)
        })
}

function displayYouTubeResults(responseJson) {
    $('#videos-list').empty();
    for (let i = 0; i < responseJson.items.length; i++) {
        $('#videos-list').append(
            `<li>
                <h3>${responseJson.items[i].snippet.title}</h3>
                <p>${responseJson.items[i].snippet.description}</p>
                <img src='${responseJson.items[i].snippet.thumbnails.default.url}'
            </li>
            `
        )
    }

    $('#videos-list').removeClass('hidden');
}

// This will be the section for locations API

const clientID = 'YMBYSODCXL3DCEIJGJIW2N5EGME0O10PVDF2A41Z1MIP0KZD';
const clientSecret = 'LIWLXKL0O1ASSEMUWFC15SUTCU4WK1PJXBNLUHTRCJQW5BWW';
const fourSquareURL = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientSecret}&v=20180323&limit=5&ll=40.7243,-74.0018&query=coffee`

function getMapData() {
fetch(fourSquareURL).then(res => {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error(res.statusText);
    }
})
.then(res => {
    console.log(res)
    displayMap(res);
})
.catch(err => {
    console.log(err.statusText)
});
}

function displayMap(mapData) {
    $('.info-holder').empty();
    for (let i = 0; i < mapData.groups.items.length; i++) {
        $('.info-holder').append(
            `<li>
                <h3>${mapData.groups.items[i].venue.name}</h3>
                <p>${mapData.groups.items[i].venue.location}</p>            
            </li>
            `
        )
    }

    $('#videos-list').removeClass('hidden');
}