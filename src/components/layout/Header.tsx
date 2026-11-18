import React, { useState } from 'react';
import { UserProfile } from '../../types/user';
import { CampusId } from '../../types/campus';
import { Plus, LogIn, LogOut, User, Compass, Sparkles, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile | null;
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  onOpenCreate: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onSelectDevPersona: (persona: UserProfile | null) => void;
  devPersonas: UserProfile[];
  isDevUser: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  selectedCampus,
  onCampusChange,
  onOpenCreate,
  onSignIn,
  onSignOut,
  onSelectDevPersona,
  devPersonas,
  isDevUser,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showDevMenu, setShowDevMenu] = useState<boolean>(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-fordham-maroon flex items-center justify-center text-white font-black text-lg shadow-sm">
            <span>R</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">
                Ram<span className="text-fordham-maroon">Radar</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-fordham-maroon/10 text-fordham-maroon">
                Fordham
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Campus Activity Discovery
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Activity Button */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-fordham-maroon hover:bg-fordham-maroonDark text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Post Activity</span>
          </button>

          {/* Dev Switcher Dropdown (for instant 2-user real-time testing) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDevMenu(!showDevMenu);
                setShowUserMenu(false);
              }}
              title="Switch local persona to test multiple users"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Dev Personas</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showDevMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Fast User Switcher
                </div>
                <div className="px-3 pb-2 text-[11px] text-slate-500">
                  Switch personas to test real-time attendee limits and join/leave across accounts.
                </div>

                <div className="divide-y divide-slate-100">
                  {devPersonas.map((persona) => {
                    const isSelected = currentUser?.uid === persona.uid;
                    return (
                      <button
                        key={persona.uid}
                        onClick={() => {
                          onSelectDevPersona(persona);
                          setShowDevMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-fordham-maroon/5 font-semibold text-fordham-maroon' : 'text-slate-700'
                        }`}
                      >
                        <img
                          src={persona.photoURL}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1 truncate">
                          <p className="truncate">{persona.displayName}</p>
                          <p className="text-[10px] text-slate-400 capitalize">
                            {persona.campus?.replace('-', ' ')}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] bg-fordham-maroon text-white px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {isDevUser && (
                  <div className="pt-2 px-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onSelectDevPersona(null);
                        setShowDevMenu(false);
                      }}
                      className="w-full text-center py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Reset / Clear Persona
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile or Google Sign In */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowDevMenu(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-fordham-maroon text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:block">
                  {currentUser.displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser.email}
                    </p>
                    {isDevUser && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Dev Persona
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:border-fordham-maroon bg-white text-slate-700 hover:text-fordham-maroon text-xs sm:text-sm font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
