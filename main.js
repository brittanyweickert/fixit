$(handleFormSubmit);

function handleFormSubmit() {
    $('#search-form').on('submit', e => {
        e.preventDefault();       
        let zip = $('#zip').val();
        let searchTerm = $('#videos-search-field').val() + 'smartphone+repair';
        const maxResults = 3;  

        if (!zip || !searchTerm) {
            alert('Please Fill Out Both Fields');                  
        } else {
            getLatLong(zip);
            getYouTubeVideos(searchTerm, maxResults);
            smoothScroll(document.getElementById('videos'))
            $('.map').removeClass('hidden');
            $('.videos').removeClass('hidden');
        }
    })
}

function getYouTubeVideos(searchTerm, resultsMax) {
    const apiKey = 'AIzaSyCmJ3sYrd9ZvBGbYJumNlbUlFLwzI-NaAs';
    const youTubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        key: apiKey,
        q: searchTerm,
        part: 'snippet',
        maxResults: resultsMax,
        type: 'video',
        relevanceLanguage: 'en'
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
            $('#videos-list').html(`<h3 class="error">${err.message}</h3>`)
        })
}

function displayYouTubeResults(responseJson) {
    $('#videos-list').empty();
    for (let i = 0; i < responseJson.items.length; i++) {
        console.log(responseJson.items[i])
        $('#videos-list').append(
            `<li>
                <h3 class="ytHeader">${responseJson.items[i].snippet.title}</h3>
                <p class="youtubeDescription">${responseJson.items[i].snippet.description}</p>
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </li>
            `
        )
    }
}


////////////////////////////////Maps API section////////////////////
const googleApiKey = 'AIzaSyDBw8VZKCuk7juM1LnKIBcB1aKiJXpmTn4'
  

//geo coding //////

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
            $('#map').html(`<h3 class="error">Please Enter A Valid Zip Code</h3>`);
        })
}


// Using Foursquare to find venues/////

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
        initMap(res, loc)
        })
    .catch(err => {
        $('#map').html(`<h3 class="error">Please Enter a Valid Zip Code</h3>`);
    });
}

// Creating the Map and inserting markers /////

function initMap(venues, start) {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: start,
        zoom: 9
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
    displayResultsInfo(venues);
}

// Displays Map info in a list ////

function displayResultsInfo(venues) {
    $('#map-info-list').empty();
    for (let i = 0; i < venues.response.groups[0].items.length; i++) {
        let shortPath = venues.response.groups[0].items[i].venue;
        let addressInfo = shortPath.location.formattedAddress[0] + ', ' + shortPath.location.formattedAddress[1] + ', ' + shortPath.location.formattedAddress[2]
        $('#map-info-list').append( `<li>
                <h4 class="mapHeader">${shortPath.name}</h4>               
                <p class="mapInfo">${addressInfo}</p>
            </li>
        `)
    }
}


// added scroll effect //
let smoothScroll = function(target) {
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