export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  user_id: string;
  campaign_name: string;
  activity_date: string;
  location: string | null;
  hours: number | null;
  description: string | null;
  proof_url: string | null;
  status: SubmissionStatus;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "심사중",
  approved: "승인됨",
  rejected: "반려됨",
};

export const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-gold/20 text-yellow-700",
  approved: "bg-sprout/20 text-forest",
  rejected: "bg-red-100 text-red-600",
};
