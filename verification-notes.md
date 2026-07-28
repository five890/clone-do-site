# Verificação

Desktop: OK - Discord substituindo CANAL, CERTIFICADO visível, ATIVAR visível, footer coberto.
Mobile: Screenshot mostra loading - iframe demorou mais para carregar no viewport pequeno.
Preciso testar mobile com mais tempo de espera ou ajustar o timeout.

Ações necessárias:
1. Aumentar timeout do iframe para mobile (3s em vez de 2.5s)
2. Verificar que os overlays mobile (block sm:hidden) estão corretos
