export interface ICreateApplication {
  userMemberId: number;
  status?: string;
}

export interface IUpdateApplication {
  status?: string;
  lastFilledPart?: number;
  rejectedReason?: string;
}
