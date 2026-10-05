import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Plus, User, Activity, FileText, CheckCircle, LogOut, Send, MessageSquare, Eye, Download } from 'lucide-react';
import { mockDb } from '../../services/mockDb';

// Sub-component for the Agreements Negotiation Center
const NegotiationCenter = () => {
  const [selectedClientEmail, setSelectedClientEmail] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState(mockDb.getAllUsers());
  const [viewMode, setViewMode] = useState<'negotiation' | 'submissions'>('negotiation');

  useEffect(() => {
    setUsers(mockDb.getAllUsers());
  }, []);

  const negotiationUsers = users.filter(u => u.agreementStatus !== 'APPROVED' && u.agreementStatus !== 'UPLOADED');
  const submittedUsers = users.filter(u => u.signedDocUrl);
  const selectedClient = users.find(u => u.email === selectedClientEmail);

  const handleSendReply = () => {
    if (!selectedClientEmail || !messageInput.trim()) return;

    mockDb.addNegotiationMessage(selectedClientEmail, {
      sender: 'Franchisor',
      text: messageInput
    });

    setMessageInput('');
    setUsers(mockDb.getAllUsers());
  };

  return (
    <div className="flex h-[calc(100vh-250px)] gap-6">
      {/* Area 1: Sidebar (30%) */}
      <div className="w-[30%] flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Agreement Center</h3>
            <div className="flex bg-slate-200 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('negotiation')}
                className={`text-[10px] px-2 py-1 rounded-md transition-all ${viewMode === 'negotiation' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500'}`}
              >
                Negotiate
              </button>
              <button
                onClick={() => setViewMode('submissions')}
                className={`text-[10px] px-2 py-1 rounded-md transition-all ${viewMode === 'submissions' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500'}`}
              >
                Submissions
              </button>
            </div>
          </div>
          {viewMode === 'negotiation' && <p className="text-xs text-slate-500">Active proposals</p>}
          {viewMode === 'submissions' && <p className="text-xs text-slate-500">Signed documents</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {(viewMode === 'negotiation' ? negotiationUsers : submittedUsers).length > 0 ? (
            (viewMode === 'negotiation' ? negotiationUsers : submittedUsers).map(user => {
              const lastMsg = user.negotiationHistory[user.negotiationHistory.length - 1];
              const hasUnread = lastMsg?.sender === 'Franchisee';

              return (
                <div
                  key={user.email}
                  onClick={() => setSelectedClientEmail(user.email)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedClientEmail === user.email
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-900">{user.companyName}</span>
                    {hasUnread && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={user.agreementStatus === 'UPLOADED' ? 'success' : 'pending'} className="text-[10px] py-0 px-1.5">
                      {user.agreementStatus}
                    </Badge>
                    <span className="text-[10px] text-slate-400">v{user.agreementVersion}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 italic">
              No {viewMode === 'negotiation' ? 'active negotiations' : 'submissions'} found.
            </div>
          )}
        </div>
      </div>

      {/* Area 2: Main View (70%) */}
      <div className="w-[70%] flex flex-col gap-6">
        {!selectedClient ? (
          <div className="h-full flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-2xl text-slate-400">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a client from the inbox to view details</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedClient?.companyName}</h2>
                <div className="flex gap-3 mt-1">
                  <Badge variant="success" className="text-xs">UAT: Passed</Badge>
                  <span className="text-xs text-slate-500 font-medium">Document: Agreement_v{selectedClient?.agreementVersion}.pdf</span>
                </div>
              </div>
              <div className="flex gap-3">
                {viewMode === 'negotiation' && (
                  <Button
                    className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      if (!selectedClientEmail) return;
                      mockDb.updateAgreementStatus(selectedClientEmail, 'APPROVED');
                      setUsers(mockDb.getAllUsers());
                    }}
                  >
                    <CheckCircle className="w-4 h-4" /> Approve Agreement
                  </Button>
                )}
              </div>
            </div>

            {viewMode === 'negotiation' ? (
              <div className="flex-1 grid grid-cols-2 gap-6 h-full overflow-hidden">
                {/* Left: Document Context */}
                <Card className="p-6 bg-white border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      <h3 className="font-bold text-slate-900">Negotiation Focus</h3>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                      "The API access is capped at 75 Transactions Per Second (TPS). Any requests exceeding this threshold will be throttled with a 429 Too Many Requests response."
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      This clause is currently being discussed in the thread.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button variant="secondary" className="flex-1 text-sm">View Full Document</Button>
                    <Button className="flex-1 text-sm">Upload Revised PDF</Button>
                  </div>
                </Card>

                {/* Right: The Thread */}
                <Card className="flex flex-col bg-white border-slate-200 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Negotiation Thread
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedClient?.negotiationHistory.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'Franchisor' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-sm ${
                          msg.sender === 'Franchisor'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tr-none'
                          : 'bg-blue-600 text-white rounded-tl-none'
                        }`}>
                          <div className={`font-bold text-[10px] opacity-70 mb-1 uppercase ${msg.sender === 'Franchisor' ? 'text-slate-500' : 'text-blue-100'}`}>
                            {msg.sender}
                          </div>
                          <p>{msg.text}</p>
                          <div className={`text-[9px] mt-1 text-right opacity-60 ${msg.sender === 'Franchisor' ? 'text-slate-400' : 'text-blue-100'}`}>
                            {msg.time}
                          </div>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    />
                    <Button onClick={handleSendReply} className="px-3">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-8 bg-white border-slate-200 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Signed Agreement</h3>
                  <p className="text-slate-500">The client has successfully uploaded the signed document.</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => alert(`Opening ${selectedClient?.signedDocUrl}...`)}
                  >
                    <Download className="w-4 h-4" /> View Signed PDF
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const AdminPortal = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'progress' | 'negotiations'>('users');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', companyName: '', applicationId: '', docFile: null as File | null });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    const docUrl = newUser.docFile ? `uploads/agreement_${newUser.email}.pdf` : 'default_agreement.pdf';

    mockDb.createUser({
      email: newUser.email,
      companyName: newUser.companyName,
      applicationId: newUser.applicationId,
      uatProgress: [],
      agreementStatus: 'AWAITING_SIGNATURE',
      commercialTerms: {
        rateLimit: '100 req/sec',
        wholesaleMargin: '10%',
        sla: '99.9%',
      },
      agreementVersion: 1,
      agreementDocUrl: docUrl,
      negotiationHistory: [],
    });
    setNewUser({ email: '', companyName: '', applicationId: '', docFile: null });
    setIsCreatingUser(false);
  };

  const users = mockDb.getAllUsers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-slate-500">Manage B2B users, monitor UAT, and approve agreements</p>
        </div>
        <Button variant="secondary" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'users' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('users')}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" /> User Management
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('progress')}
          className="flex items-center gap-2"
        >
          <Activity className="w-4 h-4" /> UAT Tracking
        </Button>
        <Button
          variant={activeTab === 'negotiations' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('negotiations')}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> Agreements
        </Button>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreatingUser(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create B2B User
            </Button>
          </div>

          {isCreatingUser && (
            <Card className="p-6 max-w-md mx-auto animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold mb-4">New B2B User</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Company Name</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.companyName}
                    onChange={e => setNewUser({...newUser, companyName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Application ID</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.applicationId}
                    onChange={e => setNewUser({...newUser, applicationId: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Commercial Agreement (PDF)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => setNewUser({...newUser, docFile: e.target.files?.[0] || null})}
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <Button variant="secondary" onClick={() => setIsCreatingUser(false)}>Cancel</Button>
                  <Button type="submit">Create User</Button>
                </div>
              </form>
            </Card>
          )}

          <Card className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">App ID</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{u.companyName}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4 font-mono text-xs">{u.applicationId}</td>
                    <td className="px-6 py-4">
                      <Badge variant={u.agreementStatus === 'APPROVED' ? 'success' : 'pending'}>
                        {u.agreementStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map(u => (
            <Card key={u.email} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{u.companyName}</h3>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <Badge variant={u.uatProgress.length === 4 ? 'success' : 'pending'}>
                  {u.uatProgress.length}/4 Completed
                </Badge>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-500"
                  style={{ width: `${(u.uatProgress.length / 4) * 100}%` }}
                />
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                {[1,2,3,4].map(id => (
                  <div
                    key={id}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      u.uatProgress.includes(id) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {u.uatProgress.includes(id) ? <CheckCircle className="w-3 h-3" /> : id}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'negotiations' && <NegotiationCenter />}
    </motion.div>
  );
};
