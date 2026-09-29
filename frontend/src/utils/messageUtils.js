export function getConversationMessages(messages, conversationId) {
  return messages.filter(({ conversationId: id }) => id === conversationId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function sendMessageState(state, user, input, submittedAt) {
  const text = String(input?.text ?? '').trim();
  if (!user || !text || typeof input?.conversationId !== 'string') {
    return { ...state, chatNotice: { kind: 'error', message: 'Escribe un mensaje válido.' } };
  }
  const message = { id: `msg${String(state.messages.length + 1).padStart(3, '0')}`,
    conversationId: input.conversationId, senderId: user.id, recipientId: input.recipientId,
    text, timestamp: submittedAt };
  return { ...state, messages: [...state.messages, message], chatNotice: { kind: 'success', message: 'Mensaje enviado.' } };
}
