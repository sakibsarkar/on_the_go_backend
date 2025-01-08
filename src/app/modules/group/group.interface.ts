export type GroupPrivacy = "public" | "private";

export interface IGroup {
  name: string;
  description: string;
  image: string;
  privacy: GroupPrivacy;
}
