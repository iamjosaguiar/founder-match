// Store active connections
const connections = new Map<string, WritableStreamDefaultWriter>();

// Function to send notification to a specific user
export function sendNotificationToUser(userId: string, notification: any) {
  const connection = connections.get(userId);
  if (connection) {
    try {
      const encoder = new TextEncoder();
      const data = `data: ${JSON.stringify(notification)}\n\n`;
      connection.write(encoder.encode(data));
    } catch (error) {
      console.error('Error sending notification:', error);
      connections.delete(userId);
    }
  }
}

// Export the connections map so other API routes can use it
export { connections };