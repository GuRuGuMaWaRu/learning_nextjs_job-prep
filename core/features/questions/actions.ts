import { cacheTag } from "next/cache";

import {
  getQuestionByIdDb,
  getQuestionsDb,
  insertQuestionDb,
} from "@/core/features/questions/db";
import {
  getQuestionIdTag,
  getQuestionJobInfoTag,
} from "@/core/features/questions/dbCache";
import { QuestionDifficulty } from "@/core/drizzle/schema";
import { DatabaseError } from "@/core/dal/helpers";

export async function getQuestions(jobInfoId: string) {
  "use cache";
  cacheTag(getQuestionJobInfoTag(jobInfoId));

  try {
    return await getQuestionsDb(jobInfoId);
  } catch (error) {
    console.error("Database error getting questions:", error);
    throw new DatabaseError("Failed to fetch questions from database", error);
  }
}

export async function insertQuestion(
  question: string,
  jobInfoId: string,
  difficulty: QuestionDifficulty
) {
  try {
    return await insertQuestionDb({
      text: question,
      jobInfoId,
      difficulty,
    });
  } catch (error) {
    console.error("Database error inserting question:", error);
    throw new DatabaseError("Failed to save question to database", error);
  }
}

export async function getQuestionById(questionId: string, userId: string) {
  "use cache";
  cacheTag(getQuestionIdTag(questionId));

  try {
    return await getQuestionByIdDb(questionId, userId);
  } catch (error) {
    console.error("Database error getting question:", error);
    throw new DatabaseError("Failed to fetch question from database", error);
  }
}
