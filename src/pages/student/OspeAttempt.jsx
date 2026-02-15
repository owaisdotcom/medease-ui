import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';

/** Flatten stations into a list of { question, globalIndex } for submission */
function getFlatQuestions(ospe) {
  const stations = ospe?.stations || [];
  if (stations.length === 0 && ospe?.questions?.length) {
    return ospe.questions.map((q, i) => ({ question: q, globalIndex: i }));
  }
  let idx = 0;
  return stations.flatMap((s) => (s.questions || []).map((q) => ({ question: q, globalIndex: idx++ })));
}

const MCQ_TYPES = ['text_mcq', 'picture_mcq', 'guess_until_correct'];

export default function StudentOspeAttempt() {
  const { ospeId } = useParams();
  const [ospe, setOspe] = useState(null);
  const [answers, setAnswers] = useState({});
  const [guessCorrect, setGuessCorrect] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ospes/${ospeId}`).then(({ data }) => setOspe(data)).catch(() => setOspe(null)).finally(() => setLoading(false));
  }, [ospeId]);

  const flatList = ospe ? getFlatQuestions(ospe) : [];
  const stations = ospe?.stations || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerList = flatList.map(({ question, globalIndex: i }) => ({
      questionIndex: i,
      selectedIndex: answers[`q${i}_opt`] != null ? Number(answers[`q${i}_opt`]) : undefined,
      writtenAnswer: answers[`q${i}_written`],
    }));
    await api.post('/ospes/attempts', { ospeId, answers: answerList });
    setSubmitted(true);
  };

  const handleMcqChange = (globalIndex, q, value) => {
    const num = Number(value);
    setAnswers((a) => ({ ...a, [`q${globalIndex}_opt`]: num }));
    if (q.type === 'guess_until_correct' && q.correctIndex != null && num === q.correctIndex) {
      setGuessCorrect((g) => ({ ...g, [globalIndex]: true }));
    }
  };

  if (loading) return <div className="py-12 container px-4">Loading...</div>;
  if (!ospe) return <div className="py-12 container px-4">OSPE not found.</div>;

  let globalIdx = 0;

  return (
    <section className="py-12 container mx-auto px-4 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">{ospe.name}</h1>
      {submitted ? (
        <p className="text-green-600 font-medium">Attempt saved.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {stations.length > 0 ? (
            stations.map((station, si) => (
              <div key={si} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {station.imageUrl && (
                  <div className="bg-gray-100 p-4 flex justify-center">
                    <img src={station.imageUrl} alt={`Station ${si + 1}`} className="max-h-80 w-auto rounded-lg object-contain" />
                  </div>
                )}
                <div className="p-4 space-y-4">
                  {(station.questions || []).map((q, qi) => {
                    const i = globalIdx++;
                    const isMcq = MCQ_TYPES.includes(q.type);
                    const isGuess = q.type === 'guess_until_correct';
                    const gotCorrect = isGuess && guessCorrect[i];
                    const options = (q.options || []).filter(Boolean);

                    return (
                      <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <p className="font-medium text-gray-900 mb-2">{q.questionText}</p>
                        {isMcq && options.length > 0 ? (
                          <ul className="space-y-2">
                            {options.map((opt, j) => (
                              <li key={j}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`q${i}`}
                                    value={j}
                                    checked={answers[`q${i}_opt`] === j}
                                    onChange={(e) => handleMcqChange(i, q, e.target.value)}
                                    disabled={gotCorrect}
                                    className="text-primary"
                                  />
                                  <span>{opt}</span>
                                </label>
                              </li>
                            ))}
                            {isGuess && gotCorrect && <p className="mt-2 text-green-600 text-sm font-medium">Correct!</p>}
                          </ul>
                        ) : (
                          <textarea
                            placeholder="Your answer"
                            rows={3}
                            value={answers[`q${i}_written`] || ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [`q${i}_written`]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            (ospe.questions || []).map((q, i) => {
              const isMcq = MCQ_TYPES.includes(q.type) || q.type === 'picture_mcq';
              const options = (q.options || []).filter(Boolean);
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                  {q.imageUrl && <img src={q.imageUrl} alt="" className="mb-3 rounded-lg max-w-full" />}
                  <p className="font-medium text-gray-900 mb-2">{q.questionText}</p>
                  {isMcq && options.length > 0 ? (
                    <ul className="space-y-2">
                      {options.map((opt, j) => (
                        <li key={j}>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`q${i}`}
                              value={j}
                              onChange={(e) => setAnswers((a) => ({ ...a, [`q${i}_opt`]: e.target.value }))}
                              className="text-primary"
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
              );
            })
          )}
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow">
            Submit
          </button>
        </form>
      )}
    </section>
  );
}
