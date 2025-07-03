// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '' //URL do Supabase
const supabaseAnonKey = '' //Key do Supabase

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getAgricultureData(){
    const {data: history, error: historyError} = await supabase
        .from('Sensors')
        .select('*')
        .order('date', {ascending: true})
        .limit(24)

    if(historyError){
        console.error("Não foi possível buscar o histórico de parâmetros")
        return {latest: null, history: []}
    }

    const latest = history[0] || null
    return {latest, history}
}

export async function getIaData() {
    const { data, error } = await supabase
        .from('Feedback_IA')
        .select('*')
        .order('acuracia', {ascending: false})

    if (error) {
        console.error("Erro ao buscar dados:", error)
        return []
    }

    return data || []
}