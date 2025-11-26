const express = require('express');
const bodyParser = require('body-parser');
const { exec, spawn } = require('child_process');
const cors = require('cors'); // Include the CORS package
const app = express();
const port = 3002;
const host = "localhost"; //LINE_TO_BE_REPLACED_XYZ

// Middleware to parse request body
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

// Hashing APIs
app.post('/hash/:type', (req, res) => {
  const { type } = req.params;
  const { text } = req.body;
  const allowedHashes = ['md5', 'sha1'];

  if (!allowedHashes.includes(type)) {
    return res.status(400).send({ error: "Invalid hash type. Use \"md5\" or \"sha1\"." });
  }

  const openssl = spawn('openssl', ['dgst', `-${type}`]);
  let stdout = '';
  let stderr = '';

  openssl.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  openssl.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  openssl.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: stderr || 'OpenSSL error' });
    }
    res.send({ hash: stdout.split("= ")[1].trim() });
  });
  openssl.stdin.write(text);
  openssl.stdin.end();
});

// DES Encrypt API
app.post('/encrypt/des', (req, res) => {
  const { text, key } = req.body;


  const openssl = spawn('openssl', ['enc', '-des-ecb', '-e', '-salt', '-base64', '-k', key]);
  let stdout = '';
  let stderr = '';

  openssl.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  openssl.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  openssl.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: stderr || 'OpenSSL error' });
    }
    res.send({ encrypted: stdout.trim() });
  });
  openssl.stdin.write(text);
  openssl.stdin.end();
});

// DES Decrypt API
app.post('/decrypt/des', (req, res) => {
  const { text, key } = req.body;


  const openssl = spawn('openssl', ['enc', '-des-ecb', '-d', '-salt', '-base64', '-k', key]);
  let stdout = '';
  let stderr = '';

  openssl.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  openssl.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  openssl.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: stderr || 'OpenSSL error' });
    }
    res.send({ decrypted: stdout.trim() });
  });
  openssl.stdin.write(text);
  openssl.stdin.end();
});

// AES Encrypt API
app.post('/encrypt/aes', (req, res) => {
  const { text, key } = req.body;

  const openssl = spawn('openssl', ['enc', '-aes-256-cbc', '-base64', '-pass', `pass:${key}`, '-iv', '00000000000000000000000000000000']);
  let stdout = '';
  let stderr = '';

  openssl.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  openssl.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  openssl.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: stderr || 'OpenSSL error' });
    }
    res.send({ encrypted: stdout.trim() });
  });
  openssl.stdin.write(text);
  openssl.stdin.end();
});

// AES Decrypt API
app.post('/decrypt/aes', (req, res) => {
  const { text, key } = req.body;

  const openssl = spawn('openssl', ['enc', '-aes-256-cbc', '-d', '-base64', '-pass', `pass:${key}`, '-iv', '00000000000000000000000000000000']);
  let stdout = '';
  let stderr = '';

  openssl.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  openssl.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  openssl.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: stderr || 'OpenSSL error' });
    }
    res.send({ decrypted: stdout.trim() });
  });
  openssl.stdin.write(text);
  openssl.stdin.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Crypto API running at http://${host}:${port}`);
});


