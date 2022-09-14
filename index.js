const app = require("./app");
const port = process.env.PORT || "8000";
const host = process.env.HOST_NAME || "http://localhost";

app.listen(port, () => {
  console.log(`Server started on ${host}:${port}`);
});
