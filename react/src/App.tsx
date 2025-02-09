import { useState, useEffect } from 'react';
import type {
  User,
  ChannelSort,
  ChannelFilters,
  ChannelOptions,
} from 'stream-chat';
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import MyChannelHeader from './MyChannelHeader';
import MyAIStateIndicator from './MyAIStateIndicator';

function App() {
  // User information
  const userId = 'anakin_skywalker';
  const userName = 'Anakin Skywalker';

  // State for Stream credentials and user
  const [apiKey, setApiKey] = useState<string>('');
  const [userToken, setUserToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Define user data
  const user: User = {
    id: userId,
    name: userName,
    image: 'https://getstream.io/random_svg/?name=' + userName,
  };

  // Initialize chat client with empty credentials first
  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  // Fetch token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch token');
        
        const data = await response.json();
        setApiKey(data.api_key);
        setUserToken(data.token);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching token:', error);
        setIsLoading(false);
      }
    };
    
    fetchToken();
  }, [userId]);

  if (isLoading || !chatClient) {
    return <div>Loading chat...</div>;
  }

  const filters: ChannelFilters = {
    type: 'messaging',
    members: { $in: [userId] },
  };

  const sort: ChannelSort = { last_message_at: -1 };
  const options: ChannelOptions = { state: true, presence: true, limit: 10 };

  return (
    <Chat client={chatClient}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <MyChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
        <MyAIStateIndicator />
      </Channel>
    </Chat>
  );
}

export default App;
