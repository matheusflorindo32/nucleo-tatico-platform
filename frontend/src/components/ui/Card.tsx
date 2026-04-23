import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "education-card",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "education-heading text-2xl leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("education-body text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Educational Card Variants
interface EducationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

const EducationCard = React.forwardRef<HTMLDivElement, EducationCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "education-card",
      success: "card-success",
      warning: "card-warning",
      danger: "card-danger",
      info: "card-info",
    }

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    )
  }
)
EducationCard.displayName = "EducationCard"

// Module Card for Learning Content
interface ModuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  progress?: number
  moduleNumber?: number
  totalModules?: number
  status?: "not-started" | "in-progress" | "completed" | "locked"
}

const ModuleCard = React.forwardRef<HTMLDivElement, ModuleCardProps>(
  ({ 
    className, 
    title, 
    description, 
    progress = 0, 
    moduleNumber, 
    totalModules,
    status = "not-started",
    ...props 
  }, ref) => {
    const statusConfig = {
      "not-started": {
        color: "bg-gray-200",
        text: "Não iniciado",
        icon: "🔒",
      },
      "in-progress": {
        color: "bg-nucleo-primary",
        text: "Em andamento",
        icon: "⏳",
      },
      "completed": {
        color: "bg-nucleo-success",
        text: "Concluído",
        icon: "✅",
      },
      "locked": {
        color: "bg-gray-400",
        text: "Bloqueado",
        icon: "🔐",
      },
    }

    const config = statusConfig[status]

    return (
      <div
        ref={ref}
        className={cn("module-card", className)}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {moduleNumber && totalModules && (
              <span className="text-sm font-medium text-nucleo-primary">
                Módulo {moduleNumber} de {totalModules}
              </span>
            )}
            <h4 className="education-heading text-lg mt-1">{title}</h4>
            {description && (
              <p className="education-body text-sm mt-2">{description}</p>
            )}
          </div>
          <span className="text-2xl">{config.icon}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{config.text}</span>
            {progress > 0 && (
              <span className="font-medium text-nucleo-primary">{progress}%</span>
            )}
          </div>
          
          {progress > 0 && (
            <div className="progress-bar">
              <div 
                className={cn("progress-fill", config.color)}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)
ModuleCard.displayName = "ModuleCard"

// Exercise Card for Questions and Practice
interface ExerciseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  question?: string
  difficulty?: "easy" | "medium" | "hard"
  points?: number
  timeEstimate?: string
  topic?: string
}

const ExerciseCard = React.forwardRef<HTMLDivElement, ExerciseCardProps>(
  ({ 
    className, 
    question, 
    difficulty = "medium",
    points,
    timeEstimate,
    topic,
    ...props 
  }, ref) => {
    const difficultyConfig = {
      easy: {
        color: "bg-nucleo-success",
        text: "Fácil",
      },
      medium: {
        color: "bg-nucleo-warning",
        text: "Médio",
      },
      hard: {
        color: "bg-nucleo-danger",
        text: "Difícil",
      },
    }

    const config = difficultyConfig[difficulty]

    return (
      <div
        ref={ref}
        className={cn("exercise-card", className)}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {topic && (
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-nucleo-primary/10 text-nucleo-primary mb-2">
                {topic}
              </span>
            )}
            {question && (
              <p className="education-body">{question}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded text-white",
              config.color
            )}>
              {config.text}
            </span>
            
            {points && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {points} pontos
              </span>
            )}
          </div>
          
          {timeEstimate && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ⏱️ {timeEstimate}
            </span>
          )}
        </div>
      </div>
    )
  }
)
ExerciseCard.displayName = "ExerciseCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  EducationCard,
  ModuleCard,
  ExerciseCard,
}