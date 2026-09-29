import { useState } from 'react';
import { getConversationMessages } from '../../utils/messageUtils.js';

export default function ChatWindow({ messages, conversationId, users, currentUser, onSend, recipientId }) {
  const [text, setText] = useState('');
  const conversation = getConversationMessages(messages, conversationId);
  function submit(event) { event.preventDefault(); onSend({ conversationId, recipientId, text }); setText(''); }
  return <section className="chat-window" aria-labelledby="chat-title"><h2 id="chat-title">Conversación demo</h2>
    <div className="message-list">{conversation.map((message) => <p className={message.senderId === currentUser.id ? 'message message--mine' : 'message'} key={message.id}>
      <strong>{users.find(({ id }) => id === message.senderId)?.name ?? 'Usuario'}</strong>{message.text}</p>)}</div>
    <form className="chat-form" onSubmit={submit}><label htmlFor="message-text">Mensaje</label><input id="message-text" value={text} onChange={(event) => setText(event.target.value)} /><button type="submit">Enviar</button></form>
  </section>;
}
