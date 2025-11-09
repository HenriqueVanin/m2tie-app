// SPA simples: navegação e renderização de telas
const app = document.getElementById('app');

const routes = {
  home: renderHome,
  login: renderLogin,
  profile: renderProfile,
  settings: renderSettings,
  form: renderFormWizard
};

function navigate(screen) {
  window.location.hash = screen;
  renderScreen(screen);
}

function renderScreen(screen) {
  app.innerHTML = '';
  (routes[screen] || renderHome)();
}

window.addEventListener('hashchange', () => {
  const screen = window.location.hash.replace('#', '') || 'home';
  renderScreen(screen);
});

// Inicialização
renderScreen(window.location.hash.replace('#', '') || 'home');

// Telas (placeholders, serão detalhadas depois)
function renderHome() {
  const notifications = [
    { title: "Formulário aprovado", message: "Seu formulário #1234 foi aprovado", time: "2h", unread: true },
    { title: "Nova atualização", message: "Confira as novidades da plataforma", time: "5h", unread: true },
    { title: "Lembrete", message: "Complete seu perfil para melhor experiência", time: "1d", unread: false },
    { title: "Sistema", message: "Manutenção programada para amanhã", time: "2d", unread: false }
  ];
  const recentForms = [
    { title: "Formulário de Cadastro", status: "Completo", date: "05/11/2025" },
    { title: "Solicitação de Serviço", status: "Em análise", date: "04/11/2025" },
    { title: "Atualização de Dados", status: "Pendente", date: "03/11/2025" }
  ];
  app.innerHTML = `
      <header>
        <h1>M2Tie App</h1>
        <p>Bem-vindo!</p>
      </header>
      <main style="padding:2rem;max-width:500px;margin:auto;">
        <section style="margin-bottom:2rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h2 style="margin:0;">Notificações</h2>
            <span style="background:var(--color-base2);color:#fff;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.9rem;">
              ${notifications.filter(n => n.unread).length} novas
            </span>
          </div>
          <div style="display:flex;flex-direction:column;gap:1rem;">
            ${notifications.map(n => `
              <article style="padding:1rem;border-radius:1rem;border:2px solid ${n.unread ? 'var(--color-base2)' : '#eee'};background:${n.unread ? 'rgba(96,143,211,0.1)' : '#fff'};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
                  <div>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                      <span style="font-weight:500;color:var(--color-fg);">${n.title}</span>
                      ${n.unread ? '<span style="width:8px;height:8px;background:var(--color-base2);border-radius:50%;display:inline-block;" title="Não lida"></span>' : ''}
                    </div>
                    <span style="font-size:0.95rem;color:#666;">${n.message}</span>
                  </div>
                  <span style="font-size:0.8rem;color:#999;">${n.time}</span>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
        <section>
          <h2 style="margin-bottom:1rem;">Formulários Recentes</h2>
          <div style="display:flex;flex-direction:column;gap:1rem;">
            ${recentForms.map(f => `
              <article style="padding:1rem;background:#fff;border-radius:1rem;border:2px solid #eee;display:flex;align-items:center;gap:1rem;">
                <div style="width:40px;height:40px;background:#f3f3f5;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:1.2rem;color:#666;">📄</span>
                </div>
                <div style="flex:1;">
                  <span style="font-weight:500;color:var(--color-fg);">${f.title}</span><br>
                  <span style="font-size:0.95rem;color:#666;">${f.date}</span>
                </div>
                <span style="padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.9rem;background:${f.status === 'Completo' ? 'var(--color-base1)' : f.status === 'Em análise' ? 'var(--color-base2)' : '#eee'};color:${f.status === 'Pendente' ? '#666' : '#fff'};">
                  ${f.status}
                </span>
              </article>
            `).join('')}
          </div>
        </section>
        <nav style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;">
          <button onclick="navigate('form')">Ir para Formulário</button>
          <button onclick="navigate('profile')">Perfil</button>
          <button onclick="navigate('settings')">Configurações</button>
        </nav>
      </main>
    `;
}
function renderLogin() {
  app.innerHTML = `
      <header>
        <h1>Login</h1>
      </header>
      <main style='padding:2rem;max-width:400px;margin:auto;'>
        <form id='loginForm' style='display:flex;flex-direction:column;gap:1.5rem;'>
          <div>
            <label for='email' style='display:block;margin-bottom:0.5rem;'>Email</label>
            <input type='email' id='email' placeholder='seu@email.com' required style='width:100%;padding:0.75rem;border:2px solid #eee;border-radius:0.5rem;'>
          </div>
          <div>
            <label for='password' style='display:block;margin-bottom:0.5rem;'>Senha</label>
            <input type='password' id='password' placeholder='••••••••' required style='width:100%;padding:0.75rem;border:2px solid #eee;border-radius:0.5rem;'>
          </div>
          <div style='text-align:right;'>
            <button type='button' style='background:none;color:#666;font-size:0.95rem;padding:0;' onclick='alert("Função de recuperação não implementada.")'>Esqueceu a senha?</button>
          </div>
          <button type='submit'>Entrar</button>
        </form>
      </main>
    `;
  document.getElementById('loginForm').onsubmit = function (e) {
    e.preventDefault();
    navigate('home');
  };
}
function renderProfile() {
  app.innerHTML = `
      <header>
        <h1>Meu Perfil</h1>
      </header>
      <main style='padding:2rem;max-width:400px;margin:auto;'>
        <section style='display:flex;flex-direction:column;align-items:center;gap:1rem;margin-bottom:2rem;'>
          <div style='position:relative;'>
            <div style='width:96px;height:96px;background:#eee;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#666;'>JP</div>
            <button style='position:absolute;bottom:0;right:0;padding:0.5rem;background:var(--color-base2);color:#fff;border-radius:50%;border:none;cursor:pointer;'>📷</button>
          </div>
          <div style='text-align:center;'>
            <span style='font-weight:500;color:var(--color-fg);font-size:1.1rem;'>João Pedro Silva</span><br>
            <span style='font-size:0.95rem;color:#666;'>Membro desde Nov 2025</span>
          </div>
        </section>
        <section style='display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;background:#f3f3f5;padding:1rem;border-radius:1rem;margin-bottom:2rem;'>
          <div style='text-align:center;'>
            <span style='font-weight:700;color:var(--color-fg);'>12</span><br>
            <span style='font-size:0.8rem;color:#666;'>Formulários</span>
          </div>
          <div style='text-align:center;'>
            <span style='font-weight:700;color:var(--color-fg);'>8</span><br>
            <span style='font-size:0.8rem;color:#666;'>Completos</span>
          </div>
          <div style='text-align:center;'>
            <span style='font-weight:700;color:var(--color-fg);'>4</span><br>
            <span style='font-size:0.8rem;color:#666;'>Pendentes</span>
          </div>
        </section>
        <section style='margin-bottom:2rem;'>
          <div style='margin-bottom:1rem;'><label style='font-weight:500;'>Nome completo</label><br><span>João Pedro Silva</span></div>
          <div style='margin-bottom:1rem;'><label style='font-weight:500;'>Email</label><br><span>seu@email.com</span></div>
          <div><label style='font-weight:500;'>Faculdade</label><br><span>Universidade de São Paulo</span></div>
        </section>
        <button style='width:100%;margin-top:1rem;'>Salvar alterações</button>
        <button onclick="navigate('home')" style='width:100%;margin-top:1rem;background:#eee;color:#666;'>Voltar</button>
      </main>
    `;
}
function renderSettings() {
  app.innerHTML = `
      <header>
        <h1>Configurações</h1>
      </header>
      <main style='padding:2rem;max-width:400px;margin:auto;'>
        <section style='margin-bottom:2rem;'>
          <h3 style='color:#666;font-size:0.95rem;margin-bottom:0.5rem;'>CONTA</h3>
          <div style='background:#fff;border-radius:1rem;border:2px solid #eee;'>
            <button style='width:100%;display:flex;justify-content:space-between;align-items:center;padding:1rem;background:none;border:none;cursor:pointer;'>
              <span>🔒 Alterar senha</span>
              <span>›</span>
            </button>
          </div>
        </section>
        <section style='margin-bottom:2rem;'>
          <h3 style='color:#666;font-size:0.95rem;margin-bottom:0.5rem;'>APARÊNCIA</h3>
          <div style='background:#fff;border-radius:1rem;border:2px solid #eee;padding:1rem;display:flex;justify-content:space-between;align-items:center;'>
            <span>🌙 Modo escuro</span>
            <input type='checkbox' id='darkMode' style='width:1.5rem;height:1.5rem;'>
          </div>
        </section>
        <section style='margin-bottom:2rem;'>
          <h3 style='color:#666;font-size:0.95rem;margin-bottom:0.5rem;'>SUPORTE</h3>
          <div style='background:#fff;border-radius:1rem;border:2px solid #eee;'>
            <button style='width:100%;display:flex;justify-content:space-between;align-items:center;padding:1rem;background:none;border:none;cursor:pointer;'>
              <span>❓ Central de ajuda</span>
              <span>›</span>
            </button>
            <button style='width:100%;display:flex;justify-content:space-between;align-items:center;padding:1rem;background:none;border:none;cursor:pointer;'>
              <span>📄 Política de privacidade</span>
              <span>›</span>
            </button>
          </div>
        </section>
        <div style='text-align:center;color:#666;font-size:0.95rem;margin-bottom:1rem;'>Versão 1.0.0</div>
        <button onclick="navigate('login')" style='width:100%;background:#fff;border:2px solid var(--color-accent);color:var(--color-accent);margin-bottom:1rem;'>Sair da conta</button>
        <button onclick="navigate('home')" style='width:100%;background:#eee;color:#666;'>Voltar</button>
      </main>
    `;
}
function renderFormWizard() {
  let step = 1;
  function renderStep() {
    app.innerHTML = `
        <header>
          <h1>Formulário</h1>
        </header>
        <main style='padding:2rem;max-width:500px;margin:auto;'>
          <div style='margin-bottom:2rem;'>
            <div style='display:flex;align-items:center;gap:1rem;'>
              <button onclick='step>1?(step--,renderStep()):navigate("home")' style='background:#eee;color:#666;padding:0.5rem 1rem;border-radius:0.5rem;border:none;'>←</button>
              <span style='font-weight:500;'>Etapa ${step} de 4</span>
            </div>
            <div style='display:flex;gap:0.5rem;margin-top:1rem;'>
              ${Array.from({ length: 4 }).map((_, i) => `<div style='flex:1;height:6px;border-radius:3px;background:${i < step ? 'var(--color-base2)' : '#eee'};'></div>`).join('')}
            </div>
          </div>
          <div id='formStepContent'></div>
          <nav style='margin-top:2rem;display:flex;gap:1rem;'>
            <button onclick='step<4?(step++,renderStep()):navigate("home")' style='flex:1;'>${step < 4 ? 'Próximo' : 'Concluir'}</button>
            ${step > 1 ? '<button onclick="step--,renderStep()" style="flex:1;background:#eee;color:#666;">Voltar</button>' : ''}
          </nav>
        </main>
      `;
    const content = document.getElementById('formStepContent');
    if (!content) return;
    if (step === 1) {
      content.innerHTML = `
          <h2 style='margin-bottom:0.5rem;'>Etapa 1</h2>
          <p style='color:#666;margin-bottom:1rem;'>Preencha os dados iniciais do formulário</p>
          <textarea placeholder='Escreva aqui' style='width:100%;min-height:80px;padding:0.75rem;border:2px solid #eee;border-radius:0.5rem;margin-bottom:1rem;'></textarea>
          <textarea placeholder='Escreva aqui' style='width:100%;min-height:80px;padding:0.75rem;border:2px solid #eee;border-radius:0.5rem;margin-bottom:1rem;'></textarea>
          <textarea placeholder='Escreva aqui' style='width:100%;min-height:80px;padding:0.75rem;border:2px solid #eee;border-radius:0.5rem;'></textarea>
        `;
    } else if (step === 2) {
      content.innerHTML = `
          <h2 style='margin-bottom:0.5rem;'>Etapa 2</h2>
          <p style='color:#666;margin-bottom:1rem;'>Descrição da segunda etapa</p>
          <label for='category' style='display:block;margin-bottom:0.5rem;'>Categoria</label>
          <select id='category' style='width:100%;height:2.5rem;padding:0.5rem;border:2px solid #eee;border-radius:0.5rem;margin-bottom:1rem;'>
            <option value=''>Selecione</option>
            <option value='cat1'>Categoria 1</option>
            <option value='cat2'>Categoria 2</option>
          </select>
          <label style='display:block;margin-bottom:0.5rem;'>Multiplas opções</label>
          <div style='margin-bottom:1rem;'>
            <label><input type='radio' name='multi' value='op1'> Opção 1</label><br>
            <label><input type='radio' name='multi' value='op2'> Opção 2</label><br>
            <label><input type='radio' name='multi' value='op3'> Opção 3</label>
          </div>
        `;
    } else if (step === 3) {
      content.innerHTML = `
          <h2 style='margin-bottom:0.5rem;'>Etapa 3</h2>
          <p style='color:#666;margin-bottom:1rem;'>Descrição da terceira etapa</p>
          <input type='text' placeholder='CEP' style='width:100%;height:2.5rem;padding:0.5rem;border:2px solid #eee;border-radius:0.5rem;margin-bottom:1rem;'>
          <input type='text' placeholder='Rua' style='width:100%;height:2.5rem;padding:0.5rem;border:2px solid #eee;border-radius:0.5rem;margin-bottom:1rem;'>
          <input type='text' placeholder='Bairro' style='width:100%;height:2.5rem;padding:0.5rem;border:2px solid #eee;border-radius:0.5rem;'>
        `;
    } else if (step === 4) {
      content.innerHTML = `
          <h2 style='margin-bottom:0.5rem;'>Revisão e Confirmação</h2>
          <p style='color:#666;margin-bottom:1rem;'>Revise suas informações antes de enviar</p>
          <div style='padding:1rem;background:#f3f3f5;border-radius:0.5rem;border:2px solid #eee;margin-bottom:1rem;'>Resumo dos dados preenchidos...</div>
          <div style='display:flex;align-items:center;gap:0.5rem;padding:1rem;background:rgba(96,143,211,0.1);border:2px solid var(--color-base2);border-radius:0.5rem;'>
            <input type='checkbox' id='confirm' style='margin-right:0.5rem;'>
            <label for='confirm'>Confirmo que revisei as informações</label>
          </div>
        `;
    }
  }
  renderStep();
}
