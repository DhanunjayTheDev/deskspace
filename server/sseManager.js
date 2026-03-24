// Tracks all active SSE response objects (one per connected admin tab)
const clients = new Set();

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}

/**
 * Broadcast a named SSE event to every connected admin client.
 * @param {string} event  - "lead" | "workspace"
 * @param {{ action: string, data: object }} payload
 */
function broadcast(event, payload) {
  const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of clients) {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  }
}

module.exports = { addClient, removeClient, broadcast };
