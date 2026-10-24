import React, { useState, useEffect } from 'react';
import { DateInvitation, DateResponse } from './types';
import { DEFAULT_INVITATION, GRADIENT_THEMES } from './data/defaults';
import { decodeInvitationFromUrl, encodeInvitationToUrl } from './utils/urlState';
import { Header } from './components/Header';
import { CreatorView } from './components/CreatorView';
import { ReceiverView } from './components/ReceiverView';
import { LiveCornerPreview } from './components/LiveCornerPreview';
import { FloatingHearts } from './components/FloatingHearts';
import { Sparkles, ArrowLeft, Heart } from 'lucide-react';

export default function App() {
  const [invitation, setInvitation] = useState<DateInvitation>(DEFAULT_INVITATION);
  const [mode, setMode] = useState<'creator' | 'receiver' | 'preview'>('creator');
  const [isRecipientUrl, setIsRecipientUrl] = useState(false);

  // Check URL on initial mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const invParam = searchParams.get('inv');
    if (invParam) {
      const decoded = decodeInvitationFromUrl(invParam);
      if (decoded) {
        setInvitation(decoded);
        setMode('receiver');
        setIsRecipientUrl(true);
        return;
      }
    }

    // Try reading from localStorage if creator had a saved draft
    const savedDraft = localStorage.getItem('bolzoo_invitation_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setInvitation(parsed);
      } catch {
        // use default
      }
    }
  }, []);

  // Save changes to localStorage for creator
  const handleUpdateInvitation = (updated: DateInvitation) => {
    setInvitation(updated);
    try {
      localStorage.setItem('bolzoo_invitation_draft', JSON.stringify(updated));
    } catch {
      // safe
    }
  };

  const handleCreateNew = () => {
    // Clear URL query parameters
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.pushState({}, '', cleanUrl);
    setInvitation({
      ...DEFAULT_INVITATION,
      id: `blz-${Date.now()}`,
      createdAt: Date.now(),
    });
    setMode('creator');
    setIsRecipientUrl(false);
  };

  const theme = GRADIENT_THEMES.find((t) => t.id === invitation.themeId) || GRADIENT_THEMES[0];

  return (
    <div className={`min-h-screen ${mode === 'creator' ? 'bg-slate-50' : theme.gradientClass} relative selection:bg-pink-300 selection:text-pink-900`}>
      {/* Top Header */}
      {mode === 'creator' && (
        <Header
          onNewInvitation={handleCreateNew}
          onPreviewMode={() => setMode('preview')}
          currentMode={mode}
        />
      )}

      {/* When in preview or recipient mode, show subtle top bar to return or create own */}
      {mode === 'preview' && (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('creator')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Зохиох горим руу буцах</span>
            </button>
            <span className="text-slate-500 hidden sm:inline">
              (Энэ бол хүлээн авагчийн харах яг тэр дэлгэц юм)
            </span>
          </div>

          <span className="text-pink-600 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Урьдчилан үзэх горим
          </span>
        </div>
      )}

      {isRecipientUrl && mode === 'receiver' && (
        <div className="fixed top-3 left-3 z-50">
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-pink-600 border border-pink-200 shadow-md px-3 py-1.5 rounded-full text-xs font-bold hover:bg-pink-50 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>Би бас урилга илгээмээр байна! ✨</span>
          </button>
        </div>
      )}

      {/* Main View Container */}
      <main className="relative z-10">
        {mode === 'creator' ? (
          <>
            <CreatorView
              invitation={invitation}
              onChangeInvitation={handleUpdateInvitation}
              onPreview={() => setMode('preview')}
            />

            {/* Corner Live Preview Widget */}
            <LiveCornerPreview
              invitation={invitation}
              onOpenFullPreview={() => setMode('preview')}
            />
          </>
        ) : (
          <ReceiverView
            invitation={invitation}
            isPreview={mode === 'preview'}
            onResponseCompleted={(res) => {
              console.log('Date response recorded', res);
            }}
          />
        )}
      </main>
    </div>
  );
}
