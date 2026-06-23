import { 
  users, 
  contactInquiries,
  blogPosts,
  type User, 
  type InsertUser,
  type ContactInquiry,
  type InsertContactInquiry,
  type BlogPost,
  type InsertBlogPost,
  type UpdateBlogPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  // Blog
  getBlogPosts(opts: { published?: boolean; limit?: number; offset?: number }): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: UpdateBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  getAllPublishedSlugs(): Promise<{ slug: string; updatedAt: Date }[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [result] = await db
      .insert(contactInquiries)
      .values(inquiry)
      .returning();
    return result;
  }

  // --- Blog ---
  async getBlogPosts(opts: { published?: boolean; limit?: number; offset?: number }): Promise<{ posts: BlogPost[]; total: number }> {
    const { published, limit = 20, offset = 0 } = opts;
    const conditions = published !== undefined ? eq(blogPosts.published, published) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(conditions);

    const posts = await db
      .select()
      .from(blogPosts)
      .where(conditions)
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return { posts, total: countResult?.count ?? 0 };
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db
      .insert(blogPosts)
      .values({
        ...post,
        publishedAt: post.published ? new Date() : null,
        readingTime: Math.ceil((post.content?.split(/\s+/).length ?? 0) / 200),
      })
      .returning();
    return result;
  }

  async updateBlogPost(id: number, data: UpdateBlogPost): Promise<BlogPost | undefined> {
    const existing = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (!existing.length) return undefined;

    const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };
    if (data.content) {
      updates.readingTime = Math.ceil(data.content.split(/\s+/).length / 200);
    }
    if (data.published && !existing[0].publishedAt) {
      updates.publishedAt = new Date();
    }

    const [result] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return result;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  async getAllPublishedSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
    return db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));
  }
}

export const storage = new DatabaseStorage();
