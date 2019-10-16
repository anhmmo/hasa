'use strict'

const stores = {
    alepa: [
	{
	    kaupunki: "helsinki",
	    osoite: "Runeberginkatu 28",
	    postinumero: "00100"
	},
	{
	    kaupunki: "helsinki",
	    osoite: "Elielinaukio 5",
	    postinumero: "00100"
	},
	{
	    kaupunki: "helsinki",
	    osoite: "Kettutie 2",
	    postinumero: "00800"
	},
	{
	    kaupunki: "vantaa",
	    osoite: "Koivukylänväylä 66",
	    postinumero: "01390"
	}
    ],
    kmarket: [
	{
	    kaupunki: "helsinki",
	    osoite: "Salomonkatu 17",
	    postinumero: "00100"
	},
	{
	    kaupunki: "helsinki",
	    osoite: "Albertinkatu 27",
	    postinumero: "00101"
	}
    ]
}

function initMap() {
    const lat  = 60.15921222903387
    const lng  = 24.87876534461975
    const zoom = 13
    const map  = L.map('map').setView([lat, lng], zoom)
    return map
}

function initTiles(map) {
    const tileUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    const attribution =
	'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + 
	'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 
	'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    const maxZoom = 19
    const id = 'mapbox.streets'
    const accessToken = 'pk.eyJ1Ijoic2FtaS0iLCJhIjoiY2swMmhyeWs4MTBrbzNjcXRzb2M5bHcwOCJ9.aPb5eKRyyVzXNCU6Dmh0ow'
    const tiles = L.tileLayer(tileUrl, { attribution, maxZoom, id, accessToken })
    tiles.addTo(map)
}

function showRoute(start, dest, selection) {
    const [ fLat, fLng ] = [ start.lat, start.lng ]
    const [ dLat, dLng ] = [ dest.lat, dest.lng ]

    if (routingControl !== undefined) {
	map.removeControl(routingControl)
    }

    let marker = undefined
    routingControl = 
	L.Routing.control({
	    routeWhileDragging: true,
	    waypoints: [
		L.latLng(parseFloat(fLat), parseFloat(fLng)),
		L.latLng(parseFloat(dLat), parseFloat(dLng))
	    ],
	    createMarker: 
		function(i, waypoint, n) { 
		    if (selection === null || i < n - 1) {
			return L.marker(waypoint.latLng) 
		    } else {
			marker = L.marker(waypoint.latLng)
			marker.bindPopup(`<img src="images/${selection}.png" width="100px" height="50px" />`)
			return marker
		    }
		}
	})

    routingControl.addTo(map);
    if (marker !== undefined) marker.openPopup()
}

function beginRouting(queryStart, queryDest, selection) {
    const nominatimAPIurl = 'https://nominatim.openstreetmap.org/?format=json&addressdetails=1'
    const q1 = `&q=${queryStart}`
    const q2 = `&q=${queryDest}`
    const rest = '&format=json&limit=1'

    const fetchUrl1 = `${nominatimAPIurl}${q1}${rest}`
    const fetchUrl2 = `${nominatimAPIurl}${q2}${rest}`

    fetch(fetchUrl1)
	.then(response => response.json())
	.then(json => {
	    const startCoords = {}
	    startCoords.lat = json[0].lat
	    startCoords.lng = json[0].lon
	    return startCoords
	})
	.then(startCoords => {
	    fetch(fetchUrl2)
		.then(response => response.json())
		.then(json => {
		    const destCoords = {}
		    destCoords.lat = json[0].lat
		    destCoords.lng = json[0].lon
		    return [ startCoords, destCoords ]
		})
		.then(([ start, dest ]) => showRoute(start, dest, selection))
		.catch(error => console.log(error))
	})
	.catch(error => console.log(error))
}

function getUserLocation(e) {
    e.preventDefault()

    if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(pos => {
	    const zoom = 13
	    const latitude  = pos.coords.latitude
	    const longitude = pos.coords.longitude

	    const fetchAddress =
		`https://nominatim.openstreetmap.org/reverse?`+
		`format=geojson&lat=${latitude}&lon=${longitude}`

	    fetch(fetchAddress)
		.then(response => response.json())
		.then(json => {
		    const data = json.features[0].properties
		    console.log(data)

		    if (data.address) {
			const addr = data.address
			if (addr.city) {
			    startCity.value = addr.city
			    kauppaKaupunki.value = addr.city
			}

			if (addr.road) {
			    startAddress.value = addr.road
			    kauppaOsoite.value = addr.road
			}

			if (addr.house_number) {
			    startNumber.value = addr.house_number
			    kauppaNum.value = addr.house_number
			}
		    }
		})
		.catch(error => console.log(error))

	    map.setView([latitude, longitude], zoom)
	    const marker = L.marker([latitude, longitude])

	    marker.bindPopup('<p>You are here (maybe)</p>')
	    marker.addTo(map)
	    marker.openPopup()
	})
    }
}

const map = initMap()
initTiles(map)

map.on('click', e => {
    const marker = L.marker([e.latlng.lat, e.latlng.lng])
    marker.addTo(map)
})

const kauppahakuNappi = document.getElementById('kauppahakunappi')
const kauppaKaupunki  = document.getElementById('kauppa_lahto_kaupunki')
const kauppaOsoite    = document.getElementById('kauppa_lahto')
const kauppaSelect    = document.getElementById('kaupat_select')
const kauppaNum       = document.getElementById('kauppa_lahto_numero')

const reittihakuNappi = document.getElementById('reittihakuNappi')
const startAddress = document.getElementById('lahto_osoite')
const startNumber  = document.getElementById('lahto_numero')
const startCity    = document.getElementById('lahto_kaupunki')
const destAddress  = document.getElementById('kohde_osoite')
const destNumber   = document.getElementById('kohde_numero')
const destCity     = document.getElementById('kohde_kaupunki')

const getLocationBtn = document.getElementById('locateUser')

let routingControl = undefined

getLocationBtn.addEventListener('click', getUserLocation)

kauppahakuNappi.addEventListener('click', e => {
    e.preventDefault()
    
    const fAddress = kauppaOsoite.value.trim()
    const fNum  = parseInt(kauppaNum.value.trim())
    const fCity = kauppaKaupunki.value.trim().toLowerCase()
   
    const selection = kauppaSelect.value
    let store =
	stores[selection]
	    .filter(k => k.kaupunki === fCity)

    if (store.length < 1) {
	store = stores[selection]
    }

    const dAddress = store[0].osoite.split(' ').join('+')
    const dCity = store[0].kaupunki
 
    const queryStart = `${fAddress}+${fNum},${fCity}`
    const queryDest = `${dAddress},${dCity}`

    beginRouting(queryStart, queryDest, selection)
})

reittihakuNappi.addEventListener('click', e => {
    e.preventDefault()

    const fAddress = startAddress.value.trim()
    const fNum  = parseInt(startNumber.value.trim())
    const fCity = startCity.value.trim()

    const dAddress = destAddress.value.trim()
    const dNum  = parseInt(destNumber.value.trim())
    const dCity = destCity.value.trim()

    if (isNaN(fNum) || isNaN(dNum)) {
	return
    }

    const queryStart = `${fAddress}+${fNum},${fCity}`
    const queryDest = `${dAddress}+${dNum},${dCity}`

    beginRouting(queryStart, queryDest, null)
})
