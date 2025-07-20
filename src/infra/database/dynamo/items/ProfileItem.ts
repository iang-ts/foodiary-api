import { Profile } from "@application/entities/Profile";
import { AccountItem } from "./AccountItem";

export class ProfileItem {
  private readonly  type = 'Profile';
  private readonly keys: ProfileItem.keys;

  constructor(private readonly attrs: ProfileItem.Attributes) {
    this.keys = {
      PK: ProfileItem.getPK(this.attrs.accountId),
      SK: ProfileItem.getSK(this.attrs.accountId),
    }
  }

  toItem(): ProfileItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: this.type,
    }
  }

  static fromEntity(profile: Profile) {
    return new ProfileItem({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      birthDate: profile.birthDate.toISOString(),
    });
  }

  static toEntity(profileItem: ProfileItem.ItemType) {
    return new Profile({
      accountId: profileItem.accountId,
      activityLevel: profileItem.activityLevel,
      birthDate: new Date(profileItem.birthDate),
      gender: profileItem.gender,
      height: profileItem.height,
      name: profileItem.name,
      weight: profileItem.weight,
      createdAt: new Date(profileItem.createdAt),
    });
  }

  static getPK(accountId: string): ProfileItem.keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }


  static getSK(accountId: string): ProfileItem.keys['SK'] {
    return `ACCOUNT#${accountId}#PROFILE`;
  }
}

export namespace ProfileItem {
  export type keys = {
    PK: AccountItem.keys['PK'];
    SK: `ACCOUNT#${string}#PROFILE`;
  }

  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activityLevel: Profile.ActivityLevel;
    createdAt: string;
  }

  export type ItemType = keys & Attributes & {
    type: 'Profile'
  }
}
