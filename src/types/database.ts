// Database types for Zenith Financial Portal

export type UserRole = 'client' | 'advisor' | 'admin';

export type ClientStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'filed';

export type DocumentCategory = 'w2' | '1099' | 'receipts' | 'other_income' | 'deductions' | 'other';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type WorkflowStage =
  | 'document_collection'
  | 'review'
  | 'preparation'
  | 'client_review'
  | 'filing'
  | 'completed';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  mfa_enabled: boolean;
  mfa_secret?: string;
  email_verified: boolean;
  active: boolean;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ClientProfile {
  id: number;
  user_id: number;
  assigned_advisor_id?: number;
  tax_year: number;
  status: ClientStatus;
  ssn_last_four?: string;
  date_of_birth?: Date;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  filing_status?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: number;
  client_id: number;
  uploaded_by: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  tax_year: number;
  encrypted: boolean;
  encryption_key_id?: string;
  version: number;
  parent_document_id?: number;
  description?: string;
  uploaded_at: Date;
  updated_at: Date;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject?: string;
  content: string;
  read_at?: Date;
  has_attachment: boolean;
  parent_message_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface MessageAttachment {
  id: number;
  message_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: Date;
}

export interface Appointment {
  id: number;
  client_id: number;
  advisor_id: number;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  timezone: string;
  status: AppointmentStatus;
  meeting_url?: string;
  meeting_notes?: string;
  google_calendar_event_id?: string;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  client_id: number;
  assigned_to?: number;
  created_by: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  completed_at?: Date;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Workflow {
  id: number;
  client_id: number;
  tax_year: number;
  current_stage: WorkflowStage;
  stage_updated_at: Date;
  started_at: Date;
  completed_at?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowHistory {
  id: number;
  workflow_id: number;
  previous_stage?: WorkflowStage;
  new_stage: WorkflowStage;
  changed_by: number;
  notes?: string;
  created_at: Date;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  read_at?: Date;
  action_url?: string;
  metadata?: any;
  created_at: Date;
}

export interface EmailQueue {
  id: number;
  recipient_email: string;
  subject: string;
  template_name: string;
  template_data?: any;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: Date;
  error_message?: string;
  retry_count: number;
  created_at: Date;
}

// Joined types for common queries
export interface ClientWithProfile extends User {
  client_profile?: ClientProfile;
  advisor_name?: string;
}

export interface TaskWithUsers extends Task {
  client_name?: string;
  assigned_to_name?: string;
  created_by_name?: string;
}

export interface AppointmentWithUsers extends Appointment {
  client_name?: string;
  advisor_name?: string;
}

export interface MessageWithUsers extends Message {
  sender_name?: string;
  recipient_name?: string;
}
