import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { PartyPopper } from 'lucide-react';

export default function StudentTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [topic, setTopic] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [useFreeTrial, setUseFreeTrial] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url = `/content/topics/${topicId}?includeMcqs=true${useFreeTrial ? '&useFreeTrial=true' : ''}`;
    api.get(url)
      .then(({ data }) => {
        if (cancelled) return;
        setTopic(data.topic);
        setMcqs(data.mcqs || []);
        setHasAccess(data.hasAccess);
        if (data.usedFreeTrial) refreshUser();
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 403) setHasAccess(false);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [topicId, useFreeTrial, refreshUser]);

  const handleUseFreeTrial = () => {
    setUseFreeTrial(true);
    setLoading(true);
  };

  const handleSubmitAnswer = async () => {
    if (selected == null || !mcqs[currentIndex]) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/mcqs/attempts', {
        mcqId: mcqs[currentIndex]._id,
        selectedIndex: selected,
      });
      setResult(data);
      if (data.correct) {
        setTimeout(() => {
          setResult(null);
          setSelected(null);
          if (currentIndex < mcqs.length - 1) setCurrentIndex((i) => i + 1);
        }, 4000);
      }
    } catch (_) {}
    setSubmitting(false);
  };

  if (loading) return <div className="py-12 container mx-auto px-4 text-center">Loading...</div>;
  if (!topic) return <div className="py-12 container mx-auto px-4 text-center">Topic not found.</div>;
  if (!hasAccess) {
    return (
      <div className="py-12 container mx-auto px-4 max-w-md mx-auto text-center">
        <p className="text-gray-600 mb-4">You do not have access to this topic.</p>
        {!user?.freeTrialUsed && (
          <button
            onClick={handleUseFreeTrial}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
          >
            Use free trial for this topic
          </button>
        )}
        <button onClick={() => navigate('/student')} className="block mt-4 text-primary">Back to Dashboard</button>
      </div>
    );
  }

  const mcq = mcqs[currentIndex];

  return (
    <section className="py-12 container mx-auto px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">{topic.name}</h1>
      {mcqs.length === 0 ? (
        <p className="text-gray-500">No MCQs in this topic yet.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">Question {currentIndex + 1} of {mcqs.length}</p>
          <AnimatePresence mode="wait">
            {result?.correct ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <PartyPopper className="w-16 h-16 text-green-600 mx-auto mb-4" />
                </motion.div>
                <p className="text-green-800 font-semibold text-lg mb-4">Correct!</p>
                {result.explanation && <p className="text-gray-700 mb-4 text-left">{result.explanation}</p>}
                {(result.videoUrl || topic.videoUrl) && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      title="Explanation"
                      src={(result.videoUrl || topic.videoUrl)?.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <p className="font-medium text-gray-900 mb-4">{mcq?.question}</p>
                {mcq?.imageUrl && <img src={mcq.imageUrl} alt="" className="mb-4 rounded-lg max-w-full" />}
                <ul className="space-y-2">
                  {(mcq?.options || []).map((opt, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          selected === i ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
                {result && !result.correct && (
                  <p className="mt-4 text-red-600 text-sm">Incorrect. Try again.</p>
                )}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selected == null || submitting}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                  >
                    Submit
                  </button>
                  {currentIndex < mcqs.length - 1 && result?.correct === false && (
                    <button
                      onClick={() => { setResult(null); setSelected(null); setCurrentIndex((i) => i + 1); }}
                      className="text-primary font-medium"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
