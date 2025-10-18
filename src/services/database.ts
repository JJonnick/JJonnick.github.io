import { createClient } from '@supabase/supabase-js';
import { type Character, type Account } from "@/types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_KEY son requeridas');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getCharacters = async (): Promise<Character[]> => {
    const { data, error } = await supabase
        .from('character_data')
        .select('*');

    if (error) {
        console.error('Error fetching characters:', error);
        return [];
    }

    return data || [];
}

export const getCharacterById = async (id: number): Promise<Character | null> => {
    const { data, error } = await supabase
        .from('character_data')
        .select('*')
        .eq('id', id);

    if (error) {
        console.error('Error fetching character:', error);
        return null;
    }

    return data ? data[0] : null;
}

export const getAccount = async (): Promise<Account | null> => {
    const { data } = await supabase
        .from('account')
        .select('*, stats(*)')
        .limit(1)
        .single();

    return data;
}