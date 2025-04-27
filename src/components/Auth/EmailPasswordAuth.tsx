import { useState } from 'react';

interface EmailPasswordAuthProps {
  supabase: any;
  redirectUrl: string;
}

export default function EmailPasswordAuth({ supabase, redirectUrl }: EmailPasswordAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }
      if (result.error) {
        setError(result.error.message);
      } else {
        window.location.href = '/feed';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-base text-gray-900 mb-2">
        Email address
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block text-base text-gray-900 mb-2">
        Your Password
        <input
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-[#D9361E] text-white py-2 rounded-md font-semibold"
        disabled={loading}
      >
        {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
      </button>
      <div className="text-center mt-2">
        <button
          type="button"
          className="text-[#D9361E] underline text-sm"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </form>
  );
} 