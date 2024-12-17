import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define message structure
interface Message {
  user: string;
  text: string;
}

// Define typing payload
interface TypingPayload {
  user: string;
}

// Connect to the WebSocket server
const socket: Socket = io('http://localhost:3000');

function Chat(): JSX.Element {
  const [message, setMessage] = useState<string>(''); // State for input message
  const [messages, setMessages] = useState<Message[]>([]); // State for message history

  useEffect(() => {
    // Event listener for receiving messages
    socket.on('receiveMessage', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    // Event listener for typing indicator
    socket.on('userTyping', (data: TypingPayload) => {
      console.log(`${data.user} is typing...`);
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, []);

  // Emit a new message
  const sendMessage = (): void => {
    if (message.trim()) {
      socket.emit('sendMessage', { user: 'User1', text: message });
      setMessage(''); // Clear input after sending
    }
  };

  // Emit typing event
  const handleTyping = (): void => {
    socket.emit('typing', { user: 'User1' });
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.user}</strong>: {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
