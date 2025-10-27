
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`✅ S-Tech Backend corriendo en http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Puerto ${PORT} ya está en uso`);
    process.exit(1);
  }
  throw err;
});