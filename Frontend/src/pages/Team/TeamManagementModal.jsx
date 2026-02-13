import React, { useState, useEffect } from 'react';
import { 
  X, Users, User, Loader2, Trash2, CheckCircle, 
  AlertCircle, Mail, Phone, RefreshCw, ArrowLeft, UserPlus, Plus, Check
} from 'lucide-react';
import { api } from '../../api/axios';

const TeamManagementModal = ({ isOpen, onClose, token, user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingMember, setRemovingMember] = useState(null);
  const [addingMember, setAddingMember] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'details'
  
  // Add member states
  const [newMemberIdentifier, setNewMemberIdentifier] = useState('');
  const [addMemberStatus, setAddMemberStatus] = useState(''); // 'idle', 'loading', 'success', 'error'
  const [addMemberError, setAddMemberError] = useState('');

  // Fetch user's teams
  const fetchUserTeams = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await api.get('/teams/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const fetchedTeams = response.data.data || [];
        console.log('Fetched teams:', fetchedTeams);
        setTeams(fetchedTeams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single team details
  const fetchTeamDetails = async (teamId) => {
    try {
      setLoading(true);
      const response = await api.get(`/teams/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const teamData = response.data.data;
        setSelectedTeam(teamData);
        setView('details');
        // Reset add member states
        setNewMemberIdentifier('');
        setAddMemberStatus('');
        setAddMemberError('');
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
      setError('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD TEAM MEMBER FUNCTIONALITY =================
  const addTeamMember = async () => {
    // Validation
    if (!newMemberIdentifier.trim()) {
      setAddMemberError('Please enter email or user ID');
      return;
    }

    if (!selectedTeam) {
      setAddMemberError('No team selected');
      return;
    }

    // Check if trying to add self
    if (newMemberIdentifier.trim() === user.email || newMemberIdentifier.trim() === user.userId) {
      setAddMemberError('You are already the team leader');
      return;
    }

    try {
      setAddingMember(true);
      setAddMemberStatus('loading');
      setAddMemberError('');

      // POST /teams/:teamId/members - Add member
      const response = await api.post(`/teams/${selectedTeam._id}/members`, {
        userIdentifier: newMemberIdentifier.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add member');
      }

      // Success
      setAddMemberStatus('success');
      setNewMemberIdentifier('');
      
      // Fetch updated team details
      await fetchTeamDetails(selectedTeam._id);
      
      // Also update teams list
      await fetchUserTeams();

      // Show success message
      setSuccessMessage('Member added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset status after 2 seconds
      setTimeout(() => {
        setAddMemberStatus('');
      }, 2000);

    } catch (error) {
      console.error('Error adding team member:', error);
      
      let errorMessage = 'Failed to add member';
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        errorMessage = 'Only team leader can add members';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (error.response?.status === 409) {
        errorMessage = 'User already in team';
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      setAddMemberError(errorMessage);
      setAddMemberStatus('error');
    } finally {
      setAddingMember(false);
    }
  };

  // Remove team member
  const removeTeamMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    try {
      setRemovingMember(memberId);

      const response = await api.delete(`/teams/${selectedTeam._id}/members/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update selected team data
        setSelectedTeam(prev => ({
          ...prev,
          teamMembers: prev.teamMembers.filter(m => m._id !== memberId)
        }));

        // Also update teams list
        setTeams(prev => prev.map(team => {
          if (team._id === selectedTeam._id) {
            return {
              ...team,
              teamMembers: team.teamMembers.filter(m => m._id !== memberId)
            };
          }
          return team;
        }));

        setSuccessMessage(`${memberName} removed successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      let errorMessage = 'Failed to remove member';
      
      if (error.response?.status === 403) {
        errorMessage = 'Only team leader can remove members';
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setRemovingMember(null);
    }
  };

  // Delete entire team
  const deleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to delete team "${teamName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.delete(`/teams/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTeams(prev => prev.filter(team => team._id !== teamId));
        setSuccessMessage(`Team "${teamName}" deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        
        if (selectedTeam?._id === teamId) {
          setView('list');
          setSelectedTeam(null);
        }
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      let errorMessage = 'Failed to delete team';
      
      if (error.response?.status === 403) {
        errorMessage = 'Only team leader can delete the team';
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserTeams();
      setView('list');
      setSelectedTeam(null);
      setError('');
      setSuccessMessage('');
      setNewMemberIdentifier('');
      setAddMemberStatus('');
      setAddMemberError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isTeamLeader = (team) => {
    return team.teamLeader?._id === user?._id || team.teamLeader === user?._id;
  };

  const getMemberName = (member) => {
    return member.name || member.userId || member.email || 'Unknown';
  };

  // Render team list view
  const renderTeamList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#2b123f]">My Teams</h3>
        <button
          onClick={fetchUserTeams}
          className="p-2 text-[#4b1b7a] hover:bg-[#4b1b7a]/10 rounded-full transition-colors"
          title="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-[#4b1b7a] animate-spin mb-4" />
          <p className="text-[#2b123f]/70">Loading your teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[#b692ff] rounded-xl bg-white/50">
          <Users className="w-16 h-16 text-[#4b1b7a]/30 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-[#2b123f] mb-2">
            No Teams Found
          </h4>
          <p className="text-sm text-[#2b123f]/70">
            You haven't created or joined any teams yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 no-scrollbar">
          {teams.map(team => {
            const isLeader = isTeamLeader(team);
            const teamSize = 1 + (team.teamMembers?.length || 0);
            
            return (
              <div
                key={team._id}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  isLeader 
                    ? 'border-[#4b1b7a] bg-[#4b1b7a]/5' 
                    : 'border-[#b692ff] bg-white/50'
                }`}
                onClick={() => fetchTeamDetails(team._id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#4b1b7a]" />
                    <h4 className="font-semibold text-[#2b123f]">
                      {team.teamName}
                    </h4>
                  </div>
                  {isLeader && (
                    <span className="text-xs bg-[#4b1b7a] text-white px-2 py-1 rounded-full">
                      Leader
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-[#2b123f]/70">
                    Team Size: {teamSize} member{teamSize !== 1 ? 's' : ''}
                  </p>
                  
                  {/* Team Leader */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#4b1b7a]" />
                    <span className="text-[#2b123f]">
                      {team.teamLeader?.name || 'Team Leader'}
                    </span>
                    {team.teamLeader?._id === user?._id && (
                      <span className="text-xs text-green-600">(You)</span>
                    )}
                  </div>

                  {/* Members Preview */}
                  {team.teamMembers?.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {team.teamMembers.slice(0, 3).map((member, idx) => (
                        <span key={idx} className="text-xs bg-[#b692ff]/20 px-2 py-1 rounded-full">
                          {getMemberName(member)}
                        </span>
                      ))}
                      {team.teamMembers.length > 3 && (
                        <span className="text-xs text-[#2b123f]/50">
                          +{team.teamMembers.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 text-xs text-[#4b1b7a] flex items-center gap-1">
                  Click to manage team
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Render team details view
  const renderTeamDetails = () => {
    if (!selectedTeam) return null;

    const isLeader = isTeamLeader(selectedTeam);
    const teamSize = 1 + (selectedTeam.teamMembers?.length || 0);

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => {
              setView('list');
              setSelectedTeam(null);
              setNewMemberIdentifier('');
              setAddMemberStatus('');
              setAddMemberError('');
            }}
            className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#4b1b7a]" />
          </button>
          <h3 className="text-xl font-semibold text-[#2b123f]">
            {selectedTeam.teamName}
          </h3>
        </div>

        {/* Team Info Card */}
        <div className="bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] p-4 rounded-xl text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">Team Details</span>
            </div>
            {isLeader && (
              <button
                onClick={() => deleteTeam(selectedTeam._id, selectedTeam.teamName)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                title="Delete Team"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <p>Team ID: {selectedTeam._id.slice(-8).toUpperCase()}</p>
            <p>Total Members: {teamSize}</p>
            <p>Created: {new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Team Leader Section */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Team Leader
          </h4>
          
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className="w-10 h-10 bg-[#4b1b7a] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2b123f]">
                {selectedTeam.teamLeader?.name || 'Team Leader'}
                {selectedTeam.teamLeader?._id === user?._id && ' (You)'}
              </p>
              {selectedTeam.teamLeader?.email && (
                <p className="text-xs text-[#2b123f]/70 flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" />
                  {selectedTeam.teamLeader.email}
                </p>
              )}
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Team Members Section */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <h4 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Members ({selectedTeam.teamMembers?.length || 0})
          </h4>

          {selectedTeam.teamMembers?.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {selectedTeam.teamMembers.map((member) => {
                const memberName = getMemberName(member);
                const memberId = member._id;

                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#b692ff] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#2b123f]">{memberName}</p>
                        {member.email && (
                          <p className="text-xs text-[#2b123f]/70 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove button - Only for team leader */}
                    {isLeader && (
                      <button
                        onClick={() => removeTeamMember(memberId, memberName)}
                        disabled={removingMember === memberId}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                        title="Remove Member"
                      >
                        {removingMember === memberId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-4 text-[#2b123f]/50">
              No team members yet
            </p>
          )}

          {/* Add Member Form - Only for team leader */}
          {isLeader && (
            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <h5 className="font-medium text-purple-600 mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add New Member
              </h5>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMemberIdentifier}
                    onChange={(e) => {
                      setNewMemberIdentifier(e.target.value);
                      setAddMemberError('');
                    }}
                    placeholder="Enter email or user ID"
                    className="flex-1 px-3 py-2 bg-white border border-[#b692ff] rounded-lg text-[#2b123f] focus:outline-none focus:border-[#4b1b7a]"
                    disabled={addingMember || addMemberStatus === 'loading'}
                  />
                  <button
                    onClick={addTeamMember}
                    disabled={!newMemberIdentifier.trim() || addingMember || addMemberStatus === 'loading'}
                    className="px-4 py-2 bg-[#4b1b7a] text-white rounded-lg hover:bg-[#6b2bb9] disabled:opacity-50 flex items-center gap-2"
                  >
                    {addMemberStatus === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : addMemberStatus === 'success' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Add member error message */}
                {addMemberError && (
                  <p className="text-xs text-red-600 bg-red-500/10 p-2 rounded-lg">
                    {addMemberError}
                  </p>
                )}

                <p className="text-xs text-[#2b123f]/60">
                  Add team members by their email address or user ID
                </p>
              </div>
            </div>
          )}

          {!isLeader && (
            <p className="mt-3 text-xs text-yellow-600 bg-yellow-500/10 p-2 rounded-lg">
              Only team leader can add or remove members.
            </p>
          )}
        </div>

        {/* Events this team is registered for */}
        {selectedTeam.eventEnrollments?.length > 0 && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Registered Events ({selectedTeam.eventEnrollments.length})
            </h4>
            
            <div className="space-y-2">
              {selectedTeam.eventEnrollments.map((enrollment, idx) => (
                <div key={idx} className="p-2 bg-white/50 rounded-lg">
                  <p className="font-medium text-[#2b123f]">
                    {enrollment.event?.title || 'Event'}
                  </p>
                  <p className="text-xs text-[#2b123f]/70">
                    Registered on: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#eadbff] rounded-2xl w-full max-w-2xl border-2 border-dashed border-black/60 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#eadbff] border-b border-[#b692ff] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2b123f] flex items-center gap-2">
              <Users className="w-6 h-6" />
              Team Management
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#2b123f]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {view === 'list' ? renderTeamList() : renderTeamDetails()}
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;