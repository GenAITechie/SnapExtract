
// This file can be used for shared type definitions across your application.

/**
 * Represents the structure of a user's profile.
 * Currently, it only contains an email address.
 */
export interface UserProfile {
  email: string | null;
}

// You can add other shared types or interfaces here as your application grows.
// For example, if you have common data structures used by multiple components or services.

// Example:
// export interface BillItem {
//   id: string;
//   description: string;
//   amount: number;
//   category?: string;
// }
