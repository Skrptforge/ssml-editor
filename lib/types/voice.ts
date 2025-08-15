/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VoiceData {
  voices: Voice[];
  has_more: boolean;
  total_count: number;
  next_page_token: string;
}

export interface Voice {
  voice_id: string;
  name: string;
  samples: Sample[];
  category: string;
  fine_tuning: FineTuning;
  labels: Record<string, any>;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: Settings;
  sharing: Sharing;
  high_quality_base_model_ids: string[];
  verified_languages: VerifiedLanguage[];
  safety_control: string;
  voice_verification: VoiceVerification;
  permission_on_resource: string;
  is_owner: boolean;
  is_legacy: boolean;
  is_mixed: boolean;
  created_at_unix: number;
}

export interface Sample {
  sample_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
  duration_secs: number;
  remove_background_noise: boolean;
  has_isolated_audio: boolean;
  has_isolated_audio_preview: boolean;
  speaker_separation: SpeakerSeparation;
  trim_start: number;
  trim_end: number;
}

export interface SpeakerSeparation {
  voice_id: string;
  sample_id: string;
  status: string;
  speakers: Record<string, any>;
  selected_speaker_ids: string[];
}

export interface FineTuning {
  is_allowed_to_fine_tune: boolean;
  state: Record<string, any>;
  verification_failures: string[];
  verification_attempts_count: number;
  manual_verification_requested: boolean;
  language: string;
  progress: Record<string, any>;
  message: Record<string, any>;
  dataset_duration_seconds: number;
  verification_attempts: VerificationAttempt[];
  slice_ids: string[];
  manual_verification: ManualVerification;
  max_verification_attempts: number;
  next_max_verification_attempts_reset_unix_ms: number;
  finetuning_state: any;
}

export interface VerificationAttempt {
  text: string;
  date_unix: number;
  accepted: boolean;
  similarity: number;
  levenshtein_distance: number;
  recording: Recording;
}

export interface Recording {
  recording_id: string;
  mime_type: string;
  size_bytes: number;
  upload_date_unix: number;
  transcription: string;
}

export interface ManualVerification {
  extra_text: string;
  request_time_unix: number;
  files: VerificationFile[];
}

export interface VerificationFile {
  file_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  upload_date_unix: number;
}

export interface Settings {
  stability: number;
  use_speaker_boost: boolean;
  similarity_boost: number;
  style: number;
  speed: number;
}

export interface Sharing {
  status: string;
  history_item_sample_id: string;
  date_unix: number;
  whitelisted_emails: string[];
  public_owner_id: string;
  original_voice_id: string;
  financial_rewards_enabled: boolean;
  free_users_allowed: boolean;
  live_moderation_enabled: boolean;
  rate: number;
  fiat_rate: number;
  notice_period: number;
  disable_at_unix: number;
  voice_mixing_allowed: boolean;
  featured: boolean;
  category: string;
  reader_app_enabled: boolean;
  image_url: string;
  ban_reason: string;
  liked_by_count: number;
  cloned_by_count: number;
  name: string;
  description: string;
  labels: Record<string, any>;
  review_status: string;
  review_message: string;
  enabled_in_library: boolean;
  instagram_username: string;
  twitter_username: string;
  youtube_username: string;
  tiktok_username: string;
  moderation_check: ModerationCheck;
  reader_restricted_on: ReaderRestricted[];
}

export interface ModerationCheck {
  date_checked_unix: number;
  name_value: string;
  name_check: boolean;
  description_value: string;
  description_check: boolean;
  sample_ids: string[];
  sample_checks: number[];
  captcha_ids: string[];
  captcha_checks: number[];
}

export interface ReaderRestricted {
  resource_type: string;
  resource_id: string;
}

export interface VerifiedLanguage {
  language: string;
  model_id: string;
  accent: string;
  locale: string;
  preview_url: string;
}

export interface VoiceVerification {
  requires_verification: boolean;
  is_verified: boolean;
  verification_failures: string[];
  verification_attempts_count: number;
  language: string;
  verification_attempts: VerificationAttempt[];
}
