import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-black text-foreground">找不到這個頁面</h1>
        <p className="text-sm text-muted-foreground">
          你要找的頁面不存在或已經移除
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-foreground text-background font-bold rounded-xl px-6 py-3 hover:opacity-90 transition-all"
        >
          回到首頁
        </button>
      </div>
    </div>
  );
}