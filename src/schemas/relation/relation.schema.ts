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