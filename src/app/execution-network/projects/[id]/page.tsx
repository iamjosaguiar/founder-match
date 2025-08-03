"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard-layout";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  Scale,
  MessageCircle,
  User,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  Send,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  budget?: number;
  timeline?: string;
  complexity?: string;
  requirements?: string;
  techStack: string[];
  deliverables?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    image?: string;
    profileImage?: string;
    title?: string;
    location?: string;
  };
  matches: ProjectMatch[];
};

type ProjectMatch = {
  id: string;
  status: string;
  proposal?: string;
  proposedRate?: number;
  proposedTimeline?: string;
  createdAt: string;
  serviceProvider: {
    id: string;
    name: string;
    email: string;
    image?: string;
    profileImage?: string;
    title?: string;
    location?: string;
    hourlyRate?: number;
    serviceTypes: string[];
    portfolio?: string;
  };
};

const serviceTypeIcons = {
  development: Code,
  design: Palette,
  marketing: TrendingUp,
  legal: Scale,
  consulting: Briefcase
};

const statusColors = {
  open: 'bg-green-100 text-green-700 border-green-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
};

const matchStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  declined: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200'
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const projectId = params?.id as string;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signup?callbackUrl=" + encodeURIComponent(`/execution-network/projects/${projectId}`));
      return;
    }
    if (projectId) {
      fetchProject();
    }
  }, [session, status, router, projectId]);

  const fetchProject = async () => {
    if (!session || !projectId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setIsOwner(data.project.owner.email === session.user?.email);
      } else if (response.status === 404) {
        router.push('/execution-network/projects');
      } else if (response.status === 401) {
        router.push("/auth/signup?callbackUrl=" + encodeURIComponent(`/execution-network/projects/${projectId}`));
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/execution-network/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project || !isOwner) return;

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/execution-network/projects');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleMatchAction = async (matchId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch(`/api/projects/${project?.id}/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'accept' ? 'accepted' : 'declined' })
      });

      if (response.ok) {
        // Refresh project data
        fetchProject();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating match:', error);
      alert('Failed to update match. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading project...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Project Not Found</h1>
          <p className="text-slate-600 mb-6">The project you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild>
            <Link href="/execution-network/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const ServiceIcon = serviceTypeIcons[project.serviceType as keyof typeof serviceTypeIcons] || Briefcase;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/execution-network/projects" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Project Details */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white shadow-lg mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ServiceIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-slate-900 mb-2">{project.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted {formatDate(project.createdAt)}
                      </div>
                      {project.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${project.budget.toLocaleString()}
                        </div>
                      )}
                      {project.timeline && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.timeline}
                        </div>
                      )}
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Project Description</h3>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
                  </div>

                  {/* Requirements */}
                  {project.requirements && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Requirements</h3>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{project.requirements}</p>
                    </div>
                  )}

                  {/* Tech Stack */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables */}
                  {project.deliverables && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Expected Deliverables</h3>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{project.deliverables}</p>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <span className="font-medium text-slate-900">Service Type:</span>
                      <p className="text-slate-600 capitalize">{project.serviceType}</p>
                    </div>
                    {project.complexity && (
                      <div>
                        <span className="font-medium text-slate-900">Complexity:</span>
                        <p className="text-slate-600 capitalize">{project.complexity}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Project Owner */}
            <Card className="border-0 bg-white shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Project Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <UserAvatar 
                    size="md"
                    user={{
                      name: project.owner.name,
                      email: project.owner.email,
                      image: project.owner.image,
                      profileImage: project.owner.profileImage
                    }}
                  />
                  <div>
                    <p className="font-medium text-slate-900">{project.owner.name}</p>
                    {project.owner.title && (
                      <p className="text-sm text-slate-600">{project.owner.title}</p>
                    )}
                    {project.owner.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        {project.owner.location}
                      </div>
                    )}
                  </div>
                </div>
                {!isOwner && (
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Owner
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Apply/Proposals Section */}
            {!isOwner && project.status === 'open' && (
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Interested in this project?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Submit a proposal to work on this project
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Proposal
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Proposals/Matches (for owner) */}
            {isOwner && project.matches.length > 0 && (
              <Card className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Proposals ({project.matches.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.matches.map((match) => (
                      <div key={match.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar 
                              size="sm"
                              user={{
                                name: match.serviceProvider.name,
                                email: match.serviceProvider.email,
                                image: match.serviceProvider.image,
                                profileImage: match.serviceProvider.profileImage
                              }}
                            />
                            <div>
                              <p className="font-medium text-sm">{match.serviceProvider.name}</p>
                              {match.serviceProvider.title && (
                                <p className="text-xs text-slate-600">{match.serviceProvider.title}</p>
                              )}
                            </div>
                          </div>
                          <Badge className={matchStatusColors[match.status as keyof typeof matchStatusColors]}>
                            {match.status}
                          </Badge>
                        </div>
                        
                        {match.proposal && (
                          <p className="text-sm text-slate-700 mb-3">{match.proposal}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          {match.proposedRate && (
                            <span>${match.proposedRate}/hr</span>
                          )}
                          {match.proposedTimeline && (
                            <span>{match.proposedTimeline}</span>
                          )}
                          <span>{formatDate(match.createdAt)}</span>
                        </div>

                        {match.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleMatchAction(match.id, 'accept')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMatchAction(match.id, 'decline')}
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDeleteProject}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}