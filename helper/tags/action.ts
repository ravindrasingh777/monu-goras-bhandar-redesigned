"use server";
import { db } from "../../db/index";
import { tags } from "../../db/schema";

export async function getAllTags() {
  try {
    const data = await db.select({ name: tags.name, id: tags.id }).from(tags);
    return data;
  } catch (error) {
    console.log("error", error);
    return [];
  }
}