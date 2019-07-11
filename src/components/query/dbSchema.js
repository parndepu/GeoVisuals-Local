import mongoose from 'mongoose';

/**
 * Geovisuals mongodb schema
 */
export default {
    
    Trip: function ()
    {
        // Create trip schema
        var trip_schema = new mongoose.Schema({
            upload_date: Date, // MM/DD/YYYY
            upload_time: String, // HH:MM:SS
            upload_location: String, // Address
            upload_description: String, // Trip description
            upload_optional: String // Optional description
        });

        return trip_schema;
    },

    Trip_data: function () 
    {
        // Create trip data schema
        var trip_data_schema = new mongoose.Schema({
            date: Date, // MM/DD/YYYY
            time: String, // HH:MM:SS
            location: {
                latitude: Number,
                longitude: Number,
            },
            narrative: String
        });

        // Create 2d indexing
        trip_data_schema.index('2dSphere');

        return trip_data_schema;
    }

}