import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Store active connections
const connections = new Map<string, WritableStreamDefaultWriter>();

export async function GET(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const requestedUserId = url.searchParams.get('userId');

    if (requestedUserId !== userId) {
      return new Response('Forbidden', { status: 403 });
    }

    // Create a readable stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

        // Store the controller so we can send messages later
        const writer = {
          write: (chunk: Uint8Array) => {
            try {
              controller.enqueue(chunk);
            } catch (error) {
              console.error('Error writing to stream:', error);
            }
          },
          close: () => {
            try {
              controller.close();
            } catch (error) {
              console.error('Error closing stream:', error);
            }
          }
        } as WritableStreamDefaultWriter;

        connections.set(userId, writer);

        // Keep connection alive with periodic heartbeat
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`));
          } catch (error) {
            console.error('Heartbeat failed:', error);
            clearInterval(heartbeat);
            connections.delete(userId);
          }
        }, 30000); // Every 30 seconds

        // Clean up when connection closes
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
          connections.delete(userId);
        });
      },
      cancel() {
        connections.delete(userId);
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error('Stream error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

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