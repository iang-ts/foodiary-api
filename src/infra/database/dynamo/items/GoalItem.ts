import { Goal } from "@application/entities/Goal";
import { AccountItem } from "./AccountItem";

export class GoalItem {
  static readonly  type = 'Goal';
  private readonly keys: GoalItem.keys;

  constructor(private readonly attrs: GoalItem.Attributes) {
    this.keys = {
      PK: GoalItem.getPK(this.attrs.accountId),
      SK: GoalItem.getSK(this.attrs.accountId),
    }
  }

  toItem(): GoalItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: GoalItem.type,
    }
  }

  static fromEntity(goal: Goal) {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  static toEntity(goalItem: GoalItem.ItemType) {
    return new Goal({
      accountId: goalItem.accountId,
      calories: goalItem.calories,
      carbohydrates: goalItem.carbohydrates,
      fats: goalItem.fats,
      proteins: goalItem.proteins,
      createdAt: new Date(goalItem.createdAt),
    });
  }

  static getPK(accountId: string): GoalItem.keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }


  static getSK(accountId: string): GoalItem.keys['SK'] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {
  export type keys = {
    PK: AccountItem.keys['PK'];
    SK: `ACCOUNT#${string}#GOAL`;
  }

  export type Attributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt: string;
  }

  export type ItemType = keys & Attributes & {
    type: 'Goal'
  }
}
