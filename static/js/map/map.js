// Map initialize

var map = L.map('map', {
    center: [35.20118653849822, -0.6343081902114373],
    zoom: 14
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    subdomains: ['a', 'b', 'c']
}).addTo(map);


var featureGroup = L.featureGroup().addTo(map);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: featureGroup
    }
}).addTo(map);

map.on('draw:created', function (e) {

    // Each time a feaute is created, it's added to the over arching feature group
    featureGroup.addLayer(e.layer);
});


// on click, clear all layers
document.getElementById('delete').onclick = function (e) {
    featureGroup.clearLayers();
}

document.getElementById('export').onclick = function (e) {
    // Extract GeoJson from featureGroup
    var data = featureGroup.toGeoJSON();

    // Stringify the GeoJson
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    document.getElementById('export').setAttribute('download', 'data.geojson');
}

function toWKT(layer) {
    var lng, lat, coords = [];
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
        var latlngs = layer.getLatLngs();
        for (var i = 0; i < latlngs.length; i++) {
            var latlngs1 = latlngs[i];
            if (latlngs1.length) {
                for (var j = 0; j < latlngs1.length; j++) {
                    coords.push(latlngs1[j].lat + " " + latlngs1[j].lng);
                    if (j === 0) {
                        lng = latlngs1[j].lng;
                        lat = latlngs1[j].lat;
                    }
                }
            } else {
                coords.push(latlngs[i].lat + " " + latlngs[i].lng);
                if (i === 0) {
                    lng = latlngs[i].lng;
                    lat = latlngs[i].lat;
                }
            }
        }
        ;
        if (layer instanceof L.Polygon) {
            return "POLYGON((" + coords.join(",") + "," + lat + " " + lng + "))";
        } else if (layer instanceof L.Polyline) {
            return "LINESTRING(" + coords.join(",") + ")";
        }
    } else if (layer instanceof L.Marker) {
        return "POINT(" + layer.getLatLng().lat + " " + layer.getLatLng().lng + ")";
    }
};
map.on('draw:edited', function (e) {
    e.layers.eachLayer(function (layer) {
        console.log(toWKT(layer));
    });
});
map.on('draw:created', function (e) {
    var layer = e.layer;
    console.log(toWKT(layer));
});