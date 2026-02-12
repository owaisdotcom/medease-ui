import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { BookOpen, ClipboardList } from 'lucide-react';

export default function StudentResources() {
  const [years, setYears] = useState([]);
  const [modulesByYear, setModulesByYear] = useState({});
  const [subjectsByModule, setSubjectsByModule] = useState({});
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [ospesByModule, setOspesByModule] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get('/content/years').then(({ data }) => setYears(data)).catch(() => setYears([]));
  }, []);

  const loadModules = async (yearId) => {
    if (modulesByYear[yearId]) return;
    const { data } = await api.get(`/content/years/${yearId}/modules`);
    setModulesByYear((p) => ({ ...p, [yearId]: data }));
  };

  const loadSubjects = async (moduleId) => {
    if (subjectsByModule[moduleId]) return;
    const [subRes, ospeRes] = await Promise.all([
      api.get(`/content/modules/${moduleId}/subjects`),
      api.get(`/ospes/modules/${moduleId}`).catch(() => ({ data: [] })),
    ]);
    setSubjectsByModule((p) => ({ ...p, [moduleId]: subRes.data }));
    setOspesByModule((p) => ({ ...p, [moduleId]: ospeRes.data }));
  };

  const loadTopics = async (subjectId) => {
    if (topicsBySubject[subjectId]) return;
    const { data } = await api.get(`/content/subjects/${subjectId}/topics`);
    setTopicsBySubject((p) => ({ ...p, [subjectId]: data }));
  };

  const toggle = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  return (
    <section className="py-12 container mx-auto px-4">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">My resources</h1>
      <div className="max-w-3xl space-y-2">
        {years.map((year) => (
          <div key={year._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => {
                toggle(`y-${year._id}`);
                loadModules(year._id);
              }}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 font-heading font-semibold"
            >
              {year.name}
              <span>{expanded[`y-${year._id}`] ? '−' : '+'}</span>
            </button>
            {expanded[`y-${year._id}`] && (modulesByYear[year._id] || []).map((mod) => (
              <div key={mod._id} className="border-t pl-4">
                <button
                  onClick={() => {
                    toggle(`m-${mod._id}`);
                    loadSubjects(mod._id);
                  }}
                  className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50"
                >
                  {mod.name}
                  <span>{expanded[`m-${mod._id}`] ? '−' : '+'}</span>
                </button>
                {expanded[`m-${mod._id}`] && (
                  <>
                    {(subjectsByModule[mod._id] || []).map((sub) => (
                      <div key={sub._id} className="pl-4 border-t">
                        <button
                          onClick={() => {
                            toggle(`s-${sub._id}`);
                            loadTopics(sub._id);
                          }}
                          className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 text-sm"
                        >
                          {sub.name}
                          <span>{expanded[`s-${sub._id}`] ? '−' : '+'}</span>
                        </button>
                        {expanded[`s-${sub._id}`] && (
                          <div className="pl-4 pb-2">
                            {(topicsBySubject[sub._id] || []).map((topic) => (
                              <Link
                                key={topic._id}
                                to={`/student/topics/${topic._id}`}
                                className="flex items-center gap-2 py-1.5 text-sm text-primary hover:underline"
                              >
                                <BookOpen className="w-4 h-4" />
                                {topic.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {(ospesByModule[mod._id] || []).map((ospe) => (
                      <Link
                        key={ospe._id}
                        to={`/student/ospes/${ospe._id}`}
                        className="flex items-center gap-2 py-2 pl-4 text-sm text-primary hover:underline"
                      >
                        <ClipboardList className="w-4 h-4" />
                        {ospe.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        {years.length === 0 && <p className="text-gray-500">No resources available.</p>}
      </div>
    </section>
  );
}
