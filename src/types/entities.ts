/**
 * DevCodeX Entity Interfaces
 * 
 * TypeScript interfaces that mirror the C# entity models.
 * These are used throughout the application for type safety.
 * 
 * @see database-schema.md for backend entity definitions
 */

import type { DifficultyLevel, TechnologyType } from './enums';

/**
 * Base entity fields inherited by all entities
 * Matches C# BaseField class
 */
export interface BaseEntity {
  /** Primary Key (GUID) */
  Id: string;
  
  /** Soft delete flag */
  IsDeleted: boolean;
  
  /** UTC timestamp of creation */
  CreatedAt: string;
  
  /** UTC timestamp of last modification */
  UpdatedAt?: string;
}

/**
 * Technology entity
 * Categorization lookup for questions
 */
export interface Technology extends BaseEntity {
  /** Display name (e.g., "C#", "React", "System Design") */
  Name: string;
  
  /** Detailed info about the tech stack */
  Description?: string;
  
  /** Classification type */
  TechnologyType: TechnologyType;
}

/**
 * Technology list DTO with question count
 * Returned from POST /technology/list endpoint
 */
export interface TechnologyListDto {
  Id: string;
  Name: string;
  Description?: string;
  TechnologyType: TechnologyType;
  QuestionCount: number;
  CreatedAt: string;
}

/**
 * Question entity
 * Stores interview questions
 */
export interface Question extends BaseEntity {
  /** The main text of the question */
  Title: string;
  
  /** Additional context or code snippets */
  Description?: string;
  
  /** Foreign Key linking to Technology */
  TechnologyId: string;
  
  /** Difficulty classification */
  DifficultyLevel: DifficultyLevel;
  
  /** Related technology (populated on fetch) */
  Technology?: Technology;
  
  /** Related answers (populated on fetch) */
  Answers?: Answer[];
}

/**
 * Answer entity
 * Stores potential answers or solutions for a question
 */
export interface Answer extends BaseEntity {
  /** Foreign Key linking to Question */
  QuestionId: string;
  
  /** Answer text (supports Markdown or Rich Text) */
  Content?: string;
}

/**
 * Asset entity
 * Stores file metadata for uploads
 */
export interface Asset extends BaseEntity {
  /** Polymorphic ID (Question.Id or Answer.Id) */
  ParentId: string;
  
  /** Original name of the uploaded file */
  FileName?: string;
  
  /** MIME type (e.g., "image/png", "application/pdf") */
  FileType?: string;
  
  /** Public CDN or API URL to access the file */
  FileUrl?: string;
}

/**
 * DTO for creating a new question
 */
export interface CreateQuestionRequest {
  Title: string;
  Description?: string;
  TechnologyId: string;
  DifficultyLevel: DifficultyLevel;
}

/**
 * DTO for updating a question
 */
export interface UpdateQuestionRequest {
  Title?: string;
  Description?: string;
  TechnologyId?: string;
  DifficultyLevel?: DifficultyLevel;
}

/**
 * DTO for creating/updating an answer
 */
export interface SaveAnswerRequest {
  QuestionId: string;
  Content: string;
}

/**
 * DTO for creating a technology
 */
export interface CreateTechnologyRequest {
  Name: string;
  Description?: string;
  TechnologyType: TechnologyType;
}

/**
 * DTO for updating a technology
 */
export interface UpdateTechnologyRequest {
  Name?: string;
  Description?: string;
  TechnologyType?: TechnologyType;
}

/**
 * Filter options for questions list query
 */
export interface QuestionFilters {
  /** Search query for title */
  query?: string;
  technologyId?: string;
  difficultyLevel?: DifficultyLevel;
}

/**
 * DTO matching API QuestionListDto
 * Returned from POST /question/list
 */
export interface QuestionListDto {
  Id: string;
  Title?: string;
  TechnologyName?: string;
  DifficultyLevel: DifficultyLevel;
  CreatedAt: string;
}

/**
 * DTO matching API QuestionDetailDto
 * Returned from GET /question/{id}
 */
export interface QuestionDetailDto {
  Title: string;
  Description?: string;
  TechnologyId: string;
  TechnologyName?: string;
  DifficultyLevel: DifficultyLevel;
  /** The answer ID - always present since Answer is created with Question */
  AnswerId?: string;
  AnswerContent?: string;
}

/**
 * DTO matching API AnswerDetailDto
 * Returned from GET /answer/{id}
 */
export interface AnswerDetailDto {
  Content?: string;
}

/**
 * Asset request types
 */
export interface CreateAssetRequest {
  ParentId: string;
  FileName?: string;
  FileType?: string;
  FileUrl?: string;
}

export interface UpdateAssetRequest {
  FileName?: string;
  FileType?: string;
  FileUrl?: string;
}
