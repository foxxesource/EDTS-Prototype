import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Copy, AlertTriangle, Check, Timer } from 'lucide-react';

interface Credentials {
  clientId: string;
  clientSecret: string;
  sandboxUrl: string;
}

export const CredentialsPage = ({
  credentials,
  onContinue
}: {
  credentials: Credentials;
  onContinue: () => void
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowConfirmation(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, field: string) => {

    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const creds = [
    { label: 'Client ID', value: credentials.clientId, id: 'clientId' },
    { label: 'Client Secret', value: credentials.clientSecret, id: 'clientSecret' },
    { label: 'Sandbox API URL', value: credentials.sandboxUrl, id: 'sandboxUrl' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Sandbox Credentials</h1>
        <p className="text-slate-500">Use these keys to authenticate your API requests during UAT</p>
      </div>

      <div className="space-y-6">
        {/* Warning Banner */}
        <Card className="p-4 bg-amber-50 border-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">
              Important: Save your credentials now. For security reasons, they will not be shown again after you leave this page.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            <Timer className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-mono font-bold text-amber-700">{formatTime(timeLeft)}</span>
          </div>
        </Card>

        <Card className="p-8">
          <div className="space-y-6">
            {creds.map((cred) => (
              <div key={cred.id} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {cred.label}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      readOnly
                      value={cred.value}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm text-slate-600 outline-none"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => copyToClipboard(cred.value, cred.id)}
                    className="px-3 flex items-center justify-center gap-2"
                  >
                    {copiedField === cred.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">{copiedField === cred.id ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-3 text-lg"
            >
              Continue to UAT
            </Button>
          </div>
        </Card>

        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Are you sure?</h2>
                  <p className="text-slate-500">
                    Have you saved your credentials? For security reasons, they will not be shown again after you leave this page.
                  </p>
                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 py-3"
                    >
                      No, I need more time
                    </Button>
                    <Button
                      onClick={() => {
                        setShowConfirmation(false);
                        onContinue();
                      }}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Yes, I've saved them
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
