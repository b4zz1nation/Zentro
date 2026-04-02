export type AppRole = "super_admin" | "gym_owner" | "staff" | "member";

export type AuthContext = {
  authUserId: string;
  profileId: string;
  email: string | null;
  fullName: string;
  role: AppRole;
  workspaceId?: string;
  workspaceName?: string;
  branchIds: string[];
};
