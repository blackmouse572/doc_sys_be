type MemberAddProps = {
  users: JwtUser[];
  message?: string;
};

type MemberKickProps = MemberAddProp & {
  admin: JwtUser;
};

interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  message: ({ message }: { message: Message }) => void;
  memberAdded: ({ users, admin }: MemberAddProps) => void;
  memberKicked: ({ users, admin }: MemberKickProps) => void;
}

//----------------------------------------------------
type AddMembersProps = {
  roomId: string;
  userEmails: string[];
};

type MemberKickProps = MemberAddProp & {
  admin: JwtUser;
};

interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  send: ({ roomId, content }: { roomId: string; content: string }) => void;
  addMembers: ({ roomId, userEmails }: AddMembersProps) => void;
  typing: () => void;
  stopTyping: () => void;
  leaveRoom: (room: string) => void;
  kick: ({ roomId, users }: MemberKickProps) => void;
}

export type { ServerToClientEvents, ClientToServerEvents };
