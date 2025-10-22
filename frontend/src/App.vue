<template>
  <div id="app" :class="{'dark': isDark}" class="min-h-screen bg-background transition-colors duration-300">
    <!-- Header -->
    <header class="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Dispositivos</h1>
            <p class="text-muted-foreground mt-1 text-sm">Gerencie seus dispositivos em tempo real</p>
          </div>
          
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Alternar tema"
          >
            <svg v-if="isDark" class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Device Form -->
      <div class="mb-8">
        <div class="mb-6">
          <h2 class="text-lg font-medium text-foreground mb-2">Adicionar Dispositivo</h2>
          <p class="text-sm text-muted-foreground">Cadastre um novo dispositivo na rede</p>
        </div>
        
        <form @submit.prevent="createDevice" class="space-y-4 p-6 border rounded-lg bg-card">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium text-foreground">
                Nome do Dispositivo
              </label>
              <input
                id="name"
                v-model="newDevice.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder-muted-foreground"
                placeholder="Ex: Notebook João"
              />
            </div>
            
            <div class="space-y-2">
              <label for="mac" class="text-sm font-medium text-foreground">
                Endereço MAC
              </label>
              <input
                id="mac"
                v-model="newDevice.mac"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder-muted-foreground font-mono text-sm"
                placeholder="00:1B:44:11:3A:B7"
              />
            </div>
          </div>
          
          <div class="flex justify-end pt-2">
            <button
              type="submit"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Adicionar Dispositivo
            </button>
          </div>
        </form>
      </div>

      <!-- Devices List -->
      <div>
        <div class="mb-6">
          <h2 class="text-lg font-medium text-foreground mb-2">Dispositivos Cadastrados</h2>
          <p class="text-sm text-muted-foreground">
            {{ devices.length }} dispositivo{{ devices.length !== 1 ? 's' : '' }} encontrado{{ devices.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <div class="border rounded-lg bg-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="border-b bg-muted/50">
                <tr>
                  <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">ID</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Nome</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">MAC</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr 
                  v-for="device in devices" 
                  :key="device.id"
                  class="hover:bg-muted/30 transition-colors"
                >
                  <td class="py-3 px-4 text-sm text-foreground font-medium">#{{ device.id }}</td>
                  <td class="py-3 px-4 text-sm text-foreground">{{ device.name }}</td>
                  <td class="py-3 px-4 text-sm text-muted-foreground font-mono">{{ device.mac }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full',
                          device.status === 'ATIVO' ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      ></div>
                      <span class="text-sm font-medium" :class="device.status === 'ATIVO' ? 'text-foreground' : 'text-muted-foreground'">
                        {{ device.status }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <button 
                      @click="toggleStatus(device.id)"
                      class="text-sm px-3 py-1 rounded border hover:bg-accent transition-colors"
                      :class="device.status === 'ATIVO' ? 'text-muted-foreground' : 'text-foreground'"
                    >
                      {{ device.status === 'ATIVO' ? 'Desativar' : 'Ativar' }}
                    </button>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="devices.length === 0">
                  <td colspan="5" class="py-12 text-center">
                    <div class="text-muted-foreground">
                      <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p class="font-medium">Nenhum dispositivo cadastrado</p>
                      <p class="text-sm mt-1">Adicione seu primeiro dispositivo acima</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="mt-8 flex items-center justify-center text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <div 
            :class="[
              'w-2 h-2 rounded-full animate-pulse',
              socket && socket.connected ? 'bg-green-500' : 'bg-muted-foreground'
            ]"
          ></div>
          <span>{{ socket && socket.connected ? 'Conectado' : 'Desconectado' }}</span>
        </div>
      </div>
    </main>

    <!-- Notifications -->
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-right"
        :class="{
          'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200': notification.type === 'success',
          'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200': notification.type === 'info',
          'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200': notification.type === 'error'
        }"
      >
        <div class="flex items-center justify-between gap-4">
          <span class="text-sm font-medium">{{ notification.message }}</span>
          <button 
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default {
  name: 'App',
  data() {
    return {
      devices: [],
      newDevice: {
        name: '',
        mac: ''
      },
      socket: null,
      isDark: false,
      notifications: [],
      notificationId: 0
    };
  },
  async mounted() {
    // Load theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    this.isDark = savedTheme ? JSON.parse(savedTheme) : false;
    this.applyTheme();
    
    await this.fetchDevices();
    this.setupWebSocket();
  },
  methods: {
    async fetchDevices() {
      try {
        const response = await axios.get(`${API_URL}/devices`);
        this.devices = response.data;
      } catch (error) {
        console.error('Error fetching devices:', error);
        this.showNotification('Erro ao carregar dispositivos', 'error');
      }
    },
    
    async createDevice() {
      if (!this.newDevice.name.trim() || !this.newDevice.mac.trim()) {
        this.showNotification('Preencha todos os campos', 'error');
        return;
      }

      try {
        await axios.post(`${API_URL}/devices`, this.newDevice);
        this.newDevice = { name: '', mac: '' };
        this.showNotification('Dispositivo cadastrado com sucesso', 'success');
      } catch (error) {
        const message = error.response?.data?.error || 'Erro ao criar dispositivo';
        this.showNotification(message, 'error');
      }
    },
    
    async toggleStatus(deviceId) {
      try {
        await axios.patch(`${API_URL}/devices/${deviceId}/status`);
        this.showNotification('Status alterado com sucesso', 'success');
      } catch (error) {
        console.error('Error toggling status:', error);
        this.showNotification('Erro ao alterar status', 'error');
      }
    },
    
    setupWebSocket() {
      this.socket = io('http://localhost:3000');
      
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });
      
      this.socket.on('device:created', (device) => {
        this.devices.unshift(device);
        this.showNotification('Novo dispositivo adicionado', 'info');
      });
      
      this.socket.on('device:status', (device) => {
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index !== -1) {
          this.devices.splice(index, 1, device);
        }
      });
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
      localStorage.setItem('darkTheme', JSON.stringify(this.isDark));
    },

    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    showNotification(message, type = 'info') {
      const id = this.notificationId++;
      this.notifications.push({ id, message, type });
      
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    },

    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/inter-ui/3.19.3/inter.css');

* {
  font-family: 'Inter', sans-serif;
}

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.bg-background {
  background-color: hsl(var(--background));
}

.bg-card {
  background-color: hsl(var(--card));
}

.bg-muted {
  background-color: hsl(var(--muted));
}

.bg-accent {
  background-color: hsl(var(--accent));
}

.bg-primary {
  background-color: hsl(var(--primary));
}

.text-foreground {
  color: hsl(var(--foreground));
}

.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}

.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}

.border {
  border-color: hsl(var(--border));
}

/* Smooth transitions */
button, input, select, textarea {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.7);
}

/* Animation for notifications */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-in {
  animation: slideInRight 0.3s ease-out;
}
</style>