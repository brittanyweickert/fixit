$(handleFormSubmit);

// This first section of code will pull the youtube vids from their site
// I figure we can move this view to the appropriate location when we get it set up,
// but for now we got our videos coming up!


function handleFormSubmit() {
    $('#search-videos').on('submit', e => {
        e.preventDefault();
        let searchTerm = $('#videos-search-field').val() + 'repair';
        const maxResults = 4;       
        let zip = $('#zip').val();

        if (searchTerm !== '') {
            getYouTubeVideos(searchTerm, maxResults);
            getLatLong(zip);            
        } else {
            alert('Please enter your phone model');
        }
    })
}

function getYouTubeVideos(searchTerm, resultsMax) {
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
                <img src='${responseJson.items[i].snippet.thumbnails.high.url}'
            </li>
            `
        )
    }

    $('#videos-list').removeClass('hidden');
}




////////////////////////////////Maps API section////////////////////
const googleApiKey = 'AIzaSyDBw8VZKCuk7juM1LnKIBcB1aKiJXpmTn4'
  

//geo coding
function getLatLong(zip) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip}
    &key=${googleApiKey}`
    fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    })
        .then(responseJson => getMapData(responseJson))
        .catch(err => {
            console.log(`${err.message}`)
        })
}

const clientID = 'YMBYSODCXL3DCEIJGJIW2N5EGME0O10PVDF2A41Z1MIP0KZD';
const clientSecret = 'LIWLXKL0O1ASSEMUWFC15SUTCU4WK1PJXBNLUHTRCJQW5BWW';

function getMapData(coords) {
    const loc = coords.results[0].geometry.location;
    const lat = coords.results[0].geometry.location.lat;
    const long = coords.results[0].geometry.location.lng;
    const fourSquareURL = `https://api.foursquare.com/v2/venues/explore?radius=10000&client_id=${clientID}&client_secret=${clientSecret}&v=20180323&limit=5&ll=${lat},${long}&query=phone+repair`
    
    fetch(fourSquareURL).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(res.statusText);
        }
    })
    .then(res => {
        console.log(res)
        initMap(res, loc)
        })
    .catch(err => {
        console.log(err.statusText)
    });
}

function initMap(venues, start) {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: start,
        zoom: 12
      });

      for (let i = 0; i < venues.response.groups[0].items.length; i++) {
        let shortPath = venues.response.groups[0].items[i].venue;
        let lat = shortPath.location.lat;
        let long = shortPath.location.lng;
        let label = shortPath.name;

        let marker = new google.maps.Marker({
            position: {lat: lat, lng: long},
            map: map,
            title: label
        });
    }
}


// added scroll effect //
window.smoothScroll = function(target) {
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);
    
    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);
    
    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}