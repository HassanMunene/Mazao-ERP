import app from "./app.js";

import dotenv from 'dotenv';

// Load env variables;
dotenv.config();

const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});