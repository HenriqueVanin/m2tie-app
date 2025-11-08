import { Bell, FileText, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Screen } from '../App';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const notifications = [
    { id: 1, title: 'Formulário aprovado', message: 'Seu formulário #1234 foi aprovado', time: '2h', unread: true },
    { id: 2, title: 'Nova atualização', message: 'Confira as novidades da plataforma', time: '5h', unread: true },
    { id: 3, title: 'Lembrete', message: 'Complete seu perfil para melhor experiência', time: '1d', unread: false },
    { id: 4, title: 'Sistema', message: 'Manutenção programada para amanhã', time: '2d', unread: false },
  ];

  const recentForms = [
    { id: 1, title: 'Formulário de Cadastro', status: 'Completo', date: '05/11/2025' },
    { id: 2, title: 'Solicitação de Serviço', status: 'Em análise', date: '04/11/2025' },
    { id: 3, title: 'Atualização de Dados', status: 'Pendente', date: '03/11/2025' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Bem-vindo(a)</p>
            <h1>Dashboard</h1>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* CTA Button - Destaque */}
        <Button
          onClick={() => onNavigate('form')}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Formulário
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Notificações */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Notificações</h2>
            <Badge variant="secondary">{notifications.filter(n => n.unread).length} novas</Badge>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-2 ${
                  notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800">{notification.title}</p>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulários Recentes */}
        <div>
          <h2 className="mb-4">Formulários Recentes</h2>
          <div className="space-y-3">
            {recentForms.map((form) => (
              <div
                key={form.id}
                className="p-4 bg-white rounded-lg border-2 border-gray-200 flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{form.title}</p>
                  <p className="text-sm text-gray-500">{form.date}</p>
                </div>
                <Badge
                  variant={
                    form.status === 'Completo' ? 'default' :
                    form.status === 'Em análise' ? 'secondary' : 'outline'
                  }
                >
                  {form.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
