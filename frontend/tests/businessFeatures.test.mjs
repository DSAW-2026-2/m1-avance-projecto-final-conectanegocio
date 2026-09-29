import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { distributors, stores } from '../src/data/organizations.js';
import { products } from '../src/data/products.js';
import { invoices } from '../src/data/invoices.js';
import { analyzeInvoice } from '../src/utils/invoiceAnalyzer.js';
import { getConversationMessages, sendMessageState } from '../src/utils/messageUtils.js';

test('invoice analyzer returns a transparent mock analysis', () => {
  const result = analyzeInvoice({ name: invoices[0].fileName }, stores, distributors, products);
  assert.equal(result.supplier.id, 'd001');
  assert.equal(result.items[0].product.id, 'p001');
});

test('chat appends a trimmed message and conversation sorting is deterministic', () => {
  const user = demoUsers[0]; const state = { messages: [], chatNotice: null };
  const next = sendMessageState(state, user, { conversationId: 'conv001', recipientId: 'u005', text: '  Hola  ' }, '2026-09-28T12:00:00Z');
  assert.equal(next.messages[0].text, 'Hola');
  assert.equal(getConversationMessages(next.messages, 'conv001').length, 1);
});
