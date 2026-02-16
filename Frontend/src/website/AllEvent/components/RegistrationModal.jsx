import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  X, Users, Plus, User, AlertCircle, CheckCircle, Loader2, 
  Check, UserPlus, RefreshCw, ArrowLeft, Trash2, Mail, XCircle,
  MinusCircle
} from 'lucide-react';
import { api } from '../../../api/axios';

// ================ CONSTANTS ================
const TEAM_CREATION_STEPS = {
  SELECT: 'select',
  CREATE: 'create',
  ADD_MEMBERS: 'add-members'
};

const MEMBER_ADD_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// ================ UTILITY FUNCTIONS ================
const getMemberIdentifier = (member) => {
  if (!member) return '';
  return member.email || member.userId || member._id || '';
};

const getMemberName = (member) => {
  if (!member) return 'Unknown';
  return member.name || member.email || member.userId || 'Unknown';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// ================ MEMOIZED SUB-COMPONENTS ================

const SuccessMessage = React.memo(({ hasDeleted, eventTitle }) => (
  <div className="p-6 border-b border-green-500/30 bg-green-500/10">
    <div className="flex items-center gap-3 text-green-600">
      <CheckCircle className="w-6 h-6 animate-pulse" />
      <div>
        <p className="font-semibold">
          {hasDeleted ? 'Successfully Re-enrolled!' : 'Successfully Enrolled!'}
        </p>
        <p className="text-sm mt-1">You have been registered for {eventTitle}</p>
      </div>
    </div>
  </div>
));
SuccessMessage.displayName = 'SuccessMessage';

const EventInfoCard = React.memo(({ event }) => {
  const minMembers = event?.teamSize?.min || 1;
  const maxMembers = event?.teamSize?.max || 10;
  
  return (
    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">Event Requirements</h4>
          <ul className="text-sm text-[#2b123f]/80 space-y-1">
            <li>• Event Type: {event?.eventType === 'solo' ? 'Solo' : 'Team'}</li>
            {event?.eventType !== 'solo' && (
              <li>• Team Size: {minMembers} - {maxMembers} members</li>
            )}
            <li>• Registration Fee: ₹{event?.fee || 0} {event?.fee === 0 && '(Free)'}</li>
            <li>• Registration closes: {formatDate(event?.registrationDeadline)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
});
EventInfoCard.displayName = 'EventInfoCard';

const TeamRequirementsCard = React.memo(({ minAdditionalMembers }) => (
  <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
    <p className="text-sm text-orange-600 font-medium">
      ⚠️ This event requires at least {minAdditionalMembers} team member{minAdditionalMembers > 1 ? 's' : ''} (excluding team leader)
    </p>
  </div>
));
TeamRequirementsCard.displayName = 'TeamRequirementsCard';

const SoloParticipantCard = React.memo(({ user }) => (
  <div className="mb-6 p-4 bg-[#4b1b7a]/10 border border-[#4b1b7a]/20 rounded-xl">
    <div className="flex items-center gap-3">
      <User className="w-5 h-5 text-[#4b1b7a]" />
      <div>
        <h4 className="font-semibold text-[#4b1b7a] mb-1">Participant Details</h4>
        <p className="text-sm text-[#2b123f]/80">You will be registered as:</p>
        <p className="text-[#2b123f] font-medium mt-1">{user?.name || user?.email}</p>
      </div>
    </div>
  </div>
));
SoloParticipantCard.displayName = 'SoloParticipantCard';

const TermsCard = React.memo(({ eventType, minAdditionalMembers }) => (
  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
    <h5 className="font-semibold text-yellow-600 mb-2">Important Notes</h5>
    <ul className="text-sm text-[#2b123f]/80 space-y-1">
      <li>• Each participant can enroll only once per event</li>
      <li>• Registration fee is non-refundable</li>
      <li>• Team changes are not allowed after registration</li>
      <li>• All team members must agree to participate</li>
      <li>• Late entries will not be accepted</li>
      {eventType !== 'solo' && (
        <li>• Team leader must add minimum {minAdditionalMembers} team member{minAdditionalMembers > 1 ? 's' : ''}</li>
      )}
    </ul>
  </div>
));
TermsCard.displayName = 'TermsCard';

const TeamProgressBar = React.memo(({ current, required }) => {
  const percentage = Math.min(100, (current / required) * 100);
  const hasMinimum = current >= required;
  
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#2b123f]/60">Progress:</span>
        <span className={`font-medium ${hasMinimum ? 'text-green-600' : 'text-orange-600'}`}>
          {current}/{required} members added
        </span>
      </div>
      <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            hasMinimum ? 'bg-green-500' : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!hasMinimum && (
        <p className="text-xs text-orange-500 mt-2">
          ⚠️ Add {required - current} more member{required - current > 1 ? 's' : ''} to enroll
        </p>
      )}
    </div>
  );
});
TeamProgressBar.displayName = 'TeamProgressBar';

const MemberRow = React.memo(({ member, isLeader, canRemove, onRemove, isRemoving, isEnrolled }) => {
  const memberName = getMemberName(member);
  const memberId = member._id;
  
  return (
    <div className="flex items-center justify-between group ml-2 mb-1 py-1">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <User className="w-4 h-4 text-[#4b1b7a]/60 shrink-0" />
        <span className="text-sm text-[#2b123f]/80 truncate">
          {memberName}
        </span>
        <CheckCircle size={14} className="text-green-500 shrink-0" />
        {isEnrolled && (
          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full shrink-0">
            Enrolled
          </span>
        )}
      </div>
      
      {canRemove && !isEnrolled && (
        <button
          onClick={() => onRemove(memberId, memberName)}
          disabled={isRemoving === memberId}
          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all flex items-center gap-1 shrink-0"
          title="Remove Member"
        >
          {isRemoving === memberId ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <MinusCircle size={14} />
          )}
        </button>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.member._id === nextProps.member._id &&
    prevProps.isLeader === nextProps.isLeader &&
    prevProps.canRemove === nextProps.canRemove &&
    prevProps.isRemoving === nextProps.isRemoving &&
    prevProps.isEnrolled === nextProps.isEnrolled
  );
});
MemberRow.displayName = 'MemberRow';

// ================ MAIN COMPONENT ================
const RegistrationModal = ({
  isOpen,
  onClose,
  event,
  userTeams = [],
  onEnroll,
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
  const [teamCreationStep, setTeamCreationStep] = useState(TEAM_CREATION_STEPS.SELECT);
  const [memberAddStatus, setMemberAddStatus] = useState({});
  const [isRefreshingTeams, setIsRefreshingTeams] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);
  
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [enrolledTeamInfo, setEnrolledTeamInfo] = useState(null);
  
  // State to track enrolled members
  const [enrolledMembers, setEnrolledMembers] = useState([]);
  
  // Cache for team data
  const teamDataCache = useRef({});

  // Calculate minimum team members needed (excluding team leader)
  const minAdditionalMembers = event?.teamSize?.min ? event.teamSize.min - 1 : 0;
  const maxAdditionalMembers = event?.teamSize?.max ? event.teamSize.max - 1 : 9;
  
  // Get selected team data with latest updates
  const getSelectedTeamData = useCallback(() => {
    if (!selectedTeam) return null;
    
    // Check cache first
    if (teamDataCache.current[selectedTeam]) {
      return teamDataCache.current[selectedTeam];
    }
    
    // Then check in teamOptions
    const fromOptions = teamOptions.find(t => t._id === selectedTeam);
    if (fromOptions) {
      teamDataCache.current[selectedTeam] = fromOptions;
      return fromOptions;
    }
    
    // Then check newlyCreatedTeam
    if (newlyCreatedTeam?._id === selectedTeam) {
      teamDataCache.current[selectedTeam] = newlyCreatedTeam;
      return newlyCreatedTeam;
    }
    
    return null;
  }, [selectedTeam, teamOptions, newlyCreatedTeam]);
  
  const selectedTeamData = getSelectedTeamData();
  
  // Current members count
  const currentMembersCount = selectedTeamData?.teamMembers?.length || 0;
  const hasMinimumMembers = currentMembersCount >= minAdditionalMembers;
  const hasMaximumMembers = maxAdditionalMembers > 0 && currentMembersCount >= maxAdditionalMembers;
  const membersNeeded = Math.max(0, minAdditionalMembers - currentMembersCount);

  // ================= CHECK IF MEMBER IS ENROLLED =================
  const isMemberEnrolled = useCallback((memberId) => {
    if (!memberId || !enrolledMembers.length) return false;
    return enrolledMembers.includes(memberId?.toString());
  }, [enrolledMembers]);

  // ================= CHECK IF TEAM IS ENROLLED =================
  const isTeamEnrolled = useCallback((team) => {
    if (!team || !userEnrollments?.length || !event) return false;
    
    return userEnrollments.some(enrollment => {
      if (!enrollment) return false;
      const enrollmentEventId = enrollment.eventId?._id || enrollment.eventId;
      if (enrollmentEventId !== event._id) return false;
      const enrollmentTeamId = enrollment.teamId?._id || enrollment.teamId;
      return enrollmentTeamId === team._id;
    });
  }, [userEnrollments, event]);

  // ================= CHECK ENROLLED MEMBERS =================
  const checkEnrolledMembers = useCallback((team) => {
    if (!team || !userEnrollments?.length || !event) return [];
    
    const teamUserIds = [
      team.teamLeader?._id || team.teamLeader,
      ...(team.teamMembers?.map(m => m._id || m) || [])
    ].filter(Boolean);
    
    const enrolledUserIds = userEnrollments
      .filter(enrollment => {
        if (!enrollment) return false;
        const enrollmentEventId = enrollment.eventId?._id || enrollment.eventId;
        return enrollmentEventId === event._id;
      })
      .map(enrollment => enrollment.userId?.toString())
      .filter(Boolean);
    
    return teamUserIds.filter(userId => 
      enrolledUserIds.includes(userId?.toString())
    );
  }, [userEnrollments, event]);

  // Update enrolled members
  useEffect(() => {
    if (selectedTeamData) {
      const enrolled = checkEnrolledMembers(selectedTeamData);
      setEnrolledMembers(enrolled);
    } else {
      setEnrolledMembers([]);
    }
  }, [selectedTeamData, checkEnrolledMembers]);

  // Check existing enrollment
  useEffect(() => {
    if (!event || !userEnrollments?.length) {
      setIsAlreadyEnrolled(false);
      setEnrolledTeamInfo(null);
      return;
    }
    
    const existingEnrollment = userEnrollments.find(
      enrollment => {
        if (!enrollment) return false;
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
  }, [event, userEnrollments]);

  // Update team options
  useEffect(() => {
    if (userTeams?.length > 0) {
      setTeamOptions(userTeams);
      // Update cache
      userTeams.forEach(team => {
        teamDataCache.current[team._id] = team;
      });
    }
  }, [userTeams]);

  // Scroll lock effect
  useEffect(() => {
    if (!isOpen) return;
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setSelectedTeam(null);
      setCreatingNewTeam(false);
      setNewTeamName('');
      setTeamMembers(['']);
      setTeamCreationError('');
      setNewlyCreatedTeam(null);
      setTeamCreationStep(TEAM_CREATION_STEPS.SELECT);
      setMemberAddStatus({});
      setRemovingMember(null);
      setEnrolledMembers([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // ================= API CALLS =================
  const refreshUserTeams = useCallback(async () => {
    if (!token) return [];
    
    try {
      setIsRefreshingTeams(true);
      const response = await api.get('/teams/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const fetchedTeams = response.data.data || [];
      setTeamOptions(fetchedTeams);
      
      // Update cache
      fetchedTeams.forEach(team => {
        teamDataCache.current[team._id] = team;
      });
      
      if (newlyCreatedTeam) {
        const updatedTeam = fetchedTeams.find(t => t._id === newlyCreatedTeam._id);
        if (updatedTeam) {
          setNewlyCreatedTeam(updatedTeam);
          teamDataCache.current[updatedTeam._id] = updatedTeam;
        }
      }
      
      return fetchedTeams;
    } catch (error) {
      console.error('Error refreshing teams:', error);
      return [];
    } finally {
      setIsRefreshingTeams(false);
    }
  }, [token, newlyCreatedTeam]);

  const createNewTeam = useCallback(async () => {
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
      
      // Update cache
      teamDataCache.current[newTeam._id] = newTeam;
      
      await refreshUserTeams();
      
      setNewlyCreatedTeam(newTeam);
      setSelectedTeam(newTeam._id);
      setTeamCreationStep(TEAM_CREATION_STEPS.ADD_MEMBERS);
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
  }, [newTeamName, isAlreadyEnrolled, token, refreshUserTeams]);

  const addTeamMember = useCallback(async (memberIdentifier, index) => {
    if (!memberIdentifier.trim()) {
      setMemberAddStatus(prev => ({ ...prev, [index]: MEMBER_ADD_STATUS.ERROR }));
      return;
    }

    if (!selectedTeam) {
      setMemberAddStatus(prev => ({ ...prev, [index]: MEMBER_ADD_STATUS.ERROR }));
      return;
    }

    // Check if we've reached max members
    if (hasMaximumMembers) {
      setMemberAddStatus(prev => ({ ...prev, [index]: 'Maximum members reached' }));
      return;
    }

    if (memberIdentifier.trim() === user?.email || memberIdentifier.trim() === user?.userId) {
      setMemberAddStatus(prev => ({ ...prev, [index]: 'You are already the team leader' }));
      return;
    }

    try {
      setMemberAddStatus(prev => ({ ...prev, [index]: MEMBER_ADD_STATUS.LOADING }));

      const response = await api.post(`/teams/${selectedTeam}/members`, {
        userIdentifier: memberIdentifier.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add member');
      }

      setMemberAddStatus(prev => ({ ...prev, [index]: MEMBER_ADD_STATUS.SUCCESS }));
      
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
  }, [selectedTeam, user, token, refreshUserTeams, teamMembers, hasMaximumMembers]);

  const removeTeamMember = useCallback(async (memberId, memberName) => {
    if (!selectedTeam || !memberId) return;

    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
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
  }, [selectedTeam, token, refreshUserTeams]);

  const deleteTeam = useCallback(async (teamId) => {
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
      setTeamCreationStep(TEAM_CREATION_STEPS.SELECT);

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
  }, [token, refreshUserTeams]);

  // ================= HANDLER FUNCTIONS =================
  const handleAddMember = useCallback(() => {
    if (hasMaximumMembers) {
      setTeamCreationError(`Maximum team size of ${maxAdditionalMembers + 1} members reached`);
      setTimeout(() => setTeamCreationError(''), 3000);
      return;
    }
    setTeamMembers(prev => [...prev, '']);
  }, [hasMaximumMembers, maxAdditionalMembers]);

  const handleRemoveMemberInput = useCallback((index) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
    setMemberAddStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      return newStatus;
    });
  }, []);

  const handleMemberChange = useCallback((index, value) => {
    setTeamMembers(prev => {
      const newMembers = [...prev];
      newMembers[index] = value;
      return newMembers;
    });
    
    if (memberAddStatus[index] && 
        memberAddStatus[index] !== MEMBER_ADD_STATUS.LOADING && 
        memberAddStatus[index] !== MEMBER_ADD_STATUS.SUCCESS) {
      setMemberAddStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[index];
        return newStatus;
      });
    }
  }, [memberAddStatus]);

  const handleCreateNewTeam = useCallback(() => {
    if (isAlreadyEnrolled) {
      setTeamCreationError('You are already enrolled in this event');
      return;
    }
    
    setTeamCreationStep(TEAM_CREATION_STEPS.CREATE);
    setNewTeamName('');
    setTeamMembers(['']);
    setTeamCreationError('');
  }, [isAlreadyEnrolled]);

  const handleBackToTeamSelection = useCallback(() => {
    setTeamCreationStep(TEAM_CREATION_STEPS.SELECT);
    setNewlyCreatedTeam(null);
    setSelectedTeam(null);
    setTeamMembers(['']);
    setTeamCreationError('');
    setMemberAddStatus({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      alert('Please login to continue');
      return;
    }

    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this event');
      return;
    }

    // Team event validations
    if (event?.eventType !== 'solo') {
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
  }, [isAuthenticated, isAlreadyEnrolled, event, selectedTeam, selectedTeamData, isTeamEnrolled, getSelectedTeamData, minAdditionalMembers, onEnroll, onClose]);

  // ================= FILTER TEAMS =================
  const filteredTeams = useMemo(() => {
    if (!teamOptions.length) return [];
    
    return teamOptions.filter(team => {
      const teamEnrolled = isTeamEnrolled(team);
      return !teamEnrolled;
    });
  }, [teamOptions, isTeamEnrolled]);

  // ================= BUTTON CONFIGURATION =================
  const getButtonConfig = useCallback(() => {
    if (isSubmitting || loading) {
      return {
        text: 'Processing...',
        disabled: true,
        icon: <Loader2 className="w-4 h-4 animate-spin" />
      };
    }

    if (isAlreadyEnrolled) {
      return {
        text: 'Already Enrolled',
        disabled: true,
        icon: <CheckCircle className="w-4 h-4" />
      };
    }

    if (event?.eventType === 'solo') {
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
  }, [isSubmitting, loading, isAlreadyEnrolled, event, selectedTeam, selectedTeamData, isTeamEnrolled, minAdditionalMembers, hasMinimumMembers, currentMembersCount]);

  // ================= RENDER FUNCTIONS =================
  const renderTeamSelection = useCallback(() => (
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
                      setTeamCreationStep(TEAM_CREATION_STEPS.SELECT);
                    }}
                    className="mt-1 mr-3"
                    disabled={isSubmitting}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-medium text-[#2b123f] truncate">{team.teamName}</span>
                      {isLeader && (
                        <span className="text-xs bg-[#4b1b7a]/20 text-[#4b1b7a] px-2 py-0.5 rounded-full shrink-0">
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#2b123f]/80 mt-1">
                      {teamSize} member{teamSize !== 1 ? 's' : ''}
                      {!hasMinMembers && minAdditionalMembers > 0 && (
                        <span className="ml-2 text-orange-500 text-xs font-semibold">
                          ⚠️ Need {minAdditionalMembers - (team.teamMembers?.length || 0)} more,
                          add other from your profile
                        </span>
                      )}
                      {hasMinMembers && (
                        <span className="ml-2 text-green-500 text-xs font-semibold">
                          ✓ Ready to enroll / Add other from your profile
                        </span>
                      )}
                    </div>
                    
                    {team.teamMembers?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-[#2b123f]/60">Members:</p>
                        {team.teamMembers.slice(0, 3).map((member, idx) => {
                          const memberId = member._id || member;
                          const isEnrolled = isMemberEnrolled(memberId);
                          
                          return (
                            <div key={idx} className="flex items-center gap-1 text-xs text-[#2b123f]/80 ml-1">
                              <User size={12} className="text-[#4b1b7a]/60 shrink-0" />
                              <span className="truncate">{getMemberName(member)}</span>
                              {isEnrolled && (
                                <CheckCircle size={12} className="text-green-500 shrink-0 ml-1" />
                              )}
                            </div>
                          );
                        })}
                        {team.teamMembers.length > 3 && (
                          <p className="text-xs text-[#2b123f]/60 ml-1">
                            +{team.teamMembers.length - 3} more
                          </p>
                        )}
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
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-[#b692ff] hover:border-[#4b1b7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 font-bold cursor-pointer"
      >
        <Plus size={18} className="text-[#4b1b7a]" />
        <span className="font-bold text-[#2b123f]">Create New Team</span>
      </button>
    </>
  ), [filteredTeams, selectedTeam, isSubmitting, minAdditionalMembers, user, isTeamEnrolled, isMemberEnrolled, handleCreateNewTeam]);

  const renderTeamCreation = useCallback(() => (
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
  ), [newTeamName, isSubmitting, teamCreationError, createNewTeam, handleBackToTeamSelection]);

  const renderAddMembers = useCallback(() => {
    const teamToShow = selectedTeamData || newlyCreatedTeam;
    
    if (!teamToShow) return null;

    const isLeader = teamToShow.teamLeader?._id === user?._id || teamToShow.teamLeader === user?._id;
    const teamEnrolled = isTeamEnrolled(teamToShow);
    const canAddMore = !hasMaximumMembers && !teamEnrolled;

    return (
      <div className="space-y-4 p-4 bg-white/50 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={handleBackToTeamSelection}
              className="p-1 hover:bg-[#b692ff]/30 rounded-full transition-colors shrink-0"
              disabled={isSubmitting}
            >
              <ArrowLeft size={20} className="text-[#4b1b7a]" />
            </button>
            <h4 className="font-semibold text-[#2b123f] truncate">Team: {teamToShow.teamName}</h4>
          </div>
          
          {isLeader && !teamEnrolled && (
            <button
              onClick={() => deleteTeam(teamToShow._id)}
              disabled={isSubmitting}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
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
              <User className="w-4 h-4 text-[#4b1b7a] shrink-0" />
              <span className="text-sm text-[#2b123f] truncate">
                {teamToShow.teamLeader?.name || user?.name || user?.email} 
                {isLeader && ' (You)'}
              </span>
              <CheckCircle size={14} className="text-green-500 shrink-0" />
              {isMemberEnrolled(teamToShow.teamLeader?._id) && (
                <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full shrink-0">
                  Enrolled
                </span>
              )}
            </div>
          </div>
          
          {teamToShow.teamMembers?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-[#2b123f]/80 mb-1">Team Members:</p>
              {teamToShow.teamMembers.map((member) => (
                <MemberRow
                  key={member._id}
                  member={member}
                  isLeader={isLeader}
                  canRemove={isLeader && !teamEnrolled}
                  onRemove={removeTeamMember}
                  isRemoving={removingMember}
                  isEnrolled={isMemberEnrolled(member._id)}
                />
              ))}
            </div>
          )}

          {!teamEnrolled && minAdditionalMembers > 0 && (
            <TeamProgressBar 
              current={teamToShow.teamMembers?.length || 0} 
              required={minAdditionalMembers} 
            />
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

        {isLeader && !teamEnrolled && canAddMore && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserPlus size={16} className="text-[#4b1b7a]" />
              <label className="block text-sm font-medium text-[#2b123f]">
                Add Team Members {maxAdditionalMembers > 0 && `(Max ${maxAdditionalMembers + 1} total)`}
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
                  disabled={isSubmitting || memberAddStatus[index] === MEMBER_ADD_STATUS.LOADING}
                />
                {member.trim() && (
                  <button
                    type="button"
                    onClick={() => addTeamMember(member, index)}
                    disabled={!member.trim() || isSubmitting || memberAddStatus[index] === MEMBER_ADD_STATUS.LOADING}
                    className="px-3 py-2 bg-[#4b1b7a] text-white rounded-lg hover:bg-[#6b2bb9] disabled:opacity-50 font-milonga min-w-[60px]"
                  >
                    {memberAddStatus[index] === MEMBER_ADD_STATUS.LOADING ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : memberAddStatus[index] === MEMBER_ADD_STATUS.SUCCESS ? (
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
            
            {!hasMaximumMembers && (
              <button
                type="button"
                onClick={handleAddMember}
                className="mt-2 px-4 py-2 bg-[#4b1b7a]/20 text-[#4b1b7a] rounded-lg hover:bg-[#4b1b7a]/30 disabled:opacity-50 font-milonga"
                disabled={isSubmitting || hasMaximumMembers}
              >
                <Plus size={16} className="inline mr-1" />
                Add Another Member
              </button>
            )}

            {hasMaximumMembers && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Maximum team size reached! You can now enroll.
              </p>
            )}
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
          typeof status === 'string' && 
          status !== MEMBER_ADD_STATUS.LOADING && 
          status !== MEMBER_ADD_STATUS.SUCCESS && (
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
  }, [selectedTeamData, newlyCreatedTeam, user, isTeamEnrolled, isMemberEnrolled, isSubmitting, handleBackToTeamSelection, deleteTeam, removeTeamMember, removingMember, minAdditionalMembers, maxAdditionalMembers, teamMembers, memberAddStatus, hasMinimumMembers, hasMaximumMembers, handleMemberChange, addTeamMember, handleRemoveMemberInput, handleAddMember]);

  const renderTeamSection = useCallback(() => {
    switch(teamCreationStep) {
      case TEAM_CREATION_STEPS.CREATE:
        return renderTeamCreation();
      case TEAM_CREATION_STEPS.ADD_MEMBERS:
        return renderAddMembers();
      default:
        return renderTeamSelection();
    }
  }, [teamCreationStep, renderTeamCreation, renderAddMembers, renderTeamSelection]);

  const buttonConfig = getButtonConfig();

  // ================= RENDER =================
  if (!isOpen) return null;

  // Already Enrolled View
  if (isAlreadyEnrolled) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#eadbff] rounded-2xl w-full max-w-md border-2 border-dashed border-black/60 font-milonga">
          <div className="border-b border-[#b692ff] p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-[#2b123f]">Already Enrolled</h3>
                <p className="text-[#2b123f]/80 text-sm mt-1 truncate">{event?.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors shrink-0 ml-2"
              >
                <X size={20} className="text-[#2b123f]" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3 text-green-600">
                <Check className="w-6 h-6 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">Already Enrolled!</p>
                  <p className="text-sm mt-1">You are already registered for this event</p>
                </div>
              </div>
            </div>

            {enrolledTeamInfo && event?.eventType !== 'solo' && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="font-semibold text-blue-600 mb-2">Enrollment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#2b123f]/80 shrink-0">Team:</span>
                    <span className="text-[#2b123f] font-medium text-right truncate">{enrolledTeamInfo.teamName}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#2b123f]/80 shrink-0">Enrolled On:</span>
                    <span className="text-[#2b123f]">{formatDate(enrolledTeamInfo.enrolledAt)}</span>
                  </div>
                </div>
              </div>
            )}

            <TermsCard 
              eventType={event?.eventType} 
              minAdditionalMembers={minAdditionalMembers} 
            />
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
        <div className="sticky top-0 bg-[#eadbff] border-b border-[#b692ff] p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-[#2b123f]">Enroll in Event</h3>
              <p className="text-[#2b123f]/80 text-sm mt-1 truncate">{event?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors shrink-0 ml-2"
              disabled={isSubmitting}
            >
              <X size={20} className="text-[#2b123f]" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <SuccessMessage 
            hasDeleted={false} 
            eventTitle={event?.title} 
          />
        )}

        {/* Content */}
        <div className="p-6">
          <EventInfoCard event={event} />

          {/* Team Section */}
          {event?.eventType !== 'solo' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-[#4b1b7a]" />
                <h4 className="font-semibold text-[#2b123f]">
                  {teamCreationStep === TEAM_CREATION_STEPS.SELECT && 'Select Team'}
                  {teamCreationStep === TEAM_CREATION_STEPS.CREATE && 'Create New Team'}
                  {teamCreationStep === TEAM_CREATION_STEPS.ADD_MEMBERS && 'Manage Team'}
                </h4>
                {isRefreshingTeams && (
                  <RefreshCw size={16} className="text-[#4b1b7a] animate-spin ml-2" />
                )}
              </div>
              
              {minAdditionalMembers > 0 && teamCreationStep === TEAM_CREATION_STEPS.SELECT && (
                <TeamRequirementsCard minAdditionalMembers={minAdditionalMembers} />
              )}
              
              {renderTeamSection()}
            </div>
          )}

          {/* Solo Event Info */}
          {event?.eventType === 'solo' && user && (
            <SoloParticipantCard user={user} />
          )}

          <TermsCard 
            eventType={event?.eventType} 
            minAdditionalMembers={minAdditionalMembers} 
          />

          {/* Error */}
          {teamCreationError && teamCreationStep !== TEAM_CREATION_STEPS.CREATE && (
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
              className="px-6 py-2.5 text-[#2b123f]/80 cursor-pointer hover:text-[#2b123f] border border-[#b692ff] rounded-xl hover:border-[#4b1b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {event?.eventType !== 'solo' && 
             teamCreationStep === TEAM_CREATION_STEPS.ADD_MEMBERS && 
             !hasMinimumMembers && 
             !isTeamEnrolled(selectedTeamData) ? (
              <button
                onClick={handleBackToTeamSelection}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                Back to Teams
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={buttonConfig.disabled || isSubmitting}
                className={`px-6 py-2.5 bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] text-white rounded-xl font-semibold transition-all min-w-[180px] ${
                  buttonConfig.disabled || isSubmitting
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

// Custom comparison for memo
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.event?._id === nextProps.event?._id &&
    prevProps.loading === nextProps.loading &&
    prevProps.isAuthenticated === nextProps.isAuthenticated &&
    prevProps.userTeams?.length === nextProps.userTeams?.length &&
    prevProps.userEnrollments?.length === nextProps.userEnrollments?.length
  );
};

export default React.memo(RegistrationModal, areEqual);