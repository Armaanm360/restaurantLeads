export interface ILoginRes {
  success: boolean;
  message: string;
  code: number;
  data?: { user_id: number; name: string };
  token?: string;
}
export interface IRegistration {
  name: string; // Agent's name
  avatar?: string; // Optional: Agent's avatar URL or file path
  email: string; // Agent's email (must be unique)
  phone?: string; // Optional: Agent's phone number
  password: string; // Password for agent login
  commission_rate?: number; // Optional: Commission rate as a decimal (e.g., 10.5 for 10.5%)
}
