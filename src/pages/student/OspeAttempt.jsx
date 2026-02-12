import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';

export default function StudentOspeAttempt() {
  const { ospeId } = useParams();
  const [ospe, setOspe] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ospes/${ospeId}`).then(({ data }) => setOspe(data)).catch(() => setOspe(null)).finally(() => setLoading(false));
  }, [ospeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerList = (ospe?.questions || []).map((_, i) => ({
      questionIndex: i,
      selectedIndex: answers[`q${i}_opt`] != null ? Number(answers[`q${i}_opt`]) : undefined,
      writtenAnswer: answers[`q${i}_written`],
    }));
    await api.post('/ospes/attempts', { ospeId, answers: answerList });
    setSubmitted(true);
  };

  if (loading) return <div className="py-12 container px-4">Loading...</div>;
  if (!ospe) return <div className="py-12 container px-4">OSPE not found.</div>;

  const questions = ospe.questions || [];

  return (
    <section className="py-12 container mx-auto px-4 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">{ospe.name}</h1>
      {submitted ? (
        <p className="text-green-600 font-medium">Attempt saved.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              {q.imageUrl && <img src={q.imageUrl} alt="" className="mb-3 rounded-lg max-w-full" />}
              <p className="font-medium text-gray-900 mb-2">{q.questionText}</p>
              {q.type === 'picture_mcq' && (q.options || []).length > 0 ? (
                <ul className="space-y-2">
                  {q.options.map((opt, j) => (
                    <li key={j}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={j}
                          onChange={(e) => setAnswers((a) => ({ ...a, [`q${i}_opt`]: e.target.value }))}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <textarea
                  placeholder="Your answer"
                  rows={3}
                  value={answers[`q${i}_written`] || ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [`q${i}_written`]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium">
            Submit
          </button>
        </form>
      )}
    </section>
  );
}
