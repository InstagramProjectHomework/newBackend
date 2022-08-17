import app from "./app";
import db from "./database";
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listen on port:`, port);
});
