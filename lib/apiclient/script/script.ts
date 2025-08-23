import { Block } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

// Types
interface Script {
  id: number;
  title: string;
  blocks: { data: Block[] }; // JSONB type
  user_id: string;
  created_at: string;
  updated_at: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 1. Get paginated scripts for the current user
export async function getScripts(
  page: number = 0,
  limit: number = 10
): Promise<ApiResponse<Script[]>> {
  try {
    const supabase = createClient();
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { success: true, data: data as Script[] };
  } catch (error) {
    console.error("Error fetching scripts:", error);
    return { success: false, error: (error as Error).message };
  }
}

// 1.5 Get a single script by id
export async function getScriptById(id: number): Promise<ApiResponse<Script>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as Script };
  } catch (error) {
    console.error("Error fetching script by id:", error);
    return { success: false, error: (error as Error).message };
  }
}

// 2. Create a new script
export async function createScript(
  title: string
): Promise<ApiResponse<Script>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("scripts")
      .insert({
        title,
        // user_id and created_at are set automatically
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as Script };
  } catch (error) {
    console.error("Error creating script:", error);
    return { success: false, error: (error as Error).message };
  }
}

// 3. Update an existing script
export async function updateScript(
  id: number,
  updates: Partial<Pick<Script, "title" | "blocks">>
): Promise<ApiResponse<Script>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("scripts")
      .update({
        ...updates,
        updated_at: new Date().toISOString(), // Optional: manual update timestamp
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as Script };
  } catch (error) {
    console.error("Error updating script:", error);
    return { success: false, error: (error as Error).message };
  }
}

// 4. Delete a script by id
export async function deleteScript(id: number): Promise<ApiResponse<Script>> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("scripts")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as Script };
  } catch (error) {
    console.error("Error deleting script:", error);
    return { success: false, error: (error as Error).message };
  }
}
