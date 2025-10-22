export interface Device {
  id: number;
  name: string;
  mac: string;
  status: 'ATIVO' | 'INATIVO';
  created_at: Date;
}

export interface CreateDeviceRequest {
  name: string;
  mac: string;
}

export interface UpdateDeviceStatusRequest {
  status?: 'ATIVO' | 'INATIVO';
}