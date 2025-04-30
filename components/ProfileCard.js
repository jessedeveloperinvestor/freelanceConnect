import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function ProfileCard({ profile }) {
  const { user } = useAuth();
  const router = useRouter();
  
  const handleMessage = () => {
    router.push(`/messages?recipient=${profile.id}`);
  };
  
  // Calculate member since date
  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long'
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-800">{profile.fullName || profile.username}</h3>
            <p className="text-gray-600">{profile.role === 'professional' ? 'Freelancer' : 'Client'}</p>
          </div>
        </div>
        
        {profile.role === 'professional' && (
          <>
            <div className="mt-4">
              <p className="text-gray-700">{profile.bio}</p>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills && profile.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">Member since {memberSince}</p>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <Link href={`/profile/${profile.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors">
            View Profile
          </Link>
          {user && user.id !== profile.id && (
            <button 
              onClick={handleMessage}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-center transition-colors"
            >
              Send Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
