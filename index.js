const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // puerto dinámico para Render

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando!');
});

// Ruta de login simulada
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if(username === 'usuario' && password === '1234'){
    res.json({ success: true, token: 'abc123', username });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
