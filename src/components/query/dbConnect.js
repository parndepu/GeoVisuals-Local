import mongoose from 'mongoose';

export default function (dbname)
{
    // Make connection to database
    mongoose.connect('mongodb://localhost/' + dbname, { useNewUrlParser: true });
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error' ));
    db.once('open', function () {
        console.log('Connect to ' + dbname  + ' database');
    });

    return;
}