import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Lock, ChevronDown, ChevronRight } from 'lucide-react';

export default function ModulesPage() {
  const { user } = useAuth();
  const [years, setYears] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [modulesByYear, setModulesByYear] = useState({});
  const [subjectsByModule, setSubjectsByModule] = useState({});
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content/years').then(({ data }) => setYears(data)).catch(() => setYears([])).finally(() => setLoading(false));
  }, []);

  const loadModules = async (yearId) => {
    if (modulesByYear[yearId]) return;
    const { data } = await api.get(`/content/years/${yearId}/modules`);
    setModulesByYear((prev) => ({ ...prev, [yearId]: data }));
  };

  const loadSubjects = async (moduleId) => {
    if (subjectsByModule[moduleId]) return;
    const { data } = await api.get(`/content/modules/${moduleId}/subjects`);
    setSubjectsByModule((prev) => ({ ...prev, [moduleId]: data }));
  };

  const loadTopics = async (subjectId) => {
    if (topicsBySubject[subjectId]) return;
    const { data } = await api.get(`/content/subjects/${subjectId}/topics`);
    setTopicsBySubject((prev) => ({ ...prev, [subjectId]: data }));
  };

  const toggle = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const hasAccess = !!user?.packages?.length || user?.freeTrialUsed;

  return (
    <section className="py-12 sm:py-16 container mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">Modules</h1>
        <p className="text-gray-600 font-body mt-2">
          {hasAccess ? 'Browse and open content from your dashboard.' : 'Register and purchase a package to unlock content.'}
        </p>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-2">
          {years.length === 0 ? (
            <p className="text-center text-gray-500">No years configured yet.</p>
          ) : (
            years.map((year, yi) => (
              <motion.div
                key={year._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: yi * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => {
                    toggle(`y-${year._id}`);
                    loadModules(year._id);
                  }}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-heading font-semibold text-gray-900">{year.name}</span>
                  {expanded[`y-${year._id}`] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {expanded[`y-${year._id}`] && (modulesByYear[year._id] || []).map((mod) => (
                  <div key={mod._id} className="border-t border-gray-100 pl-4">
                    <button
                      onClick={() => {
                        toggle(`m-${mod._id}`);
                        loadSubjects(mod._id);
                      }}
                      className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50"
                    >
                      <span className="font-body text-gray-800">{mod.name}</span>
                      {expanded[`m-${mod._id}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expanded[`m-${mod._id}`] && (subjectsByModule[mod._id] || []).map((sub) => (
                      <div key={sub._id} className="border-t border-gray-50 pl-4">
                        <button
                          onClick={() => {
                            toggle(`s-${sub._id}`);
                            loadTopics(sub._id);
                          }}
                          className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 text-sm"
                        >
                          <span className="text-gray-700">{sub.name}</span>
                          {expanded[`s-${sub._id}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {expanded[`s-${sub._id}`] && (topicsBySubject[sub._id] || []).map((topic) => (
                          <div key={topic._id} className="pl-4 py-2 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-sm text-gray-600">{topic.name}</span>
                            {hasAccess ? (
                              <Link
                                to={`/student/topics/${topic._id}`}
                                className="text-primary text-sm font-medium"
                              >
                                Open
                              </Link>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                                <Lock className="w-4 h-4" /> Locked
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
