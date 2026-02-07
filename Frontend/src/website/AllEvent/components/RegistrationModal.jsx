import React, { useState, useEffect } from 'react';
import { X, Users, Plus, User, AlertCircle, CheckCircle, Loader2, Mail, Check } from 'lucide-react';
import { api } from '../../../api/axios';

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
  userEnrollments = []
}) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [creatingNewTeam, setCreatingNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamCreationError, setTeamCreationError] = useState('');
  const [teamOptions, setTeamOptions] = useState(userTeams);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [enrolledTeamInfo, setEnrolledTeamInfo] = useState(null);

  // Function to prevent background scroll
  const preventBodyScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; // Prevent layout shift
  };

  // Function to restore background scroll
  const restoreBodyScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  };

  useEffect(() => {
    if (userTeams.length > 0) {
      setSelectedTeam(userTeams[0]._id);
      setTeamOptions(userTeams);
    }
    
    checkExistingEnrollment();
  }, [userTeams, event, userEnrollments]);

  // Handle body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      preventBodyScroll();
    } else {
      restoreBodyScroll();
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      restoreBodyScroll();
    };
  }, [isOpen]);

  const checkExistingEnrollment = () => {
    if (!event || !userEnrollments) return;
    
    const existingEnrollment = userEnrollments.find(
      enrollment => enrollment.eventId === event._id || enrollment.event?._id === event._id
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

  const filteredTeams = teamOptions.filter(team => {
    const teamSize = 1 + (team.teamMembers?.length || 0);
    
    const meetsSizeRequirements = (
      teamSize >= (event.teamSize?.min || 1) &&
      teamSize <= (event.teamSize?.max || 10)
    );
    
    const isTeamEnrolled = team.eventEnrollments?.some(
      enrollment => enrollment.eventId === event._id || enrollment.event?._id === event._id
    );
    
    return meetsSizeRequirements && !isTeamEnrolled;
  });

  const createNewTeam = async () => {
    if (!newTeamName.trim()) {
      setTeamCreationError('Team name is required');
      return null;
    }

    if (isAlreadyEnrolled) {
      setTeamCreationError('You are already enrolled in this event');
      return null;
    }

    try {
      setIsSubmitting(true);
      setTeamCreationError('');

      const createResponse = await api.post('/teams', {
        teamName: newTeamName
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const newTeam = createResponse.data.data;
      const teamId = newTeam._id;

      if (teamMembers.length > 0 && teamMembers.some(m => m.trim())) {
        for (const member of teamMembers) {
          if (member.trim()) {
            try {
              await api.post(`/teams/${teamId}/members`, {
                userIdentifier: member.trim()
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            } catch (addMemberError) {
              console.warn(`Failed to add member ${member}:`, addMemberError);
            }
          }
        }
      }

      const updatedTeamResponse = await api.get(`/teams/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedTeam = updatedTeamResponse.data.data;
      
      setTeamOptions(prev => [...prev, updatedTeam]);
      setSelectedTeam(updatedTeam._id);
      setCreatingNewTeam(false);
      
      return updatedTeam._id;
    } catch (error) {
      console.error('Team creation error:', error);
      setTeamCreationError(error.response?.data?.message || 'Failed to create team');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please login to continue');
      return;
    }

    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this event');
      return;
    }

    let teamId = selectedTeam;
    
    if (creatingNewTeam) {
      const newTeamId = await createNewTeam();
      if (!newTeamId) return;
      teamId = newTeamId;
    }

    if (!teamId && event.eventType !== 'solo') {
      alert('Please select or create a team');
      return;
    }

    setIsSubmitting(true);
    try {
      await onEnroll(event, teamId);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Enrollment error:', error);
      setTeamCreationError(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    setTeamMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...teamMembers];
    newMembers[index] = value;
    setTeamMembers(newMembers);
  };

  const handleCreateNewTeam = () => {
    if (isAlreadyEnrolled) {
      setTeamCreationError('You are already enrolled in this event');
      return;
    }
    
    setCreatingNewTeam(true);
    setSelectedTeam(null);
    setNewTeamName('');
    setTeamMembers(['']);
    setTeamCreationError('');
  };

  // Handle escape key to close modal
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

  if (!isOpen) return null;

  if (isAlreadyEnrolled) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#eadbff] rounded-2xl w-full max-w-md border-2 border-dashed border-black/60 font-milonga">
          {/* Header */}
          <div className="border-b border-[#b692ff] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#2b123f]">Already Enrolled</h3>
                <p className="text-[#2b123f]/80 text-sm mt-1">{event.title}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#2b123f]" />
              </button>
            </div>
          </div>

          {/* Already Enrolled Message */}
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

          {/* Footer */}
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
              <h3 className="text-xl font-bold text-[#2b123f]">Enroll in Event</h3>
              <p className="text-[#2b123f]/80 text-sm mt-1 line-clamp-1">{event.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#b692ff]/30 rounded-full transition-colors"
              disabled={loading || isSubmitting}
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
                <p className="font-semibold">Successfully Enrolled!</p>
                <p className="text-sm mt-1">You have been registered for {event.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Event Info Summary */}
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

          {/* Team Selection (for team events) */}
          {event.eventType !== 'solo' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-[#4b1b7a]" />
                <h4 className="font-semibold text-[#2b123f] milonga">
                  {creatingNewTeam ? 'Create New Team' : 'Select Team'}
                </h4>
              </div>
              
              {/* Existing Teams */}
              {!creatingNewTeam && (
                <>
                  <div className="space-y-3 mb-4">
                    {filteredTeams.length > 0 ? (
                      filteredTeams.map(team => (
                        <label
                          key={team._id}
                          className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedTeam === team._id
                              ? 'border-[#4b1b7a] bg-[#4b1b7a]/10' 
                              : 'border-[#b692ff] hover:border-[#4b1b7a]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="team"
                            value={team._id}
                            checked={selectedTeam === team._id}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="mr-3"
                            disabled={loading || isSubmitting}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-[#2b123f]">{team.teamName}</div>
                            <div className="text-sm text-[#2b123f]/80">
                              {1 + (team.teamMembers?.length || 0)} members
                            </div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-center p-4 border border-[#b692ff] rounded-xl bg-white/50">
                        <p className="text-[#2b123f]/80">No available teams found</p>
                        <p className="text-sm text-[#2b123f]/60 mt-1">Create a new team to continue</p>
                      </div>
                    )}
                  </div>

                  {/* Create New Team Button */}
                  <button
                    onClick={handleCreateNewTeam}
                    disabled={loading || isSubmitting}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-[#b692ff] hover:border-[#4b1b7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 milonga font-bold cursor-pointer"
                  >
                    <Plus size={18} className="text-[#4b1b7a]" />
                    <span className="font-bold text-[#2b123f] ">Create New Team</span>
                  </button>
                </>
              )} 

              {/* Create New Team Form */}
              {creatingNewTeam && (
                <div className="space-y-4 p-4 bg-white/50 rounded-xl mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2b123f] mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#b692ff] rounded-lg text-[#2b123f] disabled:opacity-50 font-milonga"
                      placeholder="Enter team name"
                      disabled={loading || isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-[#4b1b7a]" />
                      <label className="block text-sm font-medium text-[#2b123f]">
                        Team Members (Optional)
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
                          className="flex-1 px-3 py-2 bg-white border border-[#b692ff] rounded-lg text-[#2b123f] disabled:opacity-50 font-milonga"
                          placeholder="Enter email or user ID"
                          disabled={loading || isSubmitting}
                        />
                        {teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(index)}
                            className="px-3 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 disabled:opacity-50 font-milonga"
                            disabled={loading || isSubmitting}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="mt-2 px-4 py-2 bg-[#4b1b7a]/20 text-[#4b1b7a] rounded-lg hover:bg-[#4b1b7a]/30 disabled:opacity-50 font-milonga"
                      disabled={loading || isSubmitting}
                    >
                      Add Member
                    </button>
                  </div>

                  {/* Back to team selection */}
                  <button
                    onClick={() => {
                      setCreatingNewTeam(false);
                      setTeamCreationError('');
                    }}
                    className="w-full px-4 py-2 text-[#2b123f]/80 hover:text-[#2b123f] border border-[#b692ff] rounded-lg hover:border-[#4b1b7a] transition-colors font-milonga"
                    disabled={loading || isSubmitting}
                  >
                    ← Back to Team Selection
                  </button>

                  {teamCreationError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-sm text-red-600 font-milonga">{teamCreationError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Info (for solo events) */}
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

          {/* Terms and Conditions */}
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <h5 className="font-semibold text-yellow-600 mb-2">Important Notes</h5>
            <ul className="text-sm text-[#2b123f]/80 space-y-1 font-milonga">
              <li>• Each participant can enroll only once per event</li>
              <li>• Registration fee is non-refundable</li>
              <li>• Team changes are not allowed after registration</li>
              <li>• All team members must agree to participate</li>
              <li>• Late entries will not be accepted</li>
              <li>• Make sure all information is correct before submitting</li>
              {event.eventType !== 'solo' && (
                <li>• Team leader can add/remove members before registration</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#eadbff] border-t border-[#b692ff] p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading || isSubmitting}
              className="px-6 py-2.5 text-[#2b123f]/80 hover:text-[#2b123f] border border-[#b692ff] rounded-xl hover:border-[#4b1b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-milonga"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                loading || 
                isSubmitting ||
                (creatingNewTeam && !newTeamName.trim()) ||
                (event.eventType !== 'solo' && !selectedTeam && !creatingNewTeam)
              }
              className="px-6 py-2.5 bg-gradient-to-r from-[#4b1b7a] to-[#6b2bb9] text-white rounded-xl font-semibold hover:from-[#6b2bb9] hover:to-[#8a3cd8] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] font-milonga"
            >
              {(loading || isSubmitting) ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : event.eventType === 'solo' ? (
                'Enroll Now'
              ) : (
                'Enroll Team'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;