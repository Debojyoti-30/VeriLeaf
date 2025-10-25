// Use CommonJS requires to avoid ESM startup issues on some Node installs
const dotenv = require('dotenv');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const PORT = process.env.PORT || 4000;

// Helper to get OAuth token from Sentinel Hub
async function getToken(clientId, clientSecret) {
  const resp = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!resp.ok) {
    throw new Error(`token request failed: ${resp.status} ${await resp.text()}`);
  }

  const j = await resp.json();
  return j.access_token;
}

// Create process request payload
function makePayload(geojson, fromIso, toIso, width = 512, height = 512) {
  return {
    input: {
      bounds: { geometry: geojson.geometry },
      data: [
        {
          type: "sentinel-2-l2a",
          dataFilter: {
            timeRange: {
              from: `${fromIso}T00:00:00Z`,
              to: `${toIso}T23:59:59Z`,
            },
            maxCloudCoverage: 20, // small cloud filter
          },
        },
      ],
    },
    output: {
      width,
      height,
      responses: [{ identifier: "default", format: { type: "image/jpeg" } }],
    },
    evalscript: `
      // true color
      function setup() {
        return { input: ["B04", "B03", "B02"], output: { bands: 3 } };
      }
      function evaluatePixel(sample) {
        return [sample.B04, sample.B03, sample.B02];
      }
    `,
  };
}

app.post("/api/sentinel/process", async (req, res) => {
  try {
    const { geojson, beforeDate, afterDate, windowDays = 7 } = req.body;

    if (!geojson || !beforeDate || !afterDate) {
      return res
        .status(400)
        .json({ error: "geojson, beforeDate and afterDate required" });
    }

    const CLIENT_ID = process.env.SENTINEL_CLIENT_ID;
    const CLIENT_SECRET = process.env.SENTINEL_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res
        .status(500)
        .json({ error: "Sentinel credentials not configured on server" });
    }

    const token = await getToken(CLIENT_ID, CLIENT_SECRET);

    // compute windows
    const fromBefore = new Date(beforeDate);
    const toBefore = new Date(fromBefore);
    toBefore.setDate(toBefore.getDate() + windowDays);

    const fromAfter = new Date(afterDate);
    const toAfter = new Date(fromAfter);
    toAfter.setDate(toAfter.getDate() + windowDays);

    const payloadBefore = makePayload(
      geojson,
      fromBefore.toISOString().slice(0, 10),
      toBefore.toISOString().slice(0, 10)
    );
    const payloadAfter = makePayload(
      geojson,
      fromAfter.toISOString().slice(0, 10),
      toAfter.toISOString().slice(0, 10)
    );

    const processOne = async (payload) => {
      try {
        const r = await fetch("https://services.sentinel-hub.com/api/v1/process", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!r.ok) {
          const text = await r.text();
          throw new Error(`process failed: ${r.status} ${text}`);
        }

        const ab = await r.arrayBuffer();
        const buf = Buffer.from(ab);
        return buf.toString("base64");
      } catch (err) {
        console.error('processOne error', err && err.message ? err.message : err);
        throw err;
      }
    };

    const [beforeB64, afterB64] = await Promise.all([
      processOne(payloadBefore),
      processOne(payloadAfter),
    ]);

    res.json({ before: beforeB64, after: afterB64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

// Diagnostic endpoint: attempt token exchange and return provider response (no token returned)
app.post('/api/sentinel/check-token', async (req, res) => {
  try {
    const CLIENT_ID = process.env.SENTINEL_CLIENT_ID;
    const CLIENT_SECRET = process.env.SENTINEL_CLIENT_SECRET;
    if (!CLIENT_ID || !CLIENT_SECRET) return res.status(500).json({ error: 'Sentinel credentials not configured on server' });
    try {
      await getToken(CLIENT_ID, CLIENT_SECRET);
      return res.json({ ok: true, message: 'token request succeeded' });
    } catch (e) {
      // return provider message for diagnostics
      return res.status(502).json({ ok: false, error: String(e) });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

try {
  app.listen(PORT, () => console.log(`✅ Sentinel server listening on port ${PORT}`));
} catch (err) {
  console.error('Failed to start sentinel server', err && err.stack ? err.stack : err);
  process.exit(1);
}
// server started