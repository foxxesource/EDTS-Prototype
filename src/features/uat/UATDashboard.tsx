import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, PlayCircle, Terminal, ShieldCheck, BookOpen, X } from 'lucide-react';
import { API_DOCS } from './uatApiSpecs';
import { mockDb } from '../../services/mockDb';

const SCENARIOS = [
  { id: 1, name: 'Generate Authentication Token', description: 'Verify that the OAuth2 flow returns a valid JWT token.' },
  { id: 2, name: 'Fetch Active Catalog', description: 'Ensure the catalog API returns available digital goods.' },
  { id: 3, name: 'Simulate Successful Top-up', description: 'Trigger a purchase and verify the success callback.' },
  { id: 4, name: 'Simulate Failed Transaction', description: 'Trigger a purchase with insufficient balance.' },
];

export const UATDashboard = ({ onComplete, companyName }: { onComplete: () => void, companyName: string }) => {
  const [passedTests, setPassedTests] = useState<number[]>(() => {
    const saved = localStorage.getItem('indiana_uat_progress');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSimulating, setIsSimulating] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>(['System initialized. Ready for UAT testing...']);
  const [isDocOpen, setIsDocOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('indiana_uat_progress', JSON.stringify(passedTests));
    // Also sync to mockDb if possible (in a real app, this would be an API call)
    // We use a dummy email for this prototype's local user session
    mockDb.updateUATProgress('current_user@company.com', passedTests[passedTests.length - 1] || 0);
  }, [passedTests]);

  const progress = (passedTests.length / SCENARIOS.length) * 100;

  const simulateApiCall = (id: number) => {
    if (passedTests.includes(id)) return;

    setIsSimulating(id);
    setLogs(prev => [...prev, `> Initiating test scenario ${id}...`]);

    setTimeout(() => {
      setLogs(prev => [...prev, `> Request sent to /api/uat/test/${id}...`]);

      setTimeout(() => {
        setPassedTests(prev => [...prev, id]);
        setIsSimulating(null);
        setLogs(prev => [...prev, `> Scenario ${id} PASSED. Response: 200 OK`]);
      }, 800);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">UAT Dashboard</h1>
        <p className="text-slate-500">Welcome, {companyName}. Please complete the API verification steps.</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Overall Integration Progress</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            <Button
              variant="secondary"
              className="text-xs h-8 px-3 flex items-center gap-2"
              onClick={() => setIsDocOpen(true)}
            >
              <BookOpen className="w-3 h-3" />
              API Reference
            </Button>
          </div>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <motion.div
            className="bg-blue-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {SCENARIOS.map((scenario) => (
            <Card key={scenario.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">{scenario.name}</h3>
                <p className="text-xs text-slate-500">{scenario.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={passedTests.includes(scenario.id) ? 'success' : 'pending'}>
                  {passedTests.includes(scenario.id) ? 'Passed' : 'Pending'}
                </Badge>
                <Button
                  variant="secondary"
                  className="p-2 h-auto w-auto"
                  onClick={() => simulateApiCall(scenario.id)}
                  disabled={passedTests.includes(scenario.id) || isSimulating !== null}
                >
                  <PlayCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900 text-slate-300 p-4 font-mono text-xs h-full min-h-[300px] flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-slate-500">
            <Terminal className="w-4 h-4" />
            <span>UAT_SIMULATION_LOG</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="opacity-80">{log}</div>
            ))}
          </div>
        </Card>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <Button
            className="px-8 py-4 text-xl shadow-lg"
            onClick={onComplete}
          >
            <ShieldCheck className="w-6 h-6 mr-2" />
            Submit UAT Result
          </Button>
        </motion.div>
      )}
      <ApiDocPanel isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />
    </motion.div>
  );
};

const ApiDocPanel = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">API Reference Guide</h2>
              </div>
              <Button variant="secondary" className="p-2 h-auto w-auto" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-12">
              {API_DOCS.map((cat) => (
                <div key={cat.category}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    {cat.category}
                  </h3>
                  <div className="space-y-8">
                    {cat.endpoints.map((ep, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ep.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            ep.method === 'GET' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-sm font-medium text-slate-800">{ep.path}</span>
                        </div>
                        <p className="text-sm text-slate-600">{ep.description}</p>

                        {ep.parameters.length > 0 && (
                          <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                  <th className="px-3 py-2">Parameter</th>
                                  <th className="px-3 py-2">Type</th>
                                  <th className="px-3 py-2">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {ep.parameters.map((p, i) => (
                                  <tr key={i}>
                                    <td className="px-3 py-2 font-mono font-medium text-slate-700">
                                      {p.name} {p.required && <span className="text-red-500">*</span>}
                                    </td>
                                    <td className="px-3 py-2 text-slate-500">{p.type}</td>
                                    <td className="px-3 py-2 text-slate-600">{p.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Request Body</span>
                            <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] rounded-lg overflow-x-auto whitespace-pre">
                              {ep.requestBody || '// No request body required'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Response Body</span>
                            <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] rounded-lg overflow-x-auto whitespace-pre">
                              {ep.responseBody}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};