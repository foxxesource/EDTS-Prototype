import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, FileText, ShieldCheck, MessageSquare, Download, Upload, Send, Lock } from 'lucide-react';
import { mockDb } from '../../services/mockDb';

type ApprovalStep = 'REVIEWING' | 'SIGNING' | 'GRANTED';

export const ApprovalHub = ({ companyName, onLive }: { companyName: string, onLive: () => void }) => {
  const [step, setStep] = useState<ApprovalStep>('REVIEWING');
  const [signedFile, setSignedFile] = useState<File | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  const handleUnlock = () => {
    if (secretKey === 'indiana-2026') {
      setIsUnlocked(true);
    } else {
      alert('Invalid secret key. Please check your credentials.');
    }
  };

  const handleUpload = () => {
    if (!signedFile) return;
    mockDb.uploadSignedDoc('current_user@company.com', 'uploads/signed_agreement.pdf');
    setStep('GRANTED');
    onLive();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    mockDb.addNegotiationMessage('current_user@company.com', {
      sender: 'Franchisee',
      text: messageInput
    });
    setMessageInput('');
  };

  const mockComments = [
    { id: 1, sender: 'Franchisee', text: 'The 50 TPS limit is slightly lower than our current projection for peak hours. Can we increase this to 100 TPS?', time: 'Oct 2, 10:15 AM', isFranchisor: false },
    { id: 2, sender: 'Franchisor', text: 'We can increase it to 75 TPS for the first 6 months as a trial period. Does that work?', time: 'Oct 2, 02:30 PM', isFranchisor: true },
    { id: 3, sender: 'Franchisee', text: '75 TPS should be sufficient for our initial launch. We accept this term.', time: 'Oct 3, 09:00 AM', isFranchisor: false },
  ];

  const isUatComplete = localStorage.getItem('uat_onboarding_complete') === 'true';
  const userStatus = mockDb.getUser('current_user@company.com')?.agreementStatus || 'APPROVED';
  const isAdminApproved = userStatus === 'APPROVED';

  return (
    <div className="relative">
      {!isUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 p-4">
          <Card className="p-8 max-w-md w-full shadow-2xl text-center space-y-6 border-2 border-blue-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Agreement Locked</h2>
              <p className="text-slate-500">Please enter your partner secret key to view the commercial agreement.</p>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter Secret Key"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center font-mono outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
              <Button onClick={handleUnlock} className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700">
                Unlock Agreement
              </Button>
            </div>
          </Card>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-6xl mx-auto transition-all duration-500 ${!isUnlocked ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Activation Hub</h1>
          <p className="text-slate-500">Collaborative Agreement Review for {companyName}</p>

          <div className="absolute -top-4 right-0 lg:right-1/4">
            <Badge className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isAdminApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
              {isAdminApproved ? '✓ Admin Approved' : 'Pending Admin Approval'}
            </Badge>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'REVIEWING' && (
            <motion.div key="reviewing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex flex-col lg:flex-row gap-8 mb-12 h-[600px]">
                <div className="lg:w-[70%] overflow-y-auto bg-white shadow-sm border border-slate-200 rounded-sm p-12 font-serif text-slate-800 relative">
                  <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Commercial Terms of Agreement</h2>
                    <div className="w-20 h-1 bg-slate-900 mx-auto mb-8" />
                  </div>
                  <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                      <h3 className="font-bold text-slate-900 mb-2">1. Scope of Partnership</h3>
                      <p>The Franchisor grants the Franchisee the non-exclusive right to distribute digital goods via the INDIANA Network API.</p>
                    </section>
                    <section className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg relative">
                      <div className="absolute -right-3 top-2">
                        <MessageSquare className="w-5 h-5 text-yellow-600 bg-white rounded-full p-1 shadow-sm" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">2. API Rate Limits & Technical Bounds</h3>
                      <p>API access is capped at <span className="font-bold underline decoration-yellow-500 underline-offset-4">75 TPS</span>.</p>
                    </section>
                    <section>
                      <h3 className="font-bold text-slate-900 mb-2">3. Commercial Margin</h3>
                      <p>The Franchisee shall be entitled to a 5% discount on all wholesale game vouchers.</p>
                    </section>
                    <section>
                      <h3 className="font-bold text-slate-900 mb-2">4. Service Level Agreement (SLA)</h3>
                      <p>INDIANA guarantees a 99.9% uptime for the core API endpoints.</p>
                    </section>
                    <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-2 gap-12">
                      <div className="text-center"><div className="h-12 border-b border-slate-300 mb-2" /><span className="text-xs text-slate-400 uppercase font-bold">Franchisor Signature</span></div>
                      <div className="text-center"><div className="h-12 border-b border-slate-300 mb-2" /><span className="text-xs text-slate-400 uppercase font-bold">Franchisee Signature</span></div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-[30%] flex flex-col bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-700">Negotiation History</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className={`flex flex-col ${comment.isFranchisor ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-sm ${comment.isFranchisor ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                          <div className={`font-bold text-[10px] opacity-70 mb-1 uppercase ${comment.isFranchisor ? 'text-slate-500' : 'text-blue-100'}`}>{comment.sender}</div>
                          <p>{comment.text}</p>
                          <div className={`text-[9px] mt-1 text-right opacity-60 ${comment.isFranchisor ? 'text-slate-400' : 'text-blue-100'}`}>{comment.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="px-3"><Send className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button
                  className="px-12 py-4 text-xl shadow-xl bg-blue-600 hover:bg-blue-700 transition-all"
                  onClick={() => setStep('SIGNING')}
                  disabled={!isUatComplete}
                >
                  Accept Proposal & Sign
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'SIGNING' && (
            <motion.div key="signing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Signing Phase</h2>
                <p className="text-slate-500">Please download, sign, and upload your agreement to activate your account</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2"><Download className="w-8 h-8" /></div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900">Step 1: Download</h3>
                    <p className="text-sm text-slate-500">Download the finalized commercial agreement for signing.</p>
                  </div>
                  <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => alert('Downloading Agreement_Final.pdf...')}>
                    <FileText className="w-4 h-4" /> Download Proposal PDF
                  </Button>
                </Card>
                <Card className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2"><Upload className="w-8 h-8" /></div>
                  <div className="w-full space-y-4">
                    <div className="relative group">
                      <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`p-4 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center ${signedFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 group-hover:border-blue-400'}`}>
                        {signedFile ? <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> {signedFile.name}</div> : <span className="text-xs text-slate-400">Click or drag PDF here</span>}
                      </div>
                    </div>
                    <Button className="w-full" disabled={!signedFile} onClick={handleUpload}>Submit Signed Document</Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 'GRANTED' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
              <div className="p-6 bg-blue-50 text-blue-700 rounded-2xl border-2 border-blue-200 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {isAdminApproved ? 'Agreement Approved!' : 'Pending Review!'}
                  </span>
                  <span className={`text-sm font-medium opacity-80 ${isAdminApproved ? 'text-emerald-600' : ''}`}>
                    Status: {isAdminApproved ? 'Approved by Admin' : 'Default (Awaiting Admin Approval)'}
                  </span>
                </div>
              </div>
              <p className="text-slate-500 font-medium text-center max-w-md">Just 1 step ahead before production! Just give us some time to review the documents and then we good to go yay!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
