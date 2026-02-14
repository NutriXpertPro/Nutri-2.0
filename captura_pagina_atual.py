import requests
from bs4 import BeautifulSoup
import os

def capturar_pagina(url):
    """
    Função para capturar o conteúdo HTML da página alvo
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Salvar o HTML capturado
            with open('pagina_atual.html', 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
                
            print(f"Página capturada com sucesso! Status: {response.status_code}")
            return soup
        else:
            print(f"Falha ao acessar a página. Status: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Erro ao capturar a página: {str(e)}")
        return None

if __name__ == "__main__":
    url = "http://localhost:3000/patient-dashboard-v2"
    capturar_pagina(url)