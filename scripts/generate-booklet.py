#!/usr/bin/env python3
"""
🎯 Gerador de Apostilas Núcleo Tático
Utiliza mdBook (MIT) + WeasyPrint (BSD) para gerar PDFs
Licença: MIT (permissiva)
"""

import os
import json
import subprocess
import tempfile
import shutil
from datetime import datetime
import markdown
from pathlib import Path

class BookletGenerator:
    def __init__(self, config):
        """
        Configuração do gerador de apostilas
        
        Args:
            config (dict): Configuração da apostila
                - title: Título da apostila
                - subjects: Lista de disciplinas
                - contests: Lista de concursos
                - difficulty: Nível de dificuldade
                - include_explanations: Incluir explicações
                - user_id: ID do usuário
        """
        self.config = config
        self.temp_dir = tempfile.mkdtemp(prefix="nucleo_tatico_")
        self.book_dir = os.path.join(self.temp_dir, "book")
        self.output_dir = os.path.join(self.temp_dir, "output")
        
        # Criar estrutura de diretórios
        os.makedirs(self.book_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        
    def generate_markdown_content(self, questions_data):
        """
        Gera conteúdo Markdown a partir das questões
        
        Args:
            questions_data (list): Lista de questões do banco de dados
        """
        content = []
        
        # Capa
        content.append(f"# {self.config.get('title', 'Apostila Núcleo Tático')}\n")
        content.append(f"**Gerado em:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        content.append(f"**Disciplinas:** {', '.join(self.config.get('subjects', []))}\n")
        content.append(f"**Concursos:** {', '.join(self.config.get('contests', []))}\n")
        content.append("---\n")
        
        # Organizar por disciplina
        questions_by_subject = {}
        for question in questions_data:
            subject_name = question.get('subject', {}).get('name', 'Geral')
            if subject_name not in questions_by_subject:
                questions_by_subject[subject_name] = []
            questions_by_subject[subject_name].append(question)
        
        # Conteúdo por disciplina
        for subject, questions in questions_by_subject.items():
            content.append(f"\n## {subject}\n")
            
            for i, question in enumerate(questions, 1):
                content.append(f"\n### Questão {i}\n")
                content.append(f"**Banca:** {question.get('exam_board', {}).get('acronym', 'N/A')}\n")
                content.append(f"**Ano:** {question.get('year', 'N/A')}\n")
                content.append(f"**Nível:** {question.get('difficulty_level', 'medium').replace('_', ' ').title()}\n")
                
                # Texto da questão
                content.append(f"\n{question.get('question_text', '')}\n")
                
                # Alternativas
                alternatives = question.get('alternatives', [])
                for alt in alternatives:
                    prefix = "✅" if alt.get('correct') else "  "
                    content.append(f"{prefix} **{alt.get('letter')}.** {alt.get('text', '')}")
                
                # Explicação (se configurado)
                if self.config.get('include_explanations') and question.get('explanation'):
                    content.append(f"\n**Explicação:**\n")
                    content.append(f"{question.get('explanation')}\n")
                
                content.append("\n---\n")
        
        # Sumário de estatísticas
        content.append("\n## 📊 Estatísticas da Apostila\n")
        content.append(f"- **Total de questões:** {len(questions_data)}\n")
        content.append(f"- **Disciplinas abordadas:** {len(questions_by_subject)}\n")
        content.append(f"- **Nível de dificuldade:** {self.config.get('difficulty', 'Misto')}\n")
        
        return "\n".join(content)
    
    def create_mdbook_structure(self, markdown_content):
        """
        Cria estrutura do mdBook
        """
        # Configuração do mdBook (toml)
        toml_config = f"""[book]
title = "{self.config.get('title', 'Apostila Núcleo Tático')}"
authors = ["Núcleo Tático"]
language = "pt-BR"

[output.html]
"""

        # Escrever configuração
        with open(os.path.join(self.book_dir, "book.toml"), "w") as f:
            f.write(toml_config)
        
        # Criar diretório src
        src_dir = os.path.join(self.book_dir, "src")
        os.makedirs(src_dir, exist_ok=True)
        
        # Escrever SUMMARY.md
        summary = f"""# Sumário

{self.config.get('title', 'Apostila Núcleo Tático')}

- [Conteúdo](content.md)
"""
        
        with open(os.path.join(src_dir, "SUMMARY.md"), "w") as f:
            f.write(summary)
        
        # Escrever conteúdo principal
        with open(os.path.join(src_dir, "content.md"), "w") as f:
            f.write(markdown_content)
    
    def generate_html(self):
        """
        Gera HTML usando mdBook
        """
        try:
            # Verificar se mdBook está instalado
            result = subprocess.run(["mdbook", "--version"], 
                                  capture_output=True, text=True)
            
            if result.returncode != 0:
                print("mdBook não encontrado. Instalando...")
                # Tentar instalar via cargo
                subprocess.run(["cargo", "install", "mdbook"], check=True)
            
            # Construir livro
            subprocess.run(["mdbook", "build", self.book_dir], 
                         check=True, 
                         capture_output=True)
            
            html_file = os.path.join(self.book_dir, "book", "index.html")
            if os.path.exists(html_file):
                return html_file
            else:
                raise FileNotFoundError("HTML não gerado pelo mdBook")
                
        except subprocess.CalledProcessError as e:
            print(f"Erro ao executar mdBook: {e}")
            # Fallback: gerar HTML simples com markdown
            return self.generate_html_fallback()
    
    def generate_html_fallback(self):
        """
        Fallback: gera HTML simples usando python-markdown
        """
        src_dir = os.path.join(self.book_dir, "src")
        content_file = os.path.join(src_dir, "content.md")
        
        with open(content_file, "r") as f:
            markdown_content = f.read()
        
        # Converter markdown para HTML
        html_content = markdown.markdown(markdown_content, extensions=['extra'])
        
        # Template HTML completo
        full_html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{self.config.get('title', 'Apostila Núcleo Tático')}</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }}
        h1 {{ color: #2c3e50; border-bottom: 2px solid #3498db; }}
        h2 {{ color: #34495e; }}
        h3 {{ color: #7f8c8d; }}
        .correct {{ color: #27ae60; font-weight: bold; }}
        .question {{ margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-left: 4px solid #3498db; }}
        .stats {{ background: #e8f4fc; padding: 20px; border-radius: 5px; margin: 20px 0; }}
    </style>
</head>
<body>
    {html_content}
</body>
</html>"""
        
        html_file = os.path.join(self.output_dir, "booklet.html")
        with open(html_file, "w") as f:
            f.write(full_html)
        
        return html_file
    
    def generate_pdf(self, html_file):
        """
        Converte HTML para PDF usando WeasyPrint
        """
        try:
            # Verificar se WeasyPrint está instalado
            import weasyprint
            
            pdf_file = os.path.join(self.output_dir, "booklet.pdf")
            
            # Gerar PDF
            weasyprint.HTML(filename=html_file).write_pdf(pdf_file)
            
            return pdf_file
            
        except ImportError:
            print("WeasyPrint não encontrado. Instale com: pip install weasyprint")
            return None
    
    def cleanup(self):
        """
        Limpa arquivos temporários
        """
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def generate(self, questions_data):
        """
        Gera apostila completa
        
        Args:
            questions_data (list): Questões do banco de dados
            
        Returns:
            dict: Informações da apostila gerada
        """
        try:
            print(f"Gerando apostila: {self.config.get('title')}")
            print(f"Questões: {len(questions_data)}")
            
            # 1. Gerar conteúdo Markdown
            markdown_content = self.generate_markdown_content(questions_data)
            
            # 2. Criar estrutura mdBook
            self.create_mdbook_structure(markdown_content)
            
            # 3. Gerar HTML
            html_file = self.generate_html()
            print(f"HTML gerado: {html_file}")
            
            # 4. Gerar PDF
            pdf_file = self.generate_pdf(html_file)
            
            if pdf_file and os.path.exists(pdf_file):
                print(f"PDF gerado: {pdf_file}")
                
                # Ler PDF como bytes para retorno
                with open(pdf_file, "rb") as f:
                    pdf_bytes = f.read()
                
                result = {
                    "success": True,
                    "pdf_path": pdf_file,
                    "pdf_size": len(pdf_bytes),
                    "html_path": html_file,
                    "temp_dir": self.temp_dir,
                    "config": self.config
                }
                
                # Não limpar imediatamente - manter para debug
                # self.cleanup()
                
                return result
            else:
                raise Exception("Falha ao gerar PDF")
                
        except Exception as e:
            print(f"Erro ao gerar apostila: {e}")
            self.cleanup()
            return {
                "success": False,
                "error": str(e)
            }

# Função principal para uso externo
def generate_booklet_from_config(config_json, questions_json):
    """
    Função principal para gerar apostila a partir de JSON
    
    Args:
        config_json (str): JSON com configuração
        questions_json (str): JSON com questões
        
    Returns:
        dict: Resultado da geração
    """
    config = json.loads(config_json)
    questions = json.loads(questions_json)
    
    generator = BookletGenerator(config)
    result = generator.generate(questions)
    
    return result

if __name__ == "__main__":
    # Exemplo de uso
    sample_config = {
        "title": "Apostila de Direito Constitucional",
        "subjects": ["Direito Constitucional"],
        "contests": ["PF", "PRF"],
        "difficulty": "medium",
        "include_explanations": True,
        "user_id": "12345"
    }
    
    sample_questions = [
        {
            "id": 1,
            "question_text": "Qual o princípio fundamental da República Federativa do Brasil?",
            "alternatives": [
                {"letter": "A", "text": "Soberania", "correct": True},
                {"letter": "B", "text": "Cidadania", "correct": False},
                {"letter": "C", "text": "Dignidade da pessoa humana", "correct": False},
                {"letter": "D", "text": "Pluralismo político", "correct": False}
            ],
            "explanation": "A soberania é o princípio basilar, conforme artigo 1º, I da CF.",
            "year": 2023,
            "difficulty_level": "easy",
            "exam_board": {"acronym": "CESPE"},
            "subject": {"name": "Direito Constitucional"}
        }
    ]
    
    generator = BookletGenerator(sample_config)
    result = generator.generate(sample_questions)
    
    if result["success"]:
        print(f"Apostila gerada com sucesso!")
        print(f"PDF: {result['pdf_path']}")
        print(f"Tamanho: {result['pdf_size']} bytes")
    else:
        print(f"Erro: {result['error']}")