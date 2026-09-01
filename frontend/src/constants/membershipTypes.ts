export const MEMBERSHIP_TYPES = {
  church_member: {
    id: "church_member",
    label: "Church Member",
  },
  //add more types later on(such as church staff, organization member and more)
} as const;

export type MembershipTypeId = keyof typeof MEMBERSHIP_TYPES;