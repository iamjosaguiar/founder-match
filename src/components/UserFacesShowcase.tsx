import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  title: string;
  profileImage?: string;
  avatar: string;
}

interface UserFacesShowcaseProps {
  users?: User[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'grid' | 'stack' | 'row';
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'AI/ML Entrepreneur',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b188?w=400&h=400&fit=crop&crop=face',
    avatar: 'SC'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Full-Stack Developer',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    avatar: 'MR'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    title: 'Marketing Executive',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    avatar: 'EJ'
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Design & Strategy',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    avatar: 'DK'
  },
  {
    id: '5',
    name: 'Priya Patel',
    title: 'Biotech Entrepreneur',
    profileImage: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=400&h=400&fit=crop&crop=face',
    avatar: 'PP'
  },
  {
    id: '6',
    name: 'Alex Johnson',
    title: 'Climate Tech Founder',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    avatar: 'AJ'
  }
];

export function UserFacesShowcase({ users = defaultUsers, size = 'md', variant = 'stack' }: UserFacesShowcaseProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-4 max-w-xs">
        {users.slice(0, 6).map((user, index) => (
          <div key={user.id} className="flex flex-col items-center gap-2 group">
            <div className="relative">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name}
                  className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200`}
                />
              ) : (
                <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <AvatarFallback className={`${textSizeClasses[size]} font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white`}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900 truncate w-20">{user.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500 truncate w-20">{user.title.split(' ')[0]}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="flex items-center gap-3">
        {users.slice(0, 5).map((user, index) => (
          <div key={user.id} className="relative group">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200`}
              />
            ) : (
              <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <AvatarFallback className={`${textSizeClasses[size]} font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white`}>
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        ))}
        <div className="text-sm text-gray-600 ml-2">
          +{Math.max(0, users.length - 5)} more founders
        </div>
      </div>
    );
  }

  // Stack variant (default)
  return (
    <div className="flex items-center">
      {users.slice(0, 4).map((user, index) => (
        <div 
          key={user.id} 
          className="relative group"
          style={{ 
            marginLeft: index > 0 ? '-8px' : '0',
            zIndex: users.length - index 
          }}
        >
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name}
              className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 group-hover:z-50 transition-transform duration-200`}
            />
          ) : (
            <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg group-hover:scale-110 group-hover:z-50 transition-transform duration-200`}>
              <AvatarFallback className={`${textSizeClasses[size]} font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white`}>
                {user.avatar}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      ))}
      {users.length > 4 && (
        <div 
          className={`${sizeClasses[size]} rounded-full bg-gray-100 border-2 border-white shadow-lg flex items-center justify-center`}
          style={{ marginLeft: '-8px' }}
        >
          <span className={`${textSizeClasses[size]} font-semibold text-gray-600`}>
            +{users.length - 4}
          </span>
        </div>
      )}
    </div>
  );
}