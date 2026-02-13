import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, Users, Plus, User, AlertCircle, CheckCircle, Loader2, 
  Check, UserPlus, RefreshCw, ArrowLeft, Trash2, Mail, XCircle 
} from 'lucide-react';
import { api } from '../../../api/axios';

const RegistrationModal = ({
  isOpen,
  onClose,
  event,
  userTeams = [],
  onEnroll,
  onRestore, // ✅ Restore handler prop
  loading = false,
  isAuthenticated,
  token,
  user,
  userEnrollments = [],
  refreshTeams
}) => {
  // ================= STATE MANAGEMENT =================
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [creatingNewTeam, setCreatingNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamCreationError, setTeamCreationError] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Team creation flow
  const [newlyCreatedTeam, setNewlyCreatedTeam] = useState(null);
  const [teamCreationStep, setTeamCreationStep] = useState('select');
  const [memberAddStatus, setMemberAddStatus] = useState({});
  const [isRefreshingTeams, setIsRefreshingTeams] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);
  
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [enrolledTeamInfo, setEnrolledTeamInfo] = useState(null);
  
  // State to track enrolled members
  const [enrolledMembers, setEnrolledMembers] = useState([]);

  // ✅ Check for deleted registration
  const [hasDeletedRegistration, setHasDeletedRegistration] = useState(false);
  const [deletedRegistrationId, setDeletedRegistrationId] = useState(null);
  
  // Calculate minimum team members needed (excluding team leader)
  const minAdditionalMembers = event?.teamSize?.min ? event.teamSize.min - 1 : 0;
  
  // Get selected team data with latest updates
  const getSelectedTeamData = () => {
    if (!selectedTeam) return null;
    
    // First check in teamOptions
    const fromOptions = teamOptions.find(t => t._id === selectedTeam);
    if (fromOptions) return fromOptions;
    
    // Then check newlyCreatedTeam
    if (newlyCreatedTeam?._id === selectedTeam) return newlyCreatedTeam;
    
    return null;
  };
  
  const selectedTeamData = getSelectedTeamData();
  
  // Current members count
  const currentMembersCount = selectedTeamData?.teamMembers?.length || 0;
  const hasMinimumMembers = currentMembersCount >= minAdditionalMembers;
  const membersNeeded = Math.max(0, minAdditionalMembers - currentMembersCount);

  // ================= CHECK FOR DELETED REGISTRATION =================
  useEffect(() => {
    if (event && userEnrollments?.length > 0) {
      const deletedReg = userEnrollments.find(reg => {
        if (!reg) return false;
        const regEventId = reg.eventId?._id || reg.eventId;
        return regEventId === event._id && 
               reg.isDeleted === true && 
               reg.status === "cancelled";
      });
      
      setHasDeletedRegistration(!!deletedReg);
      setDeletedRegistrationId(deletedReg?._id || null);
    } else {
      setHasDeletedRegistration(false);
      setDeletedRegistrationId(null);
    }
  }, [event, userEnrollments]);

  // ================= SAFE USER ENROLLMENTS =================
  const safeUserEnrollments = Array.isArray(userEnrollments) ? userEnrollments : [];

  // ================= CHECK ENROLLED MEMBERS =================
  const checkEnrolledMembers = (team) => {
    if (!team || !safeUserEnrollments.length || !event) return [];
    
    const teamUserIds = [
      team.teamLeader?._id || team.teamLeader,
      ...(team.teamMembers?.map(m => m._id || m) || [])
    ].filter(id => id);
    
    const enrolledUserIds = safeUserEnrollments
      .filter(enrollment => {
        if (!enrollment || enrollment.isDeleted) return false;
        const enrollmentEventId = enrollment.eventId?._id || enrollment.eventId;
        const currentEventId = event._id;
        return enrollmentEventId === currentEventId;
      })
      .map(enrollment => enrollment.userId?.toString())
      .filter(id => id);
    
    return teamUserIds.filter(userId => 
      enrolledUserIds.includes(userId?.toString())
    );
  };

  // Update enrolled members
  useEffect(() => {
    if (selectedTeamData) {
      const enrolled = checkEnrolledMembers(selectedTeamData);
      setEnrolledMembers(enrolled);
    } else {
      setEnrolledMembers([]);
    }
  }, [selectedTeamData, safeUserEnrollments, event]);

  // ================= CHECK IF TEAM IS ENROLLED =================
  const isTeamEnrolled = (team) => {
    if (!team || !safeUserEnrollments.length || !event) return false;
    
    return safeUserEnrollments.some(enrollment => {
      if (!enrollment || enrollment.isDeleted) return false;
      const enrollmentEventId = enrollment.eventId?._id || enrollment.eventId;
      if (enrollmentEventId !== event._id) return false;
      const enrollmentTeamId = enrollment.teamId?._id || enrollment.teamId;
      return enrollmentTeamId === team._id;
    });
  };

  // ================= CHECK IF MEMBER IS ENROLLED =================
  const isMemberEnrolled = (memberId) => {
    if (!memberId || !enrolledMembers.length) return false;
    return enrolledMembers.includes(memberId?.toString());
  };

  // ================= UTILITY FUNCTIONS =================
  const preventBodyScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
  };

  const restoreBodyScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  };

  const resetForm = () => {
    setCreatingNewTeam(false);
    setNewTeamName('');
    setTeamMembers(['']);
    setTeamCreationError('');
    setNewlyCreatedTeam(null);
    setTeamCreationStep('select');
    setMemberAddStatus({});
    setSelectedTeam(null);
    setRemovingMember(null);
    setEnrolledMembers([]);
  };

  // ================= API CALLS =================
  const refreshUserTeams = async () => {
    if (!token) {
      console.error('No token available');
      return [];
    }
    
    try {
      setIsRefreshingTeams(true);
      const response = await api.get('/teams/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const fetchedTeams = response.data.data || [];
      setTeamOptions(fetchedTeams);
      
      if (newlyCreatedTeam) {
        const updatedTeam = fetchedTeams.find(t => t._id === newlyCreatedTeam._id);
        if (updatedTeam) setNewlyCreatedTeam(updatedTeam);
      }
      
      return fetchedTeams;
    } catch (error) {
      console.error('Error refreshing teams:', error);
      const errorMessage = error.response?.data?.message || 'Failed to refresh teams';
      setTeamCreationError(errorMessage);
      return [];
    } finally {
      setIsRefreshingTeams(false);
    }
  };

  const checkExistingEnrollment = () => {
    if (!event || !safeUserEnrollments) return;
    
    const existingEnrollment = safeUserEnrollments.find(
      enrollment => {
        if (!enrollment || enrollment.isDeleted) return false;
        const enrollmentEventId = enrollment.eventId?._id || enrollment.eventId;
        return enrollmentEventId === event._id;
      }
    );
    
    if (existingEnrollment) {
      setIsAlreadyEnrolled(true);
      setEnrolledTeamInfo({
        teamName: existingEnrollment.team?.teamName,
        teamId: existingEnrollment.team?._id,
        enrolledAt: existingEnrollment.enrolledAt || existingEnrollment.createdAt
      });
    } else {
      setIsAlreadyEnrolled(false);
      setEnrolledTeamInfo(null);
    }
  };

  // ================= TEAM OPERATIONS =================
  const createNewTeam = async () => {
    if (!newTeamName.trim()) {
      setTeamCreationError('Team name is required');
      return;
    }

    if (isAlreadyEnrolled) {
      setTeamCreationError('You are already enrolled in this event');
      return;
    }

    try {
      setIsSubmitting(true);
      setTeamCreationError('');

      const createResponse = await api.post('/teams', {
        teamName: newTeamName.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!createResponse.data.success) {
        throw new Error(createResponse.data.message || 'Failed to create team');
      }

      const newTeam = createResponse.data.data;
      console.log('Created new team:', newTeam);
      
      await refreshUserTeams();
      
      setNewlyCreatedTeam(newTeam);
      setSelectedTeam(newTeam._id);
      setTeamCreationStep('add-members');
      setTeamCreationError('');
      
    } catch (error) {
      console.error('Team creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create team';
      
      if (error.response?.status === 409) {
        setTeamCreationError('Team name already exists. Please choose a different name.');
      } else {
        setTeamCreationError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTeamMember = async (memberIdentifier, index) => {
    if (!memberIdentifier.trim()) {
      setMemberAddStatus(prev => ({ ...prev, [index]: 'Please enter email or user ID' }));
      return;
    }

    if (!selectedTeam) {
      setMemberAddStatus(prev => ({ ...prev, [index]: 'No team selected' }));
      return;
    }

    if (memberIdentifier.trim() === user.email || memberIdentifier.trim() === user.userId) {
      setMemberAddStatus(prev => ({ ...prev, [index]: 'You are already the team leader' }));
      return;
    }

    try {
      setMemberAddStatus(prev => ({ ...prev, [index]: 'loading' }));

      const response = await api.post(`/teams/${selectedTeam}/members`, {
        userIdentifier: memberIdentifier.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add member');
      }

      setMemberAddStatus(prev => ({ ...prev, [index]: 'success' }));
      
      const updatedMembers = [...teamMembers];
      updatedMembers[index] = '';
      setTeamMembers(updatedMembers);

      await refreshUserTeams();

      setTimeout(() => {
        setMemberAddStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[index];
          return newStatus;
        });
      }, 2000);

    } catch (error) {
      console.error('Error adding team member:', error);
      
      let errorMessage = 'Failed to add member';
      
      if (error.response?.status === 403) {
        errorMessage = 'Only team leader can add members';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (error.response?.status === 409) {
        errorMessage = 'User already in team';
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      setMemberAddStatus(prev => ({ ...prev, [index]: errorMessage }));
    }
  };

  const removeTeamMember = async (memberId, memberName) => {
    if (!selectedTeam || !memberId) return;

    if (!window.confirm(`Are you sure you want to remove ${memberName || 'this member'} from the team?`)) {
      return;
    }

    try {
      setRemovingMember(memberId);

      const response = await api.delete(`/teams/${selectedTeam}/members/${memberId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove member');
      }

      await refreshUserTeams();
      setTeamCreationError('');
      
    } catch (error) {
      console.error('Error removing team member:', error);
      
      let errorMessage = 'Failed to remove member';
      
      if (error.response?.status === 403) {
        errorMessage = 'Only team leader can remove members';
      } else if (error.response?.status === 404) {
        errorMessage = 'Team or member not found';
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      setTeamCreationError(errorMessage);
      setTimeout(() => setTeamCreationError(''), 3000);
      
    } finally {
      setRemovingMember(null);
    }
  };

  const getTeamDetails = async (teamId) => {
    try {
      const response = await api.get(`/teams/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const teamData = response.data.data;
        console.log('Fetched team details:', teamData);
        
        setTeamOptions(prev => 
          prev.map(t => t._id === teamId ? teamData : t)
        );
        
        if (newlyCreatedTeam?._id === teamId) {
          setNewlyCreatedTeam(teamData);
        }
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const deleteTeam = async (teamId) => {
    if (!teamId) return;

    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.delete(`/teams/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete team');
      }

      await refreshUserTeams();
      setSelectedTeam(null);
      setNewlyCreatedTeam(null);
      setTeamCreationStep('select');

    } catch (error) {
      console.error('Error deleting team:', error);
      
      let errorMessage = 'Failed to delete team';
      
      if (error.response?.status === 403) {
        errorMessage = 'Only team leader can delete the team';
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      setTeamCreationError(errorMessage);
      setTimeout(() => setTeamCreationError(''), 3000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= HANDLER FUNCTIONS =================
  useEffect(() => {
    if (userTeams.length > 0) {
      setTeamOptions(userTeams);
    }
    checkExistingEnrollment();
  }, [userTeams, event, safeUserEnrollments]);

  useEffect(() => {
    if (isOpen) {
      preventBodyScroll();
    } else {
      restoreBodyScroll();
      resetForm();
    }

    return () => {
      restoreBodyScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const handleRemoveMemberInput = (index) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    setTeamMembers(newMembers);
    
    const newStatus = { ...memberAddStatus };
    delete newStatus[index];
    setMemberAddStatus(newStatus);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...teamMembers];
    newMembers[index] = value;
    setTeamMembers(newMembers);
    
    if (memberAddStatus[index] && memberAddStatus[index] !== 'loading' && memberAddStatus[index] !== 'success') {
      setMemberAddStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[index];
        return newStatus;
      });
    }
  };

  const handleCreateNewTeam = () => {
    if (isAlreadyEnrolled) {
      setTeamCreationError('You are already enrolled in this event');
      return;
    }
    
    setTeamCreationStep('create');
    setNewTeamName('');
    setTeamMembers(['']);
    setTeamCreationError('');
  };

  const handleBackToTeamSelection = () => {
    setTeamCreationStep('select');
    setNewlyCreatedTeam(null);
    setSelectedTeam(null);
    setTeamMembers(['']);
    setTeamCreationError('');
    setMemberAddStatus({});
  };

  // ✅ UPDATED: Handle submit with restore support
  const handleSubmit = async () => {
    // Authentication check
    if (!isAuthenticated) {
      alert('Please login to continue');
      return;
    }

    // ✅ If has deleted registration, call restore
    if (hasDeletedRegistration && deletedRegistrationId) {
      setIsSubmitting(true);
      try {
        await onRestore(deletedRegistrationId, event, selectedTeam);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Restore error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to restore registration';
        setTeamCreationError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Check if already enrolled
    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this event');
      return;
    }

    // Team event validations
    if (event.eventType !== 'solo') {
      if (!selectedTeam) {
        alert('Please select a team');
        return;
      }

      if (selectedTeamData && isTeamEnrolled(selectedTeamData)) {
        setTeamCreationError('This team is already enrolled in this event');
        return;
      }

      const latestTeamData = getSelectedTeamData();
      const latestMemberCount = latestTeamData?.teamMembers?.length || 0;
      const meetsRequirement = latestMemberCount >= minAdditionalMembers;

      if (!meetsRequirement) {
        setTeamCreationError(`Add at least ${minAdditionalMembers} team member${minAdditionalMembers > 1 ? 's' : ''} before enrolling`);
        return;
      }
    }

    // Normal enrollment
    setIsSubmitting(true);
    try {
      await onEnroll(event, selectedTeam);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Enrollment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to enroll';
      setTeamCreationError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= FILTER TEAMS =================
  const filteredTeams = teamOptions.filter(team => {
    const teamEnrolled = isTeamEnrolled(team);
    return !teamEnrolled;
  });

  // ================= BUTTON CONFIGURATION =================
  const getButtonConfig = () => {
    if (isSubmitting) {
      return {
        text: 'Processing...',
        disabled: true,
        icon: <Loader2 className="w-4 h-4 animate-spin" />
      };
    }

    // ✅ Show Re-enroll for deleted registrations
    if (hasDeletedRegistration) {
      return {
        text: 'Re-enroll Now',
        disabled: false,
        icon: null
      };
    }

    if (isAlreadyEnrolled) {
      return {
        text: 'Already Enrolled',
        disabled: true,
        icon: <CheckCircle className="w-4 h-4" />
      };
    }

    if (event.eventType === 'solo') {
      return {
        text: 'Enroll Now',
        disabled: false
      };
    }

    if (!selectedTeam) {
      return {
        text: 'Select a Team',
        disabled: true
      };
    }

    if (selectedTeamData && isTeamEnrolled(selectedTeamData)) {
      return {
        text: 'Already Enrolled',
        disabled: true
      };
    }

    if (minAdditionalMembers > 0 && !hasMinimumMembers) {
      const needed = Math.max(0, minAdditionalMembers - currentMembersCount);
      return {
        text: `Add ${needed} More Member${needed > 1 ? 's' : ''}`,
        disabled: true
      };
    }

    return {
      text: 'Enroll Team',
      disabled: false
    };
  };

  // ================= RENDER FUNCTIONS =================
  const renderTeamSelection = () => (
    <>
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
        {filteredTeams.length > 0 ? (
          filteredTeams.map(team => {
            const isSelected = selectedTeam === team._id;
            const teamSize = 1 + (team.teamMembers?.length || 0);
            const hasMinMembers = (team.teamMembers?.length || 0) >= minAdditionalMembers;
            const isLeader = team.teamLeader?._id === user?._id || team.teamLeader === user?._id;
            const teamEnrolled = isTeamEnrolled(team);
            
            if (teamEnrolled) return null;
            
            return (
              <div
                key={team._id}
                className={`p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-[#4b1b7a] bg-[#4b1b7a]/10' 
                    : 'border-[#b692ff] hover:border-[#4b1b7a]'
                }`}
              >
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="team"
                    value={team._id}
                    checked={isSelected}
                    onChange={(e) => {
                      setSelectedTeam(e.target.value);
                      setTeamCreationStep('select');
                    }}
                    className="mt-1 mr-3"
                    disabled={loading || isSubmitting}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#2b123f]">{team.teamName}</span>
                      {isLeader && (
                        <span className="text-xs bg-[#4b1b7a]/20 text-[#4b1b7a] px-2 py-0.5 rounded-full">
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#2b123f]/80 mt-1">
                      {teamSize} member{teamSize !== 1 ? 's' : ''}
                      {!hasMinMembers && minAdditionalMembers > 0 && (
                        <span className="ml-2 text-orange-500 text-xs font-semibold">
                          ⚠️ Need {minAdditionalMembers - (team.teamMembers?.length || 0)} more 
                        </span>
                      )}
                      {hasMinMembers && (
                        <span className="ml-2 text-green-500 text-xs font-semibold">
                          ✓ Ready to enroll
                        </span>
                      )}
                    </div>
                    
                    {team.teamMembers?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-[#2b123f]/60">Members:</p>
                        {team.teamMembers.map((member, idx) => {
                          const memberId = member._id || member;
                          const isEnrolled = isMemberEnrolled(memberId);
                          
                          return (
                            <div key={idx} className="flex items-center justify-between gap-1 text-xs text-[#2b123f]/80 ml-1">
                              <div className="flex items-center gap-1">
                                <User size={12} className="text-[#4b1b7a]/60" />
                                <span>{member.name || member.userId || 'Unknown'}</span>
                              </div>
                              {isEnrolled && (
                                <CheckCircle size={12} className="text-green-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {hasMinMembers && (
                    <CheckCircle size={16} className="text-green-500 ml-2 shrink-0" />
                  )}
                </label>
              </div>
            );
          })
        ) : (
          <div className="text-center p-4 border border-[#b692ff] rounded-xl bg-white/50">
            <p className="text-[#2b123f]/80">No available teams found</p>
            <p className="text-sm text-[#2b123f]/60 mt-1">Create a new team to continue</p>
          </div>
        )}
      </div>

      <button
        onClick={handleCreateNewTeam}
        disabled={loading || isSubmitting}
        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-[#b692ff] hover:border-[#4b1b7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 font-bold cursor-pointer"
      >
        <Plus size={18} className="text-[#4b1b7a]" />
        <span className="font-bold text-[#2b123f]">Create New Team</span>
      </button>
    </>
  );

  const renderTeamCreation = () => (
    <div className="space-y-4 p-4 bg-white/50 rounded-xl mb-6">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handleBackToTeamSelection}
          className="p-1 hover:bg-[#b692ff]/30 rounded-full transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} className="text-[#4b1b7a]" />
        </button>
        <h4 className="font-semibold text-[#2b123f]">Create New Team</h4>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2b123f] mb-2">
          Team Name
        </label>
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => {
            setNewTeamName(e.target.value);
            setTeamCreationError('');
          }}
          className="w-full px-3 py-2 bg-white border border-[#b692ff] rounded-lg text-[#2b123f] disabled:opacity-50 font-milonga focus:outline-none focus:border-[#4b1b7a]"
          placeholder="Enter team name"
          disabled={isSubmitting}
          autoFocus
          maxLength={50}
        />
        <p className="text-xs text-[#2b123f]/60 mt-1">
          {newTeamName.length}/50 characters
        </p>
      </div>

      <button
        onClick={createNewTeam}
        disabled={!newTeamName.trim() || isSubmitting}
        className="w-full px-4 py-3 bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] text-white rounded-xl font-semibold hover:from-[#6b2bb9] hover:to-[#8a3cd8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Team...
          </div>
        ) : (
          'Create Team'
        )}
      </button>

      {teamCreationError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-600 font-milonga">{teamCreationError}</p>
        </div>
      )}
    </div>
  );

  const renderAddMembers = () => {
    const teamToShow = selectedTeamData || newlyCreatedTeam;
    
    if (!teamToShow) return null;

    const isLeader = teamToShow.teamLeader?._id === user?._id || teamToShow.teamLeader === user?._id;
    const teamEnrolled = isTeamEnrolled(teamToShow);

    return (
      <div className="space-y-4 p-4 bg-white/50 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToTeamSelection}
              className="p-1 hover:bg-[#b692ff]/30 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <ArrowLeft size={20} className="text-[#4b1b7a]" />
            </button>
            <h4 className="font-semibold text-[#2b123f]">Team: {teamToShow.teamName}</h4>
          </div>
          
          {isLeader && !teamEnrolled && (
            <button
              onClick={() => deleteTeam(teamToShow._id)}
              disabled={isSubmitting}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete Team"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="mb-3">
            <p className="text-xs font-medium text-[#2b123f]/80 mb-1">Team Leader:</p>
            <div className="flex items-center gap-2 ml-2">
              <User className="w-4 h-4 text-[#4b1b7a]" />
              <span className="text-sm text-[#2b123f]">
                {teamToShow.teamLeader?.name || user?.name || user?.email} 
                {isLeader && ' (You)'}
              </span>
              <CheckCircle size={14} className="text-green-500" />
              {isMemberEnrolled(teamToShow.teamLeader?._id) && (
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
                  Enrolled
                </span>
              )}
            </div>
          </div>
          
          {teamToShow.teamMembers?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-[#2b123f]/80 mb-1">Team Members:</p>
              {teamToShow.teamMembers.map((member, idx) => {
                const memberName = member.name || member.userId || member.email || 'Unknown';
                const memberId = member._id;
                const isEnrolled = isMemberEnrolled(memberId);
                
                return (
                  <div key={idx} className="flex items-center justify-between group ml-2 mb-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#4b1b7a]/60" />
                      <span className="text-sm text-[#2b123f]/80">
                        {memberName}
                      </span>
                      <CheckCircle size={14} className="text-green-500" />
                      {isEnrolled && (
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
                          Enrolled
                        </span>
                      )}
                    </div>
                    
                    {isLeader && !teamEnrolled && (
                      <button
                        onClick={() => removeTeamMember(memberId, memberName)}
                        disabled={removingMember === memberId}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all flex items-center gap-1"
                        title="Remove Member"
                      >
                        {removingMember === memberId ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span className="text-xs">Remove</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!teamEnrolled && minAdditionalMembers > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#2b123f]/60">Progress:</span>
                <span className={`font-medium ${hasMinimumMembers ? 'text-green-600' : 'text-orange-600'}`}>
                  {teamToShow.teamMembers?.length || 0}/{minAdditionalMembers} members added
                </span>
              </div>
              <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    hasMinimumMembers ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                  style={{ 
                    width: `${Math.min(100, ((teamToShow.teamMembers?.length || 0) / minAdditionalMembers) * 100)}%` 
                  }}
                />
              </div>
              {!hasMinimumMembers && (
                <p className="text-xs text-orange-500 mt-2">
                  ⚠️ Add {membersNeeded} more member{membersNeeded > 1 ? 's' : ''} to enroll
                </p>
              )}
            </div>
          )}

          {teamEnrolled && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <p className="text-sm font-medium">This team is already enrolled!</p>
              </div>
              <p className="text-xs text-green-600 mt-1">
                All {teamToShow.teamMembers?.length + 1} members are registered for this event.
              </p>
            </div>
          )}
        </div>

        {isLeader && !hasMinimumMembers && !teamEnrolled && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserPlus size={16} className="text-[#4b1b7a]" />
              <label className="block text-sm font-medium text-[#2b123f]">
                Add Team Members (Minimum {minAdditionalMembers} required)
              </label>
            </div>
            <p className="text-xs text-[#2b123f]/60 mb-3">
              Add team members by their email address or user ID
            </p>
            
            {teamMembers.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#b692ff] rounded-lg text-[#2b123f] disabled:opacity-50 font-milonga focus:outline-none focus:border-[#4b1b7a]"
                  placeholder="Enter email or user ID"
                  disabled={isSubmitting || memberAddStatus[index] === 'loading'}
                />
                {member.trim() && (
                  <button
                    type="button"
                    onClick={() => addTeamMember(member, index)}
                    disabled={!member.trim() || isSubmitting || memberAddStatus[index] === 'loading'}
                    className="px-3 py-2 bg-[#4b1b7a] text-white rounded-lg hover:bg-[#6b2bb9] disabled:opacity-50 font-milonga min-w-[60px]"
                  >
                    {memberAddStatus[index] === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : memberAddStatus[index] === 'success' ? (
                      <Check className="w-4 h-4 mx-auto" />
                    ) : (
                      'Add'
                    )}
                  </button>
                )}
                {teamMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMemberInput(index)}
                    className="px-3 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 disabled:opacity-50 font-milonga"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddMember}
              className="mt-2 px-4 py-2 bg-[#4b1b7a]/20 text-[#4b1b7a] rounded-lg hover:bg-[#4b1b7a]/30 disabled:opacity-50 font-milonga"
              disabled={isSubmitting}
            >
              <Plus size={16} className="inline mr-1" />
              Add Another Member
            </button>
          </div>
        )}

        {!isLeader && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600">
              Only team leader can add or remove members.
            </p>
          </div>
        )}

        {Object.entries(memberAddStatus).map(([index, status]) => (
          typeof status === 'string' && status !== 'loading' && status !== 'success' && (
            <div key={index} className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-600">Member {parseInt(index) + 1}: {status}</p>
            </div>
          )
        ))}

        {hasMinimumMembers && !teamEnrolled && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={20} />
              <div>
                <p className="font-medium">✓ Minimum members requirement met!</p>
                <p className="text-sm mt-1">You can now enroll your team in the event.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTeamSection = () => {
    switch(teamCreationStep) {
      case 'create':
        return renderTeamCreation();
      case 'add-members':
        return renderAddMembers();
      default:
        return renderTeamSelection();
    }
  };

  const buttonConfig = getButtonConfig();

  // ================= RENDER =================
  if (!isOpen) return null;

  // Already Enrolled View
  if (isAlreadyEnrolled && !hasDeletedRegistration) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#eadbff] rounded-2xl w-full max-w-md border-2 border-dashed border-black/60 font-milonga">
          <div className="border-b border-[#b692ff] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#2b123f]">Already Enrolled</h3>
                <p className="text-[#2b123f]/80 text-sm mt-1">{event.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors"
              >
                <X size={20} className="text-[#2b123f]" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3 text-green-600">
                <Check className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Already Enrolled!</p>
                  <p className="text-sm mt-1">You are already registered for this event</p>
                </div>
              </div>
            </div>

            {enrolledTeamInfo && event.eventType !== 'solo' && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="font-semibold text-blue-600 mb-2">Enrollment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#2b123f]/80">Team:</span>
                    <span className="text-[#2b123f] font-medium">{enrolledTeamInfo.teamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2b123f]/80">Enrolled On:</span>
                    <span className="text-[#2b123f]">
                      {new Date(enrolledTeamInfo.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <h5 className="font-semibold text-yellow-600 mb-2">Important</h5>
              <p className="text-sm text-[#2b123f]/80">
                {event.eventType === 'solo' 
                  ? 'You cannot enroll again in a solo event.'
                  : 'You can only be enrolled in one team per event. To change teams, please contact event organizers.'}
              </p>
            </div>
          </div>

          <div className="border-t border-[#b692ff] p-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-2.5 bg-gradient-to-r from-[#b692ff] to-[#9e7aff] text-white rounded-xl font-semibold hover:from-[#9e7aff] hover:to-[#8a68ff] transition-all font-milonga"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#eadbff] rounded-2xl w-full max-w-md border-2 border-dashed border-black/60 max-h-[90vh] overflow-y-auto font-milonga no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#eadbff] border-b border-[#b692ff] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#2b123f]">
                {hasDeletedRegistration ? 'Re-enroll in Event' : 'Enroll in Event'}
              </h3>
              <p className="text-[#2b123f]/80 text-sm mt-1 line-clamp-1">{event.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} className="text-[#2b123f]" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="p-6 border-b border-green-500/30 bg-green-500/10">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">
                  {hasDeletedRegistration ? 'Successfully Re-enrolled!' : 'Successfully Enrolled!'}
                </p>
                <p className="text-sm mt-1">You have been registered for {event.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Event Info */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Event Requirements</h4>
                <ul className="text-sm text-[#2b123f]/80 space-y-1">
                  <li>• Event Type: {event.eventType === 'solo' ? 'Solo' : 'Team'}</li>
                  {event.eventType !== 'solo' && (
                    <li>• Team Size: {event.teamSize?.min || 1} - {event.teamSize?.max || 10} members</li>
                  )}
                  <li>• Registration Fee: ₹{event.fee || 0} {event.fee === 0 && '(Free)'}</li>
                  <li>• Registration closes: {new Date(event.registrationDeadline).toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Deleted Registration Notice */}
          {hasDeletedRegistration && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-purple-600 shrink-0 mt-0.5 animate-spin-slow" />
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Previous Registration Found</h4>
                  <p className="text-sm text-[#2b123f]/80">
                    You had previously cancelled your registration for this event. 
                    You can re-enroll now!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {event.eventType !== 'solo' && !hasDeletedRegistration && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-[#4b1b7a]" />
                <h4 className="font-semibold text-[#2b123f]">
                  {teamCreationStep === 'select' && 'Select Team'}
                  {teamCreationStep === 'create' && 'Create New Team'}
                  {teamCreationStep === 'add-members' && 'Manage Team'}
                </h4>
                {isRefreshingTeams && (
                  <RefreshCw size={16} className="text-[#4b1b7a] animate-spin ml-2" />
                )}
              </div>
              
              {minAdditionalMembers > 0 && teamCreationStep === 'select' && (
                <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">
                    ⚠️ This event requires at least {minAdditionalMembers} team member{minAdditionalMembers > 1 ? 's' : ''} (excluding team leader)
                  </p>
                </div>
              )}
              
              {renderTeamSection()}
            </div>
          )}

          {/* Solo Event Info */}
          {event.eventType === 'solo' && user && (
            <div className="mb-6 p-4 bg-[#4b1b7a]/10 border border-[#4b1b7a]/20 rounded-xl">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#4b1b7a]" />
                <div>
                  <h4 className="font-semibold text-[#4b1b7a] mb-1">Participant Details</h4>
                  <p className="text-sm text-[#2b123f]/80">You will be registered as:</p>
                  <p className="text-[#2b123f] font-medium mt-1">{user.name || user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <h5 className="font-semibold text-yellow-600 mb-2">Important Notes</h5>
            <ul className="text-sm text-[#2b123f]/80 space-y-1">
              <li>• Each participant can enroll only once per event</li>
              <li>• Registration fee is non-refundable</li>
              <li>• Team changes are not allowed after registration</li>
              <li>• All team members must agree to participate</li>
              <li>• Late entries will not be accepted</li>
              {event.eventType !== 'solo' && (
                <li>• Team leader must add minimum {minAdditionalMembers} team member{minAdditionalMembers > 1 ? 's' : ''}</li>
              )}
            </ul>
          </div>

          {/* Error */}
          {teamCreationError && teamCreationStep !== 'create' && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-600">{teamCreationError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#eadbff] border-t border-[#b692ff] p-6">
          <div className="flex justify-end gap-3 max-sm:flex-col">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-[#2b123f]/80 hover:text-[#2b123f] border border-[#b692ff] rounded-xl hover:border-[#4b1b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {event.eventType !== 'solo' && teamCreationStep === 'add-members' && !hasMinimumMembers && !isTeamEnrolled(selectedTeamData) && !hasDeletedRegistration ? (
              <button
                onClick={handleBackToTeamSelection}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                Back to Teams
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={buttonConfig.disabled}
                className={`px-6 py-2.5 bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] text-white rounded-xl font-semibold transition-all min-w-[180px] ${
                  buttonConfig.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-[#6b2bb9] hover:to-[#8a3cd8]'
                }`}
              >
                {buttonConfig.icon ? (
                  <div className="flex items-center justify-center gap-2">
                    {buttonConfig.icon}
                    {buttonConfig.text}
                  </div>
                ) : (
                  buttonConfig.text
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;