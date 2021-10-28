const { request, response } = require('express');
const express = require('express');
const Datastore = require('nedb')
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.static('static'));
app.use(express.json())

const subway = new Datastore('tramway.db')
subway.loadDatabase();
// const station = new Datastore('stations.db')
// station.loadDatabase();
// const stationBus = new Datastore('stationsBus')
// stationBus.loadDatabase();
const bus = new Datastore('bus.db')
bus.loadDatabase();
const correspondance = new Datastore('correspondance.db');
correspondance.loadDatabase();
const stations_sba = new Datastore('stations_sba.db');
stations_sba.loadDatabase();
const matrice = new Datastore('matrice.db');
matrice.loadDatabase();


app.post('/stations_sba', (request, response) => {
    console.log(request.body)
    const data = request.body;
    stations_sba.insert(data)
    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.lon
    })
});


app.post('/subway', (request, response) => {
    console.log(request.body)
    const data = request.body;
    subway.insert(data)
    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.lon
    })
});

app.post('/bus', (request, response) => {
    console.log(request.body)
    const data = request.body;
    bus.insert(data)
    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.lon
    })
});


app.post('/correspondance', (request, response) => {
    console.log(request.body)
    const data = request.body;
    correspondance.insert(data)
    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.lng
    })
})

app.post('/matrice', (request, response) => {
    const data = request.body;
    console.log(data)
    matrice.insert(data)
    response.json({
        status: 'success',
    })
})


app.get('/subway', (request, response) => {
    subway.find({}).sort({ ID: 1, }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})

app.get('/bus', (request, response) => {
    bus.find({}).sort({ timestamp: 1, ID: 1, }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})

app.get('/bus/:numero', (request, response) => {
    var data = request.params.numero;
    console.log(data)
    bus.find({ numero: data }).sort({ timestamp: 1, ID: 1, }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})


app.get('/stations_sba/bus', (request, response) => {
    stations_sba.find({ type: 'bus' }).sort({ numero: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})

app.get('/stations_sba/tramway', (request, response) => {
    stations_sba.find({ type: 'tramway' }).sort({ numero: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            //""
            return;
        }
        response.json(data);
    });
})

app.get('/stations_sba/bus/:numero', (request, response) => {
    var data = request.params.numero;
    var slice = "";
    var dataFinal = data;
    if (data.length > 4) {
        slice = data.slice(-2);
        dataFinal = data.replace(slice, "")
    }
    console.log("DataFinal " + '"' + dataFinal + '"')
    // console.log(data)
    stations_sba.find({ type: 'bus', numero: RegExp("^" + dataFinal) }).sort({ numero: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
        // let str1 = "A03_00";
        // let str2 = "A03bis_01";
        // let str3 = str1.substring(0, 3)
        // let str4 = str2.substring(0, 6)

        // console.log(str1 + " | " + str3)
        // console.log(str2 + " | " + str4)
        // console.log(new RegExp("^" + str4).test(str2));
    });
})

app.get('/stations_sba', (request, response) => {
    stations_sba.find({}).sort({ numero: 1, type: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})

app.get('/stations_sba/names', (request, response) => {
    stations_sba.find({}, { nomFr: 1, numero: 1 }).sort({ numero: 1, type: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})



app.get('/correspondance', (request, response) => {
    correspondance.find({}).sort({ ID: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
})

app.get('/matrice', (request, response) => {
    matrice.find({}).sort({ numerodepart: 1, numeroarrive: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
        console.log(data)
    });
})

app.get('/matrice/veryclose', (request, response) => {
    matrice.find({ duration: { $lt: 100, $gt: 1 } }).sort({ numerodepart: 1, duration: 1, numeroarrive: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
        console.log(data)
    });
})

app.get('/matrice/:numero', (request, response) => {
    var data = request.params.numero;
    var slice = "";
    var dataFinal = data;
    if (data.length > 4) {
        slice = data.slice(-2);
        dataFinal = data.replace(slice, "")
    }
    console.log("DataFinal " + '"' + dataFinal + '"')
    // console.log(data)
    matrice.find({ numerodepart: RegExp("^" + dataFinal) }).sort({ numerodepart: 1, numeroarrive: 1 }).exec(function (err, data) {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
        console.log(data)
    });

})