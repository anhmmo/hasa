
const areas = [
    {
	kaupunki: 'paakaupunkiseutu',
	id: '1014'
    },
    {
	kaupunki: 'helsinki',
	id: '1002'
    },
    {
	kaupunki: 'espoo',
	id: '1012'
    },
    {
	kaupunki: 'tampere',
	id: '1021'
    }
]

const teatterit = [
    {
	theatre: 'Omena',
	id: '1039',
	osoite: 'Piispansilta 11',
	postinumero: '02230',
	kaupunki: 'espoo'
    },
    {
	theatre: 'Sello',
	id: '1038',
	osoite: 'Ratsukatu 3',
	postinumero: '02600',
	kaupunki: 'espoo'
    },
    {
	theatre: 'Itis',
	id: '1045',
	osoite: 'Itäkatu 1',
	postinumero: '00930',
	kaupunki: 'helsinki'
    },
    {
	theatre: 'Kinopalatsi',
	id: '1031',
	osoite: 'Kaisaniemenkatu 2',
	postinumero: '00100',
	kaupunki: 'helsinki'
    },
    {
	theatre: 'Maxim',
	id: '1032',
	osoite: 'Kluuvikatu 1',
	postinumero: '00101',
	kaupunki: 'helsinki'
    },
    {
	theatre: 'Tennispalatsi',
	id: '1033',
	osoite: 'Salomonkatu 15',
	postinumero: '00100',
	kaupunki: 'helsinki'
    },
    {
	theatre: 'Flamingo',
	id: '1013',
	osoite: 'Tasetie 8',
	postinumero: '01510',
	kaupunki: 'vantaa'
    },
    {
	theatre: 'Fantasia',
	id: '1015',
	osoite: 'Kauppakatu 29',
	postinumero: '40100',
	kaupunki: 'jyvaskyla'
    },
    {
	theatre: 'Scala',
	id: '1016',
	osoite: 'Ajurinkatu 16',
	postinumero: '70110',
	kaupunki: 'kuopio'
    },
    {
	theatre: 'Kuvapalatsi',
	id: '1017',
	osoite: 'Vapaudenkatu 13',
	postinumero: '15100',
	kaupunki: 'lahti'
    },
    {
	theatre: 'Strand',
	id: '1041',
	osoite: 'Brahenkatu 5',
	postinumero: '53100',
	kaupunki: 'lappeenranta'
    },
    {

	theatre: 'Plaza',
	id: '1018',
	osoite: 'Torikatu 32',
	postinumero: '90100',
	kaupunki: 'oulu'
    },
    {
	theatre: 'Promenadi',
	id: '1019',
	osoite: 'Yrjonkatu 17',
	postinumero: '28100',
	kaupunki: 'pori'
    },
    {
	theatre: 'Cine atlas',
	id: '1034',
	osoite: 'Hatanpaan valtatie 5',
	postinumero: '33100',
	kaupunki: 'tampere'
    },
    {
	theatre: 'Plevna',
	id: '1035',
	osoite: 'Itainenkatu 4',
	postinumero: '33210',
	kaupunki: 'tampere'
    },
    {
	theatre: 'Kinopalatsi',
	id: '1022',
	osoite: 'Kauppiaskatu 11',
	postinumero: '20100',
	kaupunki: 'turku'
    }
]

let map = undefined
let routingControl = undefined

const teatteriSelect = document.getElementById('theatreSelect')
const div = document.getElementById('routing')

const hideMapBtn   = document.getElementById('hideMapButton')
const getRouteBtn  = document.getElementById('reittihakuNappi')
const selectButton = document.getElementById('showMapSelect')

const startAddress = document.getElementById('lahto_osoite')
const startNumber  = document.getElementById('lahto_numero')
const startCity    = document.getElementById('lahto_kaupunki')
const destAddress  = document.getElementById('kohde_osoite')
const destNumber   = document.getElementById('kohde_numero')
const destCity     = document.getElementById('kohde_kaupunki')

function toggleTheatreSelectVisibility() {
    if (isSelectHidden())
	teatteriSelect.setAttribute('class', '')
    else
	teatteriSelect.setAttribute('class', 'mapHidden')
}

function isSelectHidden() {
    return teatteriSelect.getAttribute('class') === 'mapHidden'
}

function showMapSelectButton() {
    selectButton.setAttribute('class', '')
}

function hideMapSelectButton() {
    selectButton.setAttribute('class', 'mapHidden')
}

function hideHideButton() {
    hideMapBtn.setAttribute('class', 'mapHidden')
}

function showHideButton() {
    hideMapBtn.setAttribute('class', '')
}

function hideMap() {
    div.setAttribute('class', 'mapHidden')
}

function removeChildren(node) {
    let child = node.firstChild
    while (child) {
	node.removeChild(child)
	child = node.firstChild
    }
}

function getTheatres(id) {
    const area = areas.find(a => a.id === id)

    if (area) {
	switch (area.kaupunki) {
	    case 'paakaupunkiseutu':
		const hki = 
		    teatterit.filter(t => t.kaupunki === 'helsinki')
		const esp = 
		    teatterit.filter(t => t.kaupunki === 'espoo')
		
		return hki.concat(esp)

	    case 'helsinki':
		return teatterit.filter(t => t.kaupunki === 'helsinki')
	    case 'espoo':
		return teatterit.filter(t => t.kaupunki === 'espoo')
	    default:
	    case 'tampere':
		return teatterit.filter(t => t.kaupunki === 'tampere')

	}
    }

    return teatterit.filter(t => t.id === id)
}

function addTheatreOptions(opts) {
    removeChildren(teatteriSelect)
    opts.forEach(o => teatteriSelect.appendChild(o))
}

function createTheatreOptions(objects) {
    const opts =
	objects.map(t => {
	    const o = document.createElement('option')
	    o.innerText = t.theatre
	    o.value = t.id
	    return o
	})

    return opts
}

function initMap(id) {
    hideHideButton()
    hideMapSelectButton()
    const teatteriLista = getTheatres(id)

    if (teatteriLista.length === 1) {
	showMap(teatteriLista[0])
	showHideButton()
    } else {
	toggleTheatreSelectVisibility()
	const opts = createTheatreOptions(teatteriLista)
	addTheatreOptions(opts)

	selectButton.addEventListener('click', e => {
	    e.preventDefault()
	    const selection = teatteriSelect.value
	    const teatteri = teatteriLista.find(t => t.id === selection)

	    showMap(teatteri)
	    showHideButton()
	    hideMapButton.innerText = 'Hide Map'
	})

	showMapSelectButton()
    }
}

function showMap(theatre) {
    const addressParts = theatre.osoite.split(' ')
    const addr = addressParts.join('+')
    const city = theatre.kaupunki

    const nominatimAPIurl = 'https://nominatim.openstreetmap.org/?format=json&addressdetails=1'
    const q = `&q=${addr},${city}`
    const rest = '&format=json&limit=1'
    const fetchUrl = `${nominatimAPIurl}${q}${rest}`

    fetch(fetchUrl)
	.then(response => response.json())
	.then(json => {
	    const latLng = {}
	    latLng.lat = json[0].lat
	    latLng.lng = json[0].lon
	    return latLng
	})
	.then(({lat, lng}) => {
	    destAddress.value = addressParts.slice(0, addressParts.length - 1).join(' ')
	    destNumber.value = addressParts[addressParts.length - 1]
	    destCity.value = theatre.kaupunki

	    div.setAttribute('class', 'mapVisible')
	    const zoom = 13

	    if (map == undefined) {
		map = L.map('map').setView([lat, lng], zoom)
		initTiles(map)
	    } else {
		map.setView([lat, lng], zoom)
	    }
	    
	    const marker = L.marker([lat, lng])
	    marker.addTo(map)
	})
	.catch(error => console.log(error))
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

function showRoute(start, dest) {
    const [ fLat, fLng ] = [ start.lat, start.lng ]
    const [ dLat, dLng ] = [ dest.lat, dest.lng ]

    if (routingControl !== undefined) {
	map.removeControl(routingControl)
    }

    routingControl = 
	L.Routing.control({
	    routeWhileDragging: true,
	    waypoints: [
		L.latLng(parseFloat(fLat), parseFloat(fLng)),
		L.latLng(parseFloat(dLat), parseFloat(dLng))
	    ],
	    createMarker: 
		function(i, waypoint, n) { 
		    return L.marker(waypoint.latLng) 
		}
	})

    routingControl.addTo(map);
}

function beginRouting(queryStart, queryDest) {
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
		.then(([ start, dest ]) => showRoute(start, dest))
		.catch(error => console.log(error))
	})
	.catch(error => console.log(error))
}

const toggleMapVisibility = e => {
    e.preventDefault()
    const attr = div.getAttribute('class')

    if (attr === 'mapVisible') {
	div.setAttribute('class', 'mapHidden')
	hideMapBtn.innerText = 'Map'
    } else {
	div.setAttribute('class', 'mapVisible')
	hideMapBtn.innerText = 'Hide Map'
    }
}

hideMapBtn.addEventListener('click', toggleMapVisibility)

getRouteBtn.addEventListener('click', e => {
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

    beginRouting(queryStart, queryDest)
})

const getUserLocation = () => {
    const fillUserAddress = (pos) => {
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
		    }
		    if (addr.road) {
			startAddress.value = addr.road
		    }
		    if (addr.house_number) {
			startNumber.value = addr.house_number
		    }
		}
	    })
	    .catch(error => console.log(error))
    }

    if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(fillUserAddress)
    }
}


