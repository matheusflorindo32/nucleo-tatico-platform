"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Target, Clock, BookOpen, Award, 
  BarChart3, PieChart as PieChartIcon, Download
} from 'lucide-react'

interface DashboardStatsProps {
  userId: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function DashboardStats({ userId }: DashboardStatsProps) {
  // Dados de exemplo - em produção viriam da API
  const dailyData = [
    { date: '01/03', questions: 25, correct: 20, time: 120 },
    { date: '02/03', questions: 30, correct: 24, time: 150 },
    { date: '03/03', questions: 20, correct: 18, time: 100 },
    { date: '04/03', questions: 35, correct: 28, time: 180 },
    { date: '05/03', questions: 40, correct: 32, time: 200 },
    { date: '06/03', questions: 28, correct: 23, time: 140 },
    { date: '07/03', questions: 32, correct: 26, time: 160 },
  ]

  const subjectData = [
    { name: 'Direito', value: 35, color: '#0088FE' },
    { name: 'Português', value: 25, color: '#00C49F' },
    { name: 'Matemática', value: 20, color: '#FFBB28' },
    { name: 'Informática', value: 15, color: '#FF8042' },
    { name: 'Atualidades', value: 5, color: '#8884D8' },
  ]

  const difficultyData = [
    { level: 'Fácil', correct: 85, total: 100 },
    { level: 'Médio', correct: 65, total: 100 },
    { level: 'Difícil', correct: 45, total: 100 },
    { level: 'Muito Difícil', correct: 25, total: 100 },
  ]

  const statsCards = [
    {
      title: "Taxa de Acerto",
      value: "78%",
      change: "+5.2%",
      trending: "up" as const,
      icon: <Target className="h-4 w-4" />,
      description: "Em relação à semana passada"
    },
    {
      title: "Tempo de Estudo",
      value: "42h",
      change: "+8h",
      trending: "up" as const,
      icon: <Clock className="h-4 w-4" />,
      description: "Total este mês"
    },
    {
      title: "Questões Respondidas",
      value: "1,248",
      change: "+156",
      trending: "up" as const,
      icon: <BookOpen className="h-4 w-4" />,
      description: "Acumulado"
    },
    {
      title: "Disciplinas Dominadas",
      value: "8/12",
      change: "+2",
      trending: "up" as const,
      icon: <Award className="h-4 w-4" />,
      description: "Acima de 80% de acerto"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trending === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Desempenho Diário */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Desempenho Diário</CardTitle>
                <CardDescription>Evolução das respostas corretas</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Detalhes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="correct" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Respostas Corretas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="questions" 
                    stroke="#82ca9d" 
                    name="Total de Questões"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Disciplina */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Distribuição por Disciplina</CardTitle>
                <CardDescription>Questões respondidas por matéria</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Detalhes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} questões`, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Desempenho por Dificuldade */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Desempenho por Nível de Dificuldade</CardTitle>
                <CardDescription>Taxa de acerto por complexidade</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis label={{ value: 'Taxa de Acerto (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Acerto']} />
                  <Legend />
                  <Bar 
                    dataKey="correct" 
                    name="Taxa de Acerto" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalhadas</CardTitle>
          <CardDescription>Análise completa do desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Tempo Médio por Questão</div>
              <div className="text-2xl font-bold">1.8min</div>
              <div className="text-xs text-muted-foreground">-0.2min vs média</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Questões do Dia</div>
              <div className="text-2xl font-bold">32/50</div>
              <div className="text-xs text-muted-foreground">Meta diária: 50 questões</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Streak Atual</div>
              <div className="text-2xl font-bold">14 dias</div>
              <div className="text-xs text-muted-foreground">Recorde: 21 dias</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Eficiência</div>
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-muted-foreground">Tempo produtivo vs total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integração com Apache Superset */}
      <Card>
        <CardHeader>
          <CardTitle>Análises Avançadas</CardTitle>
          <CardDescription>
            Dados integrados com Apache Superset para análises preditivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Dashboard Superset</h3>
                <p className="text-sm text-muted-foreground">
                  Análises preditivas e tendências de aprendizado
                </p>
              </div>
              <Button variant="outline" size="sm">
                Acessar Dashboard Completo
              </Button>
            </div>
            <div className="h-[200px] bg-muted rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Integração com Apache Superset para visualizações avançadas
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  • Análise preditiva de desempenho
                  <br />
                  • Identificação de padrões de estudo
                  <br />
                  • Recomendações personalizadas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}