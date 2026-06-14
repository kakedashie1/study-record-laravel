export default function XShareModal({ isOpen, onClose, todayTimeText }) {
    if (!isOpen) return null;

    const handleShare = () => {
        const text =
            `今日の勉強時間：${todayTimeText}\n\n` +
            `Study Recordで学習を記録しました！`;

        const shareUrl =
            "https://twitter.com/intent/tweet?" +
            new URLSearchParams({
                text,
                hashtags: "StudyRecord,勉強記録,学習記録",
            }).toString();

        window.open(shareUrl, "_blank", "noopener,noreferrer");
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    学習記録を共有しますか？
                </h2>

                <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                    今日の勉強時間：{todayTimeText}
                    {"\n\n"}#勉強垢 #勉強垢さんと繋がりたい#勉強記録 #学習記録 #StudyRecord
                </p>

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border px-4 py-2 text-sm font-bold dark:border-slate-600 dark:text-white"
                    >
                        閉じる
                    </button>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="flex-1 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white"
                    >
                        Xに投稿
                    </button>
                </div>
            </div>
        </div>
    );
}
