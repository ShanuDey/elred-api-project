const app = require("./app");
const port = process.env.API_PORT || "8000";

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
