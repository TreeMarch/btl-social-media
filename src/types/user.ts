export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  isEmailVerified: boolean;
  stats: UserStats;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}
