import { createClient } from '@supabase/supabase-js';
import { type CharacterJson, type Stats } from "@/types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getCharacters = async (): Promise<CharacterJson[]> => {
    const { data, error } = await supabase
        .from('character_data')
        .select('*');

    if (error) {
        console.error('Error fetching characters:', error);
        return [];
    }

    return data.map((char, idx) => {
        return {
            id: char.name.toLowerCase().replace(/\s+/g, '-'),
            pos: idx
        }
    });
}

export const getCharacterByIndex = async (index: number) => {
    const { data, error } = await supabase
        .from('character_data')
        .select('*')
        .eq('id', index);

    if (error) {
        console.error('Error fetching character by index:', error);
        return null;
    }

    return data[0];
}

export const getStats = async (): Promise<Stats> => {
    const { data, error } = await supabase
        .from('stats')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching stats:', error);
        return null;
    }

    return data;
}
