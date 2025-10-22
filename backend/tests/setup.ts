import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

// Configurações globais para os testes
jest.setTimeout(10000);

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});