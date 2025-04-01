import { z } from "zod";

export enum RelationshipStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    BlockedTo = 'blocked_to',
    BlockedFrom = 'blocked_from',
    BlockedBoth = 'blocked_both',
  }


  export enum UpdateRelationStatus {
    Confirmed = 'confirmed',
    Rejected = 'rejected',
  }

  export enum UserRelationStatus {
    SentRequest = 'sentRequest',
    Friend = 'friend',
    ReceivedRequest = 'receivedRequest',
    None = 'none',
  }

export const friendsDetailsSchema = z.object({
  _id: z.string(),
  status: z.literal('confirmed'),
  userName: z.string(),
  userId: z.string(),
});

export type FriendsDetails = z.infer<typeof friendsDetailsSchema>;

export const friendDetailsResponseSchema = z.array(friendsDetailsSchema);