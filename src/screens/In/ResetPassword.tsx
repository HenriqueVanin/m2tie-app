import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../../services/authService";

export default function ResetPasswordScreen() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!token) {
      setError("Token ausente.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Preencha os dois campos de senha.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        token,
        data: { password, confirmPassword },
      });
      if (res.error) {
        setError(res.msg || "Erro desconhecido");
      } else {
        setMessage(res.msg || "Senha alterada com sucesso.");
        setTimeout(() => navigate("/login"), 1400);
      }
    } catch (err: any) {
      setError(err?.message || "Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <section
        className="w-full max-w-md bg-white shadow rounded p-6"
        aria-label="Reset password"
      >
        <h1 className="text-xl font-semibold mb-4">Redefinir senha</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Nova senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600 mb-2">
              {error}
            </div>
          )}
          {message && (
            <div role="status" className="text-sm text-green-600 mb-2">
              {message}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Redefinir senha"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:underline"
            >
              Voltar ao login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
