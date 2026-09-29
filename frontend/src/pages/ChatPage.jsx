import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { demoUsers } from '../data/demoUsers.js';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import Notice from '../components/common/Notice.jsx';

export default function ChatPage() {
  const { currentUser, registeredUsers } = useAuth(); const { messages, sendMessage, chatNotice } = useData();
  const users = [...demoUsers, ...registeredUsers]; const recipient = users.find(({ id }) => id !== currentUser.id);
  return <div className="container shopping-page"><p className="eyebrow">Comunicación</p><h1>Chat contextual</h1><p>Mensajes locales para conservar el contexto entre tienda y distribuidor.</p><Notice notice={chatNotice} />
    <ChatWindow messages={messages} conversationId="conv001" users={users} currentUser={currentUser} recipientId={recipient?.id} onSend={sendMessage} /></div>;
}
