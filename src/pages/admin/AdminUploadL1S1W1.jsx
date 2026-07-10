/**
 * AdminUploadL1S1W1 — 一次性上傳「我的零用錢,我作主(第一季)」W1 到 Firestore
 *
 * 沿用 AdminUploadW7–W11 pattern(2026-07-10):
 *  - Tiffany 進 /admin/upload-l1s1-w1 按一個按鈕就能上傳,不用碰程式碼
 *  - 上傳後可以從 /admin/content/101 編輯 metadata、發佈
 *  - 這一週掛在學習道路主題(l1-g1)上,系統內部 weekNumber = 101
 *
 * 上傳設定:
 *  - badgeId = 'B-L1S1-W01' / cardId = 'C-L1S1-W01'
 *  - published = false(草稿,發佈後道路上的 W1 才會亮起)
 *  - 不動 latestAvailableWeek(道路週不看這個值)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Upload, ArrowLeft, Award, CreditCard } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUpsertWeek } from '@/lib/hooks/useAdminContent';
import { useWeek } from '@/lib/hooks/useContent';
import { L1S1_W1_WEEK_DATA, L1S1_W1_BADGE_DATA, L1S1_W1_CARD_DATA } from '@/data/L1S1-W1-content';

const TYPE_LABEL = {
  multiple_choice: '選擇題',
  true_false: '是非題',
  matching: '配對題',
  text: '簡答題(老師批改)',
  text_or_image: '圖文題(老師批改)',
};

export default function AdminUploadL1S1W1() {
  const navigate = useNavigate();
  const upsertMutation = useUpsertWeek();
  const { data: existing } = useWeek(101);

  const [status, setStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [badgeImgError, setBadgeImgError] = useState(false);
  const [cardImgError, setCardImgError] = useState(false);

  const alreadyExists = !!existing;

  const handleUpload = async () => {
    setStatus('uploading');
    setErrorMsg('');
    try {
      // 1. Upsert badge to /rewards/{rewardId}
      const badgeRef = doc(db, 'rewards', L1S1_W1_BADGE_DATA.rewardId);
      await setDoc(
        badgeRef,
        { ...L1S1_W1_BADGE_DATA, updatedAt: serverTimestamp(), createdAt: serverTimestamp() },
        { merge: true }
      );

      // 2. Upsert card to /rewards/{rewardId}
      const cardRef = doc(db, 'rewards', L1S1_W1_CARD_DATA.rewardId);
      await setDoc(
        cardRef,
        { ...L1S1_W1_CARD_DATA, updatedAt: serverTimestamp(), createdAt: serverTimestamp() },
        { merge: true }
      );

      // 3. Upsert week 101
      await upsertMutation.mutateAsync({
        weekNumber: 101,
        data: L1S1_W1_WEEK_DATA,
        isNew: !alreadyExists,
      });
      setStatus('success');
    } catch (err) {
      console.error('L1S1-W1 upload failed:', err);
      setStatus('error');
      setErrorMsg(err?.message || String(err));
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/content')}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
          title="回到內容管理"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900">📦 上傳「我的零用錢,我作主」第一季 W1</h1>
          <p className="text-xs text-slate-500">
            一次性工具 · 學習道路第 1 關(系統編號 week 101) · 上傳完可從 /admin/content/101 編輯
          </p>
        </div>
      </div>

      {/* 預覽資料 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-slate-900">將會上傳的內容</h2>
        <dl className="text-sm text-slate-700 space-y-1.5">
          <Row label="標題" value={L1S1_W1_WEEK_DATA.title} />
          <Row label="主題" value="學習道路 · 我的零用錢,我作主(第一季) · 第 1 關" />
          <Row label="大問題" value={L1S1_W1_WEEK_DATA.question} />
          <Row
            label="練習題數"
            value={`${L1S1_W1_WEEK_DATA.quizQuestions.length} 題(選擇 5 + 是非 1 + 配對 1 + 簡答 2 + 圖文 1)`}
          />
          <Row label="任務標題" value={L1S1_W1_WEEK_DATA.taskTitle} />
          <Row
            label="徽章"
            value={`${L1S1_W1_BADGE_DATA.name}(${L1S1_W1_BADGE_DATA.rewardId})`}
          />
          <Row
            label="卡片"
            value={`${L1S1_W1_CARD_DATA.name}(${L1S1_W1_CARD_DATA.rewardId})`}
          />
          <Row label="發佈狀態" value="草稿(道路上的 W1 還不會亮,發佈後才開放)" />
        </dl>

        {/* Badge + Card images preview */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> 徽章 圖檔位置
            </div>
            <code className="text-[10px] bg-slate-100 px-2 py-1 rounded block break-all">
              {L1S1_W1_BADGE_DATA.image}
            </code>
            {!badgeImgError && (
              <img
                src={L1S1_W1_BADGE_DATA.image}
                alt="L1S1 W1 badge preview"
                className="mt-2 w-full max-w-[180px] aspect-square rounded-lg border border-slate-200 object-contain bg-slate-50"
                onError={() => setBadgeImgError(true)}
              />
            )}
            {badgeImgError && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                ⚠️ 圖檔還沒放到上面那個路徑 —— 圖做好後把徽章 PNG 存到 public/images/ 下,檔名要跟上面一樣
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> 卡片 圖檔位置
            </div>
            <code className="text-[10px] bg-slate-100 px-2 py-1 rounded block break-all">
              {L1S1_W1_CARD_DATA.image}
            </code>
            {!cardImgError && (
              <img
                src={L1S1_W1_CARD_DATA.image}
                alt="L1S1 W1 card preview"
                className="mt-2 w-full max-w-[180px] aspect-[3/4] rounded-lg border border-slate-200 object-contain bg-slate-50"
                onError={() => setCardImgError(true)}
              />
            )}
            {cardImgError && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                ⚠️ 圖檔還沒放到上面那個路徑 —— 圖做好後把卡片 PNG 存到 public/images/ 下,檔名要跟上面一樣
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 已存在警告 */}
      {alreadyExists && status !== 'success' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">Firestore 裡已經有 week 101</p>
            <p className="mt-1 text-amber-800">
              按下「上傳」會覆蓋現有內容(merge 模式,沒列在這頁的欄位會保留)。
              如果你已經在 /admin/content/101 改過東西,先去那邊確認。
            </p>
          </div>
        </div>
      )}

      {/* 上傳按鈕 + 狀態 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        {status !== 'success' && (
          <button
            onClick={handleUpload}
            disabled={status === 'uploading'}
            className="w-full bg-slate-900 text-white font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'uploading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                上傳中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {alreadyExists ? '覆蓋 W1(week 101)' : '上傳 W1 到 Firestore'}
              </>
            )}
          </button>
        )}

        {status === 'success' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-bold">「我的零用錢,我作主」W1 已上傳 ✓</p>
            </div>
            <p className="text-sm text-slate-600">下一步:</p>
            <ol className="text-sm text-slate-700 list-decimal pl-5 space-y-1">
              <li>
                到 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/admin/content/101</code>{' '}
                檢查內容、改文字、確認 badge/card 都接上了
              </li>
              <li>
                準備好上線時:在 /admin/content/101 把「published」打開 —— 學習道路上的 W1 就會亮起
              </li>
              <li>
                到 概念競技場 → L1 體驗 → 我的零用錢,我作主 → 點 W1,確認 10 題(含是非/配對/簡答)+ 任務都正常
              </li>
              <li>
                到 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/admin/codes</code>{' '}
                產生這個主題的開通碼發給學員
              </li>
            </ol>
            <button
              onClick={() => navigate('/admin/content/101')}
              className="w-full mt-2 bg-slate-900 text-white font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-all"
            >
              去 /admin/content/101 編輯
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-red-900">上傳失敗</p>
              <p className="text-red-800 mt-1 font-mono text-xs">{errorMsg}</p>
              <p className="text-red-800 mt-2">
                可能原因:你不是用 admin 帳號登入,或 Firestore 規則阻擋。把這段錯誤訊息傳給 Claude。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 10 題預覽 */}
      <details className="bg-white border border-slate-200 rounded-xl">
        <summary className="px-5 py-3 cursor-pointer text-sm font-bold text-slate-900 hover:bg-slate-50">
          展開看 10 題練習題
        </summary>
        <div className="px-5 pb-4 space-y-3 border-t border-slate-100 pt-4">
          {L1S1_W1_WEEK_DATA.quizQuestions.map((q) => (
            <div key={q.id} className="text-sm border-b border-slate-100 pb-3 last:border-0">
              <div className="text-xs font-bold text-slate-500 mb-1">
                Q{q.id} · {q.block} · {TYPE_LABEL[q.type] || q.type}
              </div>
              <div className="text-slate-900 font-semibold mb-2">{q.question}</div>

              {q.type === 'multiple_choice' && (
                <ul className="space-y-1 text-slate-700">
                  {q.options.map((opt) => (
                    <li
                      key={opt}
                      className={opt === q.answer ? 'text-green-700 font-semibold' : 'text-slate-600'}
                    >
                      {opt === q.answer ? '✓ ' : '　'}
                      {opt}
                    </li>
                  ))}
                </ul>
              )}

              {q.type === 'true_false' && (
                <p className="text-green-700 font-semibold">✓ 正確答案:{q.answer ? '對 ⭕️' : '錯 ❌'}</p>
              )}

              {q.type === 'matching' && (
                <ul className="space-y-1 text-slate-700">
                  {q.pairs.map((p) => (
                    <li key={p.left}>
                      <span className="font-semibold text-violet-700">{p.left}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      {p.right}
                    </li>
                  ))}
                </ul>
              )}

              {(q.type === 'text' || q.type === 'text_or_image') && (
                <div className="text-slate-600 text-xs bg-amber-50 border border-amber-100 rounded p-2">
                  ✍️ 孩子作答後進老師批改(後台審核頁看得到)。提示範例:{q.placeholder}
                </div>
              )}

              <div className="text-xs text-slate-500 mt-2 italic">解釋:{q.explanation}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-3">
      <dt className="w-32 flex-shrink-0 text-slate-500">{label}</dt>
      <dd className="flex-1 text-slate-900 font-medium">{value}</dd>
    </div>
  );
}
