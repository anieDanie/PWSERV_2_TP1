const express = require('express');
const mongoose = require('mongoose');
const RI_Record = require('./model/RI_Record');
const needle = require('needle');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
const path = require('path');
const apicache = require('apicache');

const app = express();
const port = 3000;

// Default: 100 docs (if no limit parameter in URL)
const vmURL_100 = 'https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f';
// Query 218 272 documents (only 32 000 retrieved by API call)
const vmURL_218272 = 'https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=218272';
const vmURL_5 = 'https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=05deae93-d9fc-4acb-9779-e0942b5e962f&limit=5';

const csvCollisionsRoutieres_100 = path.join(__dirname, 'collisions_routieres_100.csv');
const csvCollisionsRoutieres_all = path.join(__dirname, 'collisions_routieres.csv'); // taille: 78.3 MO

//MongoDB connexion: DB = 303-AH - collection = ri_records
const urlBD = 'mongodb://localhost:27017/304-AH';
mongoose.connect(urlBD);

// 'Cache Memory' for a route
let cache = apicache.middleware;

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use(express.static('public'));

// ROUTES

// EXTERNAL API CALL
app.get('/villeMontrealApi', cache('15 seconds'), async (req, res) => {

    await RI_Record.deleteMany({});

    try {
        const apiResponse = await needle('get', vmURL_100);
        const json = apiResponse.body;

        const documents = json.result.records;

        await RI_Record.insertMany(documents);

        res.status(200).json({DB_insert_allDocs: 'status: 200 (API CALL)'})               

    } catch (err) {
        console.log("WHAT HAPPENED ?! \n", err);
       
        const json = await csv().fromFile(csvCollisionsRoutieres_100);

        await RI_Record.insertMany(json);    
        
        res.status(200).json({DB_insert_allDocs: 'status: 200 (SF CSV File)'})        
    }        
})

// ***BD QUERIES***

// All documents in DB
app.get('/all', async (req, res) => {

    const all = await RI_Record.find({});
        
    res.json(all);
})

// MAP
app.get('/mostRecentRI', async (req, res) => {
    
    const mostRecentRI = await RI_Record
        .find()
        .sort({"DT_ACCDN": -1})
        .limit(1)
        .exec();
        
    const { LOC_LAT, LOC_LONG, RUE_ACCDN} = mostRecentRI[0];

    res.json({ LOC_LAT : LOC_LAT, LOC_LONG : LOC_LONG, RUE_ACCDN : RUE_ACCDN });
})

// DESC-1
app.get('/totalNumberOfVictims', async (req, res) => {
    
    const totalNumberOfVictims = await RI_Record
        .aggregate([{$group: {_id: null, sum_val: {$sum:"$NB_VICTIMES_TOTAL"}}}])
        .exec();    
    
    const {sum_val} = totalNumberOfVictims[0];

    res.json({ totalNumberOfVictims : sum_val });
})

// DESC-2
app.get('/mostFrequentDayOfWeek', async (req, res) => {
    
    const mostFrequentDayOfWeek = await RI_Record
        .aggregate([{"$group": {_id: "$JR_SEMN_ACCDN", count: {"$sum": 1}}}, 
                    {"$sort": {count: -1}},
                    {"$limit": 1}])
        .exec();
    
    const { _id } = mostFrequentDayOfWeek[0];
    console.log( _id)
    
    res.json({ mostFrequentDayOfWeek : _id });
})

// DESC-3
app.get('/mostFrequentMeteoCondition', async (req, res) => {
    
    const mostFrequentMeteoCondition = await RI_Record
        .aggregate([{"$group": {_id: "$CD_COND_METEO", count: {"$sum": 1}}}, 
                    {"$sort": {count: -1}},
                    {"$limit": 1}])
        .exec();
    
    const meteoCode = mostFrequentMeteoCondition[0]._id;

    switch(meteoCode){
        case 11:   
            meteoDesc = 'Clair';
            break;
        case 12:   
            meteoDesc = 'Couvert (nuageux/sombre)';
            break;
        case 13:   
            meteoDesc = 'Brouillard/brume';
            break;
        case 14:   
            meteoDesc = 'Pluie/bruine';
            break; 
        case 15:   
            meteoDesc = 'Averse (pluie forte)';
            break;                       
        case 16:   
            meteoDesc = 'Vent fort (pas de poudrerie, pas de pluie)';
            break;
        case 17:   
            meteoDesc = 'Neige/Grêle';
            break;
        case 18:   
            meteoDesc = 'Poudrerie/tempête de neige';
            break;
        case 19:   
            meteoDesc = 'Verglas';
            break;
        case 99:   
            meteoDesc = 'Autre';
            break;
        default:
            meteoDesc = 'nd';
            break;
    }

    res.json({ meteo : meteoDesc });
})

// DESC-4
app.get('/mostFrequentSurfaceCondition', async (req, res) => {
    
    const mostFrequentSurfaceCondition = await RI_Record
        .aggregate([{"$group": {_id: "$CD_ETAT_SURFC", count: {"$sum": 1}}}, 
                    {"$sort": {count: -1}},
                    {"$limit": 1}])
        .exec();
        
    const surfaceConditionCode = mostFrequentSurfaceCondition[0]._id;
    
    switch(surfaceConditionCode){
        case 11:   
            SCDesc = 'Sèche';
            break;
        case 12:   
            SCDesc = 'Mouillée';
            break;
        case 13:   
            SCDesc =`Accumulation d'eau (aquaplanage)`;
            break;
        case 14:   
            SCDesc = 'Sable, gravier sur la chaussée';
            break; 
        case 15:   
            SCDesc = 'Gadoue/neige fondante';
            break;                       
        case 16:   
            SCDesc = 'Enneigée';
            break;
        case 17:   
            SCDesc = 'Neige durcie';
            break;
        case 18:   
            SCDesc = 'Glacée';
            break;
        case 19:   
            SCDesc = 'Boueuse';
            break;
        case 20:   
            SCDesc = 'Huileuse';
            break;            
        case 99:   
            SCDesc = 'Autre';
            break;
        default:
            SCDesc = 'nd';
            break;
    }     
    res.json({ surface: SCDesc });
})

// DESC-5
app.get('/mostFrequentIlluminationConditions', async (req, res) => {
    
    const mostFrequentIlluminationConditions = await RI_Record
        .aggregate([{"$group": {_id: "$CD_ECLRM", count: {"$sum": 1}}}, 
                    {"$sort": {count: -1}},
                    {"$limit": 1}])
        .exec();
            
    const illuminationCode = mostFrequentIlluminationConditions[0]._id;
    
    switch(illuminationCode){
        case 1:   
            ICDesc = 'Jour et clarté';
            break;
        case 2:   
            ICDesc = 'Jour et demi-obscurité';
            break;
        case 3:   
            ICDesc = 'Nuit et chemin éclairé';
            break;
        case 4:   
            ICDesc = 'Nuit et chemin non-éclairé';
            break; 
        default:
            SSDesc = 'nd';
            break;
    }
      
    res.json({ illumination: ICDesc });
})

// AGG-1 
app.get('/numberOfDeceasedVictims', async (req, res) => {
    
    const numberOfDeceasedVictims = await RI_Record
        .aggregate([{$group: {_id: null, sum_val: {$sum:"$NB_MORTS"}}}])
        .exec();
        
    const { sum_val } = numberOfDeceasedVictims[0];
        
    res.json({ numberOfDeceasedVictims : sum_val });
})

// AGG-2
app.get('/deceasedVictimsAverageValue', async (req, res) => {
    
    const deceasedVictimsAverageValue = await RI_Record
        .aggregate([{$group: {_id: null, avg_val: {$avg:"$NB_MORTS"}}}])
        .exec();
    
    const { avg_val } = deceasedVictimsAverageValue[0];    
        
    res.json({ deceasedVictimsAverageValue : avg_val });
})

// AGG-3
app.get('/pedestrianVictimsAverageValue', async (req, res) => {
    
    const pedestrianVictimsAverageValue = await RI_Record
        .aggregate([{$group: {_id: null, avg_val: {$avg:"$NB_DECES_PIETON"}}}])
        .exec();
    
    const { avg_val } = pedestrianVictimsAverageValue[0]; 
        
    res.json({ pedestrianVictimsAverageValue : avg_val });
})

// AGG-4
app.get('/motorcyclistVictimsAverageValue', async (req, res) => {
    
    const motorcyclistVictimsAverageValue = await RI_Record
        .aggregate([{$group: {_id: null, avg_val: {$avg:"$NB_DECES_MOTO"}}}])
        .exec();

    const { avg_val } = motorcyclistVictimsAverageValue[0];         

    res.json({ motorcyclistVictimsAverageValue : avg_val });
})

// AGG-5
app.get('/cyclistVictimsAverageValue', async (req, res) => {
    
    const cyclistVictimsAverageValue = await RI_Record
        .aggregate([{$group: {_id: null, avg_val: {$avg:"$NB_DECES_VELO"}}}])
        .exec();

    const { avg_val } = cyclistVictimsAverageValue[0];          

    res.json({ cyclistVictimsAverageValue : avg_val });
})

app.listen(port, () => {
  console.log(`Serveur sur le port ${port}`);
})