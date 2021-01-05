'use strict';

let express 	     = require('express'),
    bodyParser 	   = require('body-parser'),
    cors 		       = require('cors'),
    restAPI        = require('./core/restapi.js'),
    port           = process.env.PORT || 1337;

// create app
const app = express();

// config
app.set('view engine', 'ejs');
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors({
    'Content-Type': 'application/json',
    'allowedHeaders': ['Origin', 'Content-Type', 'X-Requested-With', 'Accept', 'API-Key'],
    'exposedHeaders': ['sessionId'],
    'Access-Control-Allow-Origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': true
}));

// routes
restAPI(app);

app.listen(port, function(){
    console.log("       _____");
    console.log("    _.'_____`._");
    console.log("  .'.-'  12 `-.`.");
    console.log(" /,' 11      1 `.\\");
    console.log("// 10           2 \\\\");
    console.log(";;                 ::");
    console.log("|| 9  ---O-----  3 ||");
    console.log("::                 ;;");
    console.log("\\ 8            4  //");
    console.log(" \\`. 7       5 ,'/");
    console.log(" '.`-. __6__ .-'.'");
    console.log("   ((-._____.-))");
    console.log("   _))       ((_");
    console.log("  '--'SSt    '--'");
    console.log('Clock of change is ticking on Port ' + port);
});
