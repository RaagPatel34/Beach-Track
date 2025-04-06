const mongoose = require('mongoose');
// Adjust the path based on your project structure if necessary
const { ConnectDB } = require('../lib/config/db.js');
const bulletinModel = require('../lib/models/bulletinModel.js').default; // Use .default if it's an ES module export

async function cleanupPastEvents() {
    let connection;
    try {
        console.log('Connecting to database...');
        // ConnectDB might return the connection instance or handle it internally
        // Assuming ConnectDB establishes the connection globally or returns it
        connection = await ConnectDB();
        console.log('Database connected.');

        const now = new Date();
        console.log(`Current time: ${now.toISOString()}`);

        console.log('Fetching events...');
        const events = await bulletinModel.find({});
        console.log(`Found ${events.length} events.`);

        let deletedCount = 0;
        const deletionPromises = [];

        for (const event of events) {
            try {
                // Combine date and endTime strings. Assumes YYYY-MM-DD and HH:MM format.
                // IMPORTANT: Adjust parsing logic if your date/time formats are different!
                const dateTimeString = `${event.date}T${event.endTime}:00`; // Append seconds for ISO-like format
                const eventEndTime = new Date(dateTimeString);

                // Check if parsing was successful
                if (isNaN(eventEndTime.getTime())) {
                    console.warn(`Skipping event "${event.title}" (ID: ${event._id}) due to invalid date/time format: date='${event.date}', endTime='${event.endTime}'`);
                    continue;
                }

                // Compare event end time with current time
                if (eventEndTime < now) {
                    console.log(`Marking event "${event.title}" (ID: ${event._id}) ending at ${eventEndTime.toISOString()} for deletion.`);
                    // Add the delete operation promise to the array
                    deletionPromises.push(bulletinModel.findByIdAndDelete(event._id));
                    deletedCount++;
                } else {
                    // console.log(`Keeping event "${event.title}" (ID: ${event._id}) ending at ${eventEndTime.toISOString()}.`);
                }
            } catch (parseError) {
                console.error(`Error processing event "${event.title}" (ID: ${event._id}):`, parseError);
            }
        }

        // Execute all delete operations concurrently
        if (deletionPromises.length > 0) {
            console.log(`Attempting to delete ${deletedCount} past events...`);
            await Promise.all(deletionPromises);
            console.log(`Successfully deleted ${deletedCount} past events.`);
        } else {
            console.log('No past events found to delete.');
        }

    } catch (error) {
        console.error('An error occurred during the cleanup process:', error);
    } finally {
        // Ensure the database connection is closed
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('Database connection closed.');
        }
    }
}

// Run the cleanup function
cleanupPastEvents();