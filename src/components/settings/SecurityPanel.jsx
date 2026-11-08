
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2,
  Smartphone,
  Mail,
  Globe,
  UserCheck,
  Activity,
  Clock,
  Zap
} from "lucide-react";
import { User } from "@/api/entities";

export default function SecurityPanel() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    passwordChangeRequired: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    loginNotifications: true,
    secureBackups: true,
    encryptionEnabled: true,
    apiAccessEnabled: false,
    dataRetentionDays: 2555
  });

  const [loginHistory, setLoginHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [securityScore, setSecurityScore] = useState(85);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    loadSecurityData();
    calculateSecurityScore();
  }, []);

  const loadSecurityData = async () => {
    try {
      // In a real app, this would fetch from backend
      const mockLoginHistory = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          location: "New York, NY",
          device: "Chrome on Windows",
          ipAddress: "192.168.1.1",
          status: "success"
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          location: "Los Angeles, CA",
          device: "Safari on iPhone",
          ipAddress: "10.0.0.1",
          status: "success"
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          location: "Unknown Location",
          device: "Chrome on Linux",
          ipAddress: "203.0.113.1",
          status: "blocked"
        }
      ];

      const mockActiveSessions = [
        {
          id: 1,
          device: "Chrome on Windows",
          location: "New York, NY",
          lastActive: new Date(Date.now() - 1000 * 60 * 5),
          current: true
        },
        {
          id: 2,
          device: "Mobile App on iPhone",
          location: "New York, NY",
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
          current: false
        }
      ];

      setLoginHistory(mockLoginHistory);
      setActiveSessions(mockActiveSessions);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  };

  const calculateSecurityScore = () => {
    let score = 0;
    
    // Base security measures
    if (securitySettings.twoFactorEnabled) score += 30;
    if (securitySettings.encryptionEnabled) score += 20;
    if (securitySettings.secureBackups) score += 15;
    if (securitySettings.loginNotifications) score += 10;
    if (securitySettings.sessionTimeout <= 30) score += 10;
    if (securitySettings.ipWhitelist.length > 0) score += 15;
    
    setSecurityScore(Math.min(100, score + 20)); // Base 20 points
  };

  const handleSettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Recalculate security score
    setTimeout(calculateSecurityScore, 100);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match!");
      return;
    }
    
    if (passwordData.new.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      // In a real app, this would call the backend
      console.log('Changing password...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordData({ current: "", new: "", confirm: "" });
      setIsChangingPassword(false);
      alert("Password changed successfully!");
      
    } catch (error) {
      console.error('Error changing password:', error);
      alert("Failed to change password. Please try again.");
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
      alert("Session terminated successfully!");
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  const enable2FA = async () => {
    try {
      // In a real app, this would initiate 2FA setup
      console.log('Setting up 2FA...');
      handleSettingChange('twoFactorEnabled', true);
      alert("2FA setup initiated! Check your email for instructions.");
    } catch (error) {
      console.error('Error setting up 2FA:', error);
    }
  };

  const getSecurityScoreColor = () => {
    if (securityScore >= 90) return 'text-green-400';
    if (securityScore >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSecurityScoreStatus = () => {
    if (securityScore >= 90) return 'Excellent';
    if (securityScore >= 70) return 'Good';
    if (securityScore >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <style jsx>{`
        .security-panel-container {
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.98) 0%,
            rgba(30, 41, 59, 0.96) 50%,
            rgba(51, 65, 85, 0.94) 100%
          );
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6) 1;
          border-radius: 20px;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(16, 185, 129, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .security-score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #ef4444 0deg,
            #f97316 60deg,
            #eab308 120deg,
            #10b981 180deg,
            #10b981 ${(securityScore / 100) * 360}deg,
            rgba(255, 255, 255, 0.1) ${(securityScore / 100) * 360}deg,
            rgba(255, 255, 255, 0.1) 360deg
          );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .security-score-inner {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(145deg, 
            rgba(15, 23, 42, 0.95) 0%,
            rgba(30, 41, 59, 0.9) 100%
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .security-item {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        
        .security-item:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .login-history-item {
          background: linear-gradient(135deg, 
            rgba(30, 41, 59, 0.8) 0%,
            rgba(51, 65, 85, 0.6) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .login-history-item:hover {
          background: linear-gradient(135deg, 
            rgba(30, 41, 59, 0.9) 0%,
            rgba(51, 65, 85, 0.7) 100%
          );
          transform: translateX(4px);
        }
        
        .session-item {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(37, 99, 235, 0.08) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .session-item.current {
          border: 1px solid rgba(16, 185, 129, 0.5);
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.1) 0%,
            rgba(5, 150, 105, 0.08) 100%
          );
        }
        
        .password-strength-bar {
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          margin-top: 0.5rem;
        }
        
        .password-strength-fill {
          height: 100%;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Security Overview */}
      <Card className="security-panel-container">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <CardTitle className="text-xl text-white">Security Overview</CardTitle>
            </div>
            <Badge className={`${getSecurityScoreColor()} bg-transparent border-current`}>
              {getSecurityScoreStatus()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="security-score-circle">
              <div className="security-score-inner">
                <div className={`text-2xl font-bold ${getSecurityScoreColor()}`}>
                  {securityScore}%
                </div>
                <div className="text-xs text-gray-400">Security Score</div>
              </div>
            </div>
            
            <div className="flex-1 ml-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{loginHistory.length}</div>
                  <div className="text-sm text-gray-400">Recent Logins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{activeSessions.filter(s => s.current).length}</div>
                  <div className="text-sm text-gray-400">Active Sessions</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {securitySettings.twoFactorEnabled ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-gray-300">Two-Factor Authentication</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {securitySettings.secureBackups ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-gray-300">Secure Backups</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="security-panel-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-blue-400" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="security-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-semibold text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {securitySettings.twoFactorEnabled && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Enabled
                  </Badge>
                )}
                <Button
                  onClick={enable2FA}
                  disabled={securitySettings.twoFactorEnabled}
                  className={securitySettings.twoFactorEnabled ? 
                    "bg-gray-600 cursor-not-allowed" : 
                    "bg-purple-600 hover:bg-purple-700"
                  }
                >
                  {securitySettings.twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
                </Button>
              </div>
            </div>
          </div>

          {/* Login Notifications */}
          <div className="security-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-white">Login Notifications</h4>
                  <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                </div>
              </div>
              <Switch
                checked={securitySettings.loginNotifications}
                onCheckedChange={(checked) => handleSettingChange('loginNotifications', checked)}
              />
            </div>
          </div>

          {/* Session Timeout */}
          <div className="security-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <h4 className="font-semibold text-white">Session Timeout</h4>
                  <p className="text-sm text-gray-400">Auto-logout after inactivity</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-20 bg-gray-700 border-gray-600 text-white"
                  min="5"
                  max="480"
                />
                <span className="text-sm text-gray-400">minutes</span>
              </div>
            </div>
          </div>

          {/* API Access */}
          <div className="security-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <h4 className="font-semibold text-white">API Access</h4>
                  <p className="text-sm text-gray-400">Allow third-party integrations</p>
                </div>
              </div>
              <Switch
                checked={securitySettings.apiAccessEnabled}
                onCheckedChange={(checked) => handleSettingChange('apiAccessEnabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card className="security-panel-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5 text-yellow-400" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Password</h4>
                  <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                </div>
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Change Password
                </Button>
              </div>
              
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertTriangle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label className="text-gray-300">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto bg-transparent hover:bg-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    required
                    minLength="8"
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto bg-transparent hover:bg-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {passwordData.new && (
                  <div className="password-strength-bar">
                    <div 
                      className="password-strength-fill"
                      style={{
                        width: `${Math.min(100, (passwordData.new.length / 12) * 100)}%`,
                        background: passwordData.new.length >= 12 ? '#10b981' : 
                                  passwordData.new.length >= 8 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-300">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto bg-transparent hover:bg-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ current: "", new: "", confirm: "" });
                  }}
                  variant="outline"
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Login History */}
      <Card className="security-panel-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5 text-green-400" />
            Recent Login Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <motion.div
                key={login.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-history-item"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      login.status === 'success' ? 'bg-green-400' : 
                      login.status === 'blocked' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{login.device}</span>
                        {login.status === 'blocked' && (
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                            Blocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {login.location} • {login.ipAddress}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {login.timestamp.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {login.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="security-panel-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-blue-400" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`session-item ${session.current ? 'current' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{session.device}</span>
                        {session.current && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {session.location} • Last active {session.lastActive.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      onClick={() => terminateSession(session.id)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-xs"
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
