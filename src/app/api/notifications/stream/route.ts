import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { connections } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await auth() as any;
    
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = (session.user as any).id;
    const url = new URL(request.url);
    const requestedUserId = url.searchParams.get('userId');
    const requestedEmail = url.searchParams.get('email');

    // Allow access if either userId matches or email matches (for client components)
    if (requestedUserId && requestedUserId !== userId) {
      return new Response('Forbidden', { status: 403 });
    }
    
    if (requestedEmail && requestedEmail !== session.user.email) {
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

