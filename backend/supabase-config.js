// 🎯 Configuração do Supabase para Núcleo Tático
// Licença: Apache 2.0 (permissiva)

const { createClient } = require('@supabase/supabase-js')

// Configurações do ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key'

// Cliente para frontend (apenas leitura)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Cliente para backend (acesso total)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Funções utilitárias do banco de dados
const db = {
  // USUÁRIOS
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // QUESTÕES
  async getQuestions(filters = {}) {
    let query = supabase.from('questions').select(`
      *,
      exam_board:exam_boards(*),
      contest:contests(*),
      subject:subjects(*)
    `)

    // Aplicar filtros
    if (filters.exam_board_id) query = query.eq('exam_board_id', filters.exam_board_id)
    if (filters.contest_id) query = query.eq('contest_id', filters.contest_id)
    if (filters.subject_id) query = query.eq('subject_id', filters.subject_id)
    if (filters.year) query = query.eq('year', filters.year)
    if (filters.difficulty_level) query = query.eq('difficulty_level', filters.difficulty_level)
    if (filters.limit) query = query.limit(filters.limit)
    if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getQuestionById(questionId) {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        exam_board:exam_boards(*),
        contest:contests(*),
        subject:subjects(*)
      `)
      .eq('id', questionId)
      .single()
    
    if (error) throw error
    return data
  },

  // RESPOSTAS DO USUÁRIO
  async saveUserAnswer(userId, questionId, selectedAlternative, timeSpentSeconds) {
    // Primeiro, verificar a resposta correta
    const question = await this.getQuestionById(questionId)
    const correctAlternative = question.alternatives.find(alt => alt.correct)
    const isCorrect = correctAlternative?.letter === selectedAlternative

    const { data, error } = await supabase
      .from('user_answers')
      .upsert({
        user_id: userId,
        question_id: questionId,
        selected_alternative: selectedAlternative,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds,
        answered_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,question_id'
      })
      .select()
      .single()
    
    if (error) throw error

    // Atualizar estatísticas diárias
    await this.updateDailyStats(userId, isCorrect, timeSpentSeconds)

    return { ...data, correctAlternative: correctAlternative?.letter }
  },

  // ESTATÍSTICAS
  async updateDailyStats(userId, isCorrect, timeSpentSeconds) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existingStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    
    if (existingStats) {
      // Atualizar estatísticas existentes
      const updates = {
        questions_answered: existingStats.questions_answered + 1,
        correct_answers: existingStats.correct_answers + (isCorrect ? 1 : 0),
        study_time_minutes: existingStats.study_time_minutes + Math.ceil(timeSpentSeconds / 60)
      }
      
      await supabase
        .from('daily_stats')
        .update(updates)
        .eq('id', existingStats.id)
    } else {
      // Criar novas estatísticas
      await supabase
        .from('daily_stats')
        .insert({
          user_id: userId,
          date: today,
          questions_answered: 1,
          correct_answers: isCorrect ? 1 : 0,
          study_time_minutes: Math.ceil(timeSpentSeconds / 60)
        })
    }
  },

  async getUserStats(userId) {
    const { data, error } = await supabase.rpc('calculate_user_stats', {
      user_uuid: userId
    })
    
    if (error) throw error
    return data[0]
  },

  // CADERNO DE ERROS
  async getErrorNotebook(userId) {
    const { data, error } = await supabase
      .from('error_notebook')
      .select(`
        *,
        question:questions(*,
          exam_board:exam_boards(*),
          subject:subjects(*)
        )
      `)
      .eq('user_id', userId)
      .eq('reviewed', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addToErrorNotebook(userId, questionId, mistakeType, notes) {
    const { data, error } = await supabase
      .from('error_notebook')
      .insert({
        user_id: userId,
        question_id: questionId,
        mistake_type: mistakeType,
        notes: notes
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // APOSTILAS
  async generateBooklet(userId, config) {
    const { data, error } = await supabase
      .from('generated_booklets')
      .insert({
        user_id: userId,
        title: config.title || `Apostila ${new Date().toLocaleDateString()}`,
        config: config
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // DASHBOARD
  async getDashboardData(userId, days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [stats, dailyStats, errorNotebook] = await Promise.all([
      this.getUserStats(userId),
      supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true }),
      this.getErrorNotebook(userId)
    ])

    return {
      overallStats: stats,
      dailyProgress: dailyStats.data || [],
      pendingErrors: errorNotebook.length,
      accuracyTrend: this.calculateAccuracyTrend(dailyStats.data || [])
    }
  },

  calculateAccuracyTrend(dailyStats) {
    return dailyStats.map(day => ({
      date: day.date,
      accuracy: day.questions_answered > 0 
        ? (day.correct_answers / day.questions_answered) * 100 
        : 0
    }))
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  db
}