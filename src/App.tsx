/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CapsuleState } from './types';
import { SpaceshipLanding } from './components/SpaceshipLanding';
import { Sleek3DCapsule } from './components/Sleek3DCapsule';
import { OptionsView } from './components/OptionsView';
import { ARMemoryView } from './components/ARMemoryView';
import { TimeTravelAnimation } from './components/TimeTravelAnimation';
import { DashboardView } from './components/DashboardView';

const galaxyBg = '/src/assets/images/galaxy-background.png';

export default function App() {
  const [step, setStep] = useState<CapsuleState>('landing_window');
  const [exploredMemories, setExploredMemories] = useState<('ocean' | 'great_wall' | 'park_river')[]>([]);
  const [activeMemoryId, setActiveMemoryId] = useState<'ocean' | 'great_wall' | 'park_river' | null>(null);

  const handleSelectMemory = (nextStep: CapsuleState, id: 'ocean' | 'great_wall' | 'park_river') => {
    setActiveMemoryId(id);
    setStep(nextStep);
  };

  const handleExplorationComplete = (id: 'ocean' | 'great_wall' | 'park_river') => {
    const nextExplored = [...exploredMemories];
    if (!nextExplored.includes(id)) {
      nextExplored.push(id);
    }
    setExploredMemories(nextExplored);

    if (nextExplored.length >= 3) {
      // Trigger cinematic time travel sequence
      setStep('time_travel');
    } else {
      setStep('opened');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-white/30 font-sans">
      
      {/* 1. Landing Space Cockpit View */}
      {step === 'landing_window' && (
        <SpaceshipLanding 
          onZoomComplete={() => setStep('capsule_entry')} 
        />
      )}

      {/* 2. Deep Galaxy backdrop (Only visible during standard transitional states) */}
      {step !== 'landing_window' && step !== 'dashboard' && step !== 'time_travel' && step !== 'ar_view' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <img
            src={galaxyBg}
            alt="Deep Galaxy"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)]" />
        </motion.div>
      )}

      {/* Interactive 3D Capsule System (Only active during entry, prompt, or opened state background splitting) */}
      {(step === 'capsule_entry' || step === 'capsule_prompt' || step === 'opened') && (
        <Sleek3DCapsule 
          key="3d-capsule"
          step={step === 'opened' ? 'opened' : step === 'capsule_entry' ? 'capsule_entry' : 'capsule_prompt'}
          onEntryComplete={() => setStep('capsule_prompt')}
          onOpen={() => setStep('opened')}
        />
      )}

      {/* Main interactive content views */}
      <AnimatePresence mode="wait">
        {step === 'opened' && (
          <OptionsView 
            key="options" 
            onSelect={handleSelectMemory} 
            exploredMemories={exploredMemories}
          />
        )}

        {step === 'ar_view' && activeMemoryId && (
          <ARMemoryView
            key="ar_view"
            memoryId={activeMemoryId}
            onBack={() => setStep('opened')}
            onExplorationComplete={handleExplorationComplete}
          />
        )}

        {step === 'time_travel' && (
          <TimeTravelAnimation
            key="time_travel"
            onComplete={() => setStep('dashboard')}
          />
        )}

        {step === 'dashboard' && (
          <DashboardView key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  );
}
