import { z } from "zod";

// Define the Zod schema for the post
export const postValidationSchema = z.object({
  title: z.string().min(1, "Title is required"), // Title must be a non-empty string
  content: z.string().min(1, "Content is required"), // Content must be a non-empty string
  images: z.array(z.string().url("Each image must be a valid URL")), // Array of image URLs
  category: z.enum(["Adventure", "Business Travel", "Exploration", "Others"]), // Enum for categories
  isPremium: z.boolean().optional(), // Boolean flag for premium status
});


